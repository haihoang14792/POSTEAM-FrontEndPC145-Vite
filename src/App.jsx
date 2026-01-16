import React, { useContext, useEffect, Suspense } from "react";
import { Route, Routes, useLocation, Navigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { Scrollbars } from "react-custom-scrollbars-2";
import { useSelector } from "react-redux";
import { CSpinner } from "@coreui/react";
import "react-toastify/dist/ReactToastify.css";
import "./scss/style.scss";
import "./App.css";

import UserLayout from "./layout/UserLayout";
import { UserContext } from "./context/UserContext";
import { Rings } from "react-loader-spinner";
import { useColorMode } from "./context/ColorModeContext";
import { initGA, logPageView } from "./analytics";

const DefaultLayout = React.lazy(() => import("./layout/DefaultLayout"));
const Page404 = React.lazy(() => import("./views/pages/page404/Page404"));
const Page500 = React.lazy(() => import("./views/pages/page500/Page500"));

const isIOS = /iPhone/.test(navigator.userAgent) && !window.MSStream;

const App = () => {
  const { user } = useContext(UserContext);
  const { colorMode, setColorMode } = useColorMode();
  const storedTheme = useSelector((state) => state.theme);

  const location = useLocation();

  // 👉 Lấy thông tin userAccount
  const userAccount = user?.account || {};
  const hasPOSPermission = userAccount.ReadPOS === true;

  useEffect(() => {
    initGA();
  }, []);

  useEffect(() => {
    logPageView(location.pathname);
  }, [location]);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.href.split("?")[1]);
    const theme =
      urlParams.get("theme") &&
      urlParams.get("theme").match(/^[A-Za-z0-9\s]+/)[0];
    if (theme) {
      setColorMode(theme);
    } else {
      setColorMode(storedTheme);
    }
  }, [setColorMode, storedTheme]);

  const AppRoutes = (
    <Suspense
      fallback={
        <div className="pt-3 text-center">
          <CSpinner color="primary" variant="grow" />
        </div>
      }
    >
      <Routes>
        {/* Chặn route /dhg/* nếu không có quyền */}
        <Route
          path="/dhg/*"
          element={
            hasPOSPermission ? <DefaultLayout /> : <Navigate to="/" replace />
          }
        />

        {/* Route chung */}
        <Route path="/*" element={<UserLayout />} />
        <Route path="/500" element={<Page500 />} />
        <Route path="*" element={<Page404 />} />
      </Routes>
    </Suspense>
  );

  return (
    <>
      {isIOS ? (
        <div style={{ height: "100vh", overflowY: "auto" }}>
          {user && user.isLoading ? (
            <div className="loading-container">
              <Rings
                visible={true}
                height="80"
                width="80"
                color="#4fa94d"
                ariaLabel="rings-loading"
              />
              <div>Loading data....</div>
            </div>
          ) : (
            AppRoutes
          )}

          <ToastContainer position="bottom-center" autoClose={3000} />
        </div>
      ) : (
        <Scrollbars autoHide style={{ height: "100vh" }}>
          {user && user.isLoading ? (
            <div className="loading-container">
              <Rings
                visible={true}
                height="80"
                width="80"
                color="#4fa94d"
                ariaLabel="rings-loading"
              />
              <div>Loading data....</div>
            </div>
          ) : (
            AppRoutes
          )}

          <ToastContainer position="bottom-center" autoClose={3000} />
        </Scrollbars>
      )}
    </>
  );
};

export default App;
