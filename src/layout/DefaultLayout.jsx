import React from 'react';
import { AppContent, AppSidebar, AppFooter, AppHeader } from '../components/index';
import { useColorMode } from '../context/ColorModeContext'; // Import useColorMode

const DefaultLayout = () => {
  const { colorMode } = useColorMode(); // Sử dụng colorMode nếu cần

  return (
    <div className={`layout ${colorMode}`}>
      <AppSidebar />
      <div className="wrapper d-flex flex-column min-vh-100">
        <AppHeader />
        <div className="body flex-grow-1">
          <AppContent />
        </div>
        <AppFooter />
      </div>
    </div>
  );
};

export default DefaultLayout;

