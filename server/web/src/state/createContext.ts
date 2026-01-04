import React from 'react';

export default function createContext<T>() {
  const context = React.createContext<T | undefined>(undefined);

  const useContext = () => {
    const value = React.useContext(context);
    if (value === undefined) {
      throw new Error(
        `useContext must be used inside a Provider with a value that's not undefined`,
      );
    }
    return value;
  };
  return [useContext, context.Provider] as const;
}