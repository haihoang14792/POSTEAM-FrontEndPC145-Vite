import React from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import store from './store';
import { BrowserRouter as Router } from 'react-router-dom'; // Không cần Routes ở đây
import App from './App';
import { UserProvider } from './context/UserContext';
import { ColorModeProvider } from './context/ColorModeContext'; // Import ColorModeProvider
import { NoColorModeProvider } from './context/NoColorModeContext'; // Import NoColorModeProvider
import './index.scss';

// --- BẮT ĐẦU CẤU HÌNH DAYJS ---
import dayjs from 'dayjs';
import 'dayjs/locale/vi'; // Import tiếng Việt
import customParseFormat from 'dayjs/plugin/customParseFormat';
import relativeTime from 'dayjs/plugin/relativeTime';
import weekday from 'dayjs/plugin/weekday';
import localeData from 'dayjs/plugin/localeData';

// Kích hoạt các plugins cần thiết
dayjs.extend(customParseFormat);
dayjs.extend(relativeTime);
dayjs.extend(weekday);
dayjs.extend(localeData);

// Set ngôn ngữ mặc định là Tiếng Việt
dayjs.locale('vi');
// --- KẾT THÚC CẤU HÌNH DAYJS ---

const root = createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    <Provider store={store}>
      <UserProvider>
        <ColorModeProvider>
          <NoColorModeProvider>
            <Router>
              <App />
            </Router>
          </NoColorModeProvider>
        </ColorModeProvider>
      </UserProvider>
    </Provider>
  </React.StrictMode>
);
