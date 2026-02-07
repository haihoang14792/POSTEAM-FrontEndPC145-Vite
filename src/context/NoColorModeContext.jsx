import React, { createContext, useContext } from 'react';

const NoColorModeContext = createContext();

export const NoColorModeProvider = ({ children }) => {
    return (
        <NoColorModeContext.Provider value={{}}>
            {children}
        </NoColorModeContext.Provider>
    );
};

export const useNoColorMode = () => {
    const context = useContext(NoColorModeContext);
    if (!context) {
        throw new Error('useNoColorMode must be used within a NoColorModeProvider');
    }
    return context;
};
