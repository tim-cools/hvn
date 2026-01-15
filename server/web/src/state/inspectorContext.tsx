import {LiveObject, LiveObjects} from "../api/abletonLive";
import createContext from "./createContext"
import React, {useEffect, useState} from 'react';
import {TreeNodeState} from "./treeNodeState";
import {LayoutState} from "./layoutState";
import {Loading} from "./loading";
import {useLiveApiContext} from "./liveApiContext";

export interface InspectorState {
  liveObjects: LiveObjects;
  setLiveObjects: React.Dispatch<React.SetStateAction<LiveObjects>>;

  currentLiveObject: LiveObject | null | Loading;
  setCurrentLiveObject: React.Dispatch<React.SetStateAction<LiveObject | null | Loading>>;

  liveObjectsTreeState: TreeNodeState;
  setLiveObjectsTreeState: React.Dispatch<React.SetStateAction<TreeNodeState>>;

  layout: LayoutState;
  setLayout: React.Dispatch<React.SetStateAction<LayoutState>>;
}

export const [useInspectorContext, Provider] = createContext<InspectorState>();

type ContextProviderProps = {
  children: React.ReactNode;
};

export const InspectorContextProvider = ({children}: ContextProviderProps) => {

  const [liveObjects, setLiveObjects] = useState<LiveObjects>(new LiveObjects());
  const [currentLiveObject, setCurrentLiveObject] = useState<LiveObject | null | Loading>(null);
  const [liveObjectsTreeState, setLiveObjectsTreeState] = useState<TreeNodeState>(new TreeNodeState());
  const [layout, setLayout] = useState(LayoutState.defaultState());

  const {inspectorMessages, setInspectorMessages} = useLiveApiContext();

  const value = {
    liveObjects, setLiveObjects,
    currentLiveObject, setCurrentLiveObject,
    liveObjectsTreeState, setLiveObjectsTreeState,
    layout, setLayout,
  };

  useEffect(() => {
    console.log("incoming.messages (inspectorMessages): " + inspectorMessages.messages.length);
    if (inspectorMessages.messages.length == 0) return;

    inspectorMessages.messages.forEach(message => {
      switch (message.action) {
        case "get_children":
          setLiveObjects(liveObjects => liveObjects.process(message.value, setLiveObjectsTreeState));
          break;
        case "get_info":
          setLiveObjects(liveObjects => liveObjects.processInfo(message.value, setLiveObjectsTreeState));
          break;
        default:
          console.log("Invalid action: " + message.action);
      }
    });

    setInspectorMessages(messages => messages.clear());
  }, [inspectorMessages]);

  return <Provider value={value}>
    {children}
  </Provider>;
};
