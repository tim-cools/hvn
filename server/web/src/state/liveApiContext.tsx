import createContext from "./createContext"
import React, {useEffect, useRef, useState} from 'react';
import ReconnectingWebSocket from "reconnecting-websocket";
import {ObjectPath} from "../api/objectPath";

export type IncomingMessage = {
  action: string,
  addr: string,
  args: any,
  value: any,
}

export type OutgoingMessage = {
  action: string,
  path: string,
  name: string | number | null
}

export abstract class MessageQueue<TQueue, TMessage> {

  public messages: TMessage[];

  public constructor(messages: TMessage[] = []) {
    this.messages = messages;
  }

  public queue(message: TMessage): TQueue {
    return this.createQueue([...this.messages, message]);
  }

  public queueAll(messages: TMessage[]): TQueue {
    return this.createQueue([...this.messages, ...messages]);
  }

  protected abstract createQueue(messages: TMessage[]): TQueue;

  remove(toRemove: ReadonlyArray<TMessage>): TQueue {
    const newMessages = this.messages.filter(message => toRemove.indexOf(message) >= 0)
    return this.createQueue(newMessages);
  }

  clear() {
    return this.createQueue([]);
  }
}

export class IncomingQueue extends MessageQueue<IncomingQueue, IncomingMessage> {
  protected override createQueue(messages: IncomingMessage[]) {
    return new IncomingQueue(messages);
  }
}

export class OutgoingQueue extends MessageQueue<OutgoingQueue, OutgoingMessage> {

  public getChildren(path: ObjectPath) {
    const data = {
      action: "get_children",
      path: path.fullPath(),
      name: 2,
    };
    return this.queue(data)
  }

  public getInfo(path: ObjectPath) {
    const data = {
      action: "get_info",
      path: path.fullPath(),
      name: null
    };
    return this.queue(data)
  }

  protected override createQueue(messages: OutgoingMessage[]) {
    return new OutgoingQueue(messages);
  }
}

export interface LiveApiState {
  lastMessage: any,
  setLastMessage: React.Dispatch<React.SetStateAction<any>>;

  incoming: IncomingQueue,
  setIncoming: React.Dispatch<React.SetStateAction<IncomingQueue>>;

  inspectorMessages: IncomingQueue,
  setInspectorMessages: React.Dispatch<React.SetStateAction<IncomingQueue>>;

  outgoing: OutgoingQueue;
  setOutgoing: React.Dispatch<React.SetStateAction<OutgoingQueue>>;
}

export const [useLiveApiContext, Provider] = createContext<LiveApiState>();

type ContextProviderProps = {
  children: React.ReactNode;
};

export const LiveApiProvider = ({children}: ContextProviderProps) => {

  const [lastMessage, setLastMessage] = useState<any | null>(null);
  const [incoming, setIncoming] = useState(new IncomingQueue());
  const [inspectorMessages, setInspectorMessages] = useState(new IncomingQueue());
  const [outgoing, setOutgoing] = useState(new OutgoingQueue());

  const webSocketRef = useRef<ReconnectingWebSocket | null>(null);

  const value = {
    lastMessage, setLastMessage,
    incoming, setIncoming,
    inspectorMessages, setInspectorMessages,
    outgoing, setOutgoing,
  };

  function connect() {
    console.log("connect")
    webSocketRef.current = new ReconnectingWebSocket("ws://localhost:8000/ws");
    webSocketRef.current.onerror = (): void => {
      console.log("webSocket onerror")
    };

    webSocketRef.current.onopen = (): void => {
      console.log("webSocket onopen")
      const data = {
        action: "get_children",
        path: "",
        name: 2,
      };
      setOutgoing(messages => messages.queue(data));
    };

    webSocketRef.current.onmessage = event => {
      const message = JSON.parse(event.data);
      setIncoming(messages => messages.queue(message));
      console.log("webSocket onmessage: ", message);
    };
  }

  useEffect(() => {
    console.log("webSocket initialize")
    connect();
    const wsCurrent = webSocketRef.current;
    return () => {
      console.log("useEffect.close")
      if (wsCurrent?.readyState === 1) {
        wsCurrent.close();
      }
    };
  }, []);

  useEffect(() => {
    console.log("incoming.messages: " + incoming.messages.length);
    if (incoming.messages.length === 0) return;
    setLastMessage(incoming.messages[incoming.messages.length]);
    setInspectorMessages(messages => messages.queueAll(incoming.messages));
    setIncoming(messages => messages.clear())
  }, [incoming]);

  useEffect(() => {
    console.log("outgoing.messages: " + outgoing.messages.length);
    if (outgoing.messages.length === 0) return;
    outgoing.messages.forEach(message => {
      const jsonValue = JSON.stringify(message);
      webSocketRef.current?.send(jsonValue);
    });
    setOutgoing(messages => messages.clear())
  }, [outgoing]);

  return <Provider value={value}>
    {children}
  </Provider>;
};