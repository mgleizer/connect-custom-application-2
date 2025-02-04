import React, { createContext, useContext, useState } from 'react';

const CustomObjects = createContext();

export const useCustomObjectsContext = () => useContext(CustomObjects);

export const CustomObjectsProvider = ({ children }) => {
  const [customObjects, setCustomObjects] = useState(null);

  return (
    <CustomObjects.Provider value={{ customObjects, setCustomObjects }}>
      {children}
    </CustomObjects.Provider>
  );
};
