import React from 'react';
import {InspectorContextProvider} from "./inspectorContext";
import {LiveApiProvider} from "./liveApiContext";

type ContextsProps = {
  children: React.ReactNode;
};

export const Contexts = ({children}: ContextsProps) => {
  return (
    <LiveApiProvider>
      <InspectorContextProvider>
        {children}
      </InspectorContextProvider>
    </LiveApiProvider>
  );
};