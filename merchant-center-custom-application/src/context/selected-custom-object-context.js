import React, { createContext, useContext, useState } from 'react';

const SelectedCustomObjectContext = createContext();

export const useSelectedCustomObjectContext = () =>
  useContext(SelectedCustomObject);

export const SelectedCustomObjectProvider = ({ children }) => {
  const [selectedCustomObject, setSelectedCustomObject] = useState(null);

  return (
    <SelectedCustomObjectContext.Provider
      value={{ selectedCustomObject, setSelectedCustomObject }}
    >
      {children}
    </SelectedCustomObjectContext.Provider>
  );
};
