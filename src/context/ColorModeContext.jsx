import React, { createContext, useState, useContext } from 'react';

const ColorModeContext = createContext();
const NoColorModeContext = createContext();

export const ColorModeProvider = ({ children }) => {
  const [colorMode, setColorMode] = useState('light'); // Mặc định là 'light'

  const toggleColorMode = () => {
    setColorMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'));
  };

  return (
    <ColorModeContext.Provider value={{ colorMode, setColorMode: toggleColorMode }}>
      {children}
    </ColorModeContext.Provider>
  );
};

export const NoColorModeProvider = ({ children }) => {
  return (
    <NoColorModeContext.Provider value={{}}>
      {children}
    </NoColorModeContext.Provider>
  );
};

export const useColorMode = () => {
  const context = useContext(ColorModeContext);
  if (!context) {
    throw new Error('useColorMode must be used within a ColorModeProvider');
  }
  return context;
};

export const useNoColorMode = () => {
  const context = useContext(NoColorModeContext);
  if (!context) {
    throw new Error('useNoColorMode must be used within a NoColorModeProvider');
  }
  return context;
};
