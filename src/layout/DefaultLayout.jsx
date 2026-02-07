// import React from 'react';
// import { AppContent, AppFooter, AppHeader} from '../components';
// import { useColorMode } from '../context/ColorModeContext'; // Import useColorMode

// const DefaultLayout = () => {
//   const { colorMode } = useColorMode(); // Sử dụng colorMode nếu cần

//   return (
//     <div className={`layout ${colorMode}`}>
//       <div className="wrapper d-flex flex-column min-vh-100">
//         <AppHeader />
//         <div className="body flex-grow-1">
//           <AppContent />
//         </div>
//         <AppFooter />
//       </div>
//     </div>
//   );
// };

// export default DefaultLayout;

import React from 'react';
import { AppContent, AppFooter, AppHeader, WelcomePopup } from '../components';
import { useColorMode } from '../context/ColorModeContext';
import banner from '../assets/images/popup/1.jpg'; // Đảm bảo đường dẫn này là đúng

const DefaultLayout = () => {
  const { colorMode } = useColorMode();

  return (
    <div className={`layout ${colorMode}`}>
      {/* SỬA LỖI Ở ĐÂY: Thêm cặp ngoặc nhọn quanh biến banner */}
      <WelcomePopup
        imageUrl={banner}
        storageKey="popup_banner_2024"
      />

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