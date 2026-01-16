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
