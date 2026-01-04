import createContext from "./createContext"
import React, {useEffect, useRef, useState} from 'react';
import ReconnectingWebSocket from "reconnecting-websocket";

export type IncomingMessage = {
  action: string,
  addr: string,
  args: any,
  value: any,
}

export type OutgoingMessage = {
  action: string,
  path: string,
  name: string
}

export class MessageQueue<TMessage> {

  public messages: TMessage[];

  public constructor(messages: TMessage[] = []) {
    this.messages = messages;
  }

  public queue(message: TMessage): MessageQueue<TMessage> {
    return new MessageQueue([...this.messages, message]);
  }

  public queueAll(messages: TMessage[]): MessageQueue<TMessage> {
    return new MessageQueue([...this.messages, ...messages]);
  }

  remove(toRemove: ReadonlyArray<TMessage>): MessageQueue<TMessage> {
    const newMessages = this.messages.filter(message => toRemove.indexOf(message) >= 0)
    return new MessageQueue(newMessages);
  }

  clear() {
    return new MessageQueue([]);
  }
}

export interface LiveApiState {
  lastMessage: any,
  setLastMessage: React.Dispatch<React.SetStateAction<any>>;

  incoming: MessageQueue<IncomingMessage>,
  setIncoming: React.Dispatch<React.SetStateAction<MessageQueue<IncomingMessage>>>;

  inspectorMessages: MessageQueue<IncomingMessage>,
  setInspectorMessages: React.Dispatch<React.SetStateAction<MessageQueue<IncomingMessage>>>;

  outgoing: MessageQueue<any>;
  setOutgoing: React.Dispatch<React.SetStateAction<MessageQueue<any>>>;
}

export const [useLiveApiContext, Provider] = createContext<LiveApiState>();

type ContextProviderProps = {
  children: React.ReactNode;
};

export const LiveApiProvider = ({children}: ContextProviderProps) => {

  const [lastMessage, setLastMessage] = useState<any | null>(null);
  const [incoming, setIncoming] = useState(new MessageQueue<IncomingMessage>());
  const [inspectorMessages, setInspectorMessages] = useState(new MessageQueue<IncomingMessage>());
  const [outgoing, setOutgoing] = useState(new MessageQueue<any>());

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
    if (incoming.messages.length == 0) return;
    setLastMessage(incoming.messages[incoming.messages.length]);
    setInspectorMessages(messages => messages.queueAll(incoming.messages));
    setIncoming(messages => messages.clear())
  }, [incoming]);

  useEffect(() => {
    console.log("outgoing.messages: " + outgoing.messages.length);
    if (outgoing.messages.length == 0) return;
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