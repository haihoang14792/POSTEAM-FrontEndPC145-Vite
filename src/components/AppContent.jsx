import React, { Suspense } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { CContainer, CSpinner } from '@coreui/react';
import DHGRoutes from '../routes/DHGRoutes';
import PrivateRoute from '../routes/PrivateRoutes';

const AppContent = () => {
  return (
    //<CContainer className="px-4" lg>
    <CContainer fluid className="px-5">
      <Suspense fallback={<CSpinner color="primary" />}>
        <Routes>
          {DHGRoutes.map((route, idx) => (
            <Route
              key={idx}
              path={route.path}
              exact={route.exact}
              element={<PrivateRoute element={route.element} />}
            />
          ))}
          <Route path="/dhg" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </Suspense>
    </CContainer>
  );
};

export default React.memo(AppContent);


