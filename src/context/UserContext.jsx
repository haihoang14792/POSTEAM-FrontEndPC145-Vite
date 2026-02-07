// import React, { useState, useEffect, createContext, useCallback } from "react";
// import { getUserAccount } from "../services/userServices";

// export const UserContext = createContext(null);

// export const UserProvider = ({ children }) => {
//   const [user, setUser] = useState({
//     isLoading: true,
//     isAuthenticated: false,
//     token: "",
//     account: {},
//   });

//   const [socket, setSocket] = useState(null);

//   // Memoized fetchUser - dependency rỗng để ổn định
//   const fetchUser = useCallback(async () => {
//     try {
//       const response = await getUserAccount();

//       if (response && response.EC === 0) {
//         const u = response.DT;
//         const userData = {
//           isAuthenticated: true,
//           token: u.access_token || user.token || "", // giữ token cũ nếu không có mới
//           account: {
//             id: u.id,
//             username: u.username,
//             email: u.email,
//             provider: u.provider,
//             confirmed: u.confirmed,
//             blocked: u.blocked,
//             createdAt: u.createdAt,
//             updatedAt: u.updatedAt,
//             Name: u.Name,
//             Position: u.Position,
//             Department: u.Department,
//             qr_code_url: u.qr_code_url,
//             DHGPosition: u.DHGPosition,
//             startingdate: u.startingdate,
//             Phone: u.Phone,
//             IDuser: u.IDuser,
//             Status: u.Status,
//             EmailDHG: u.EmailDHG,
//             Exportlist: u.Exportlist,
//             Purchase: u.Purchase,
//             Invoice: u.Invoice,
//             ReadPOS: u.ReadPOS,
//             Exportlister: u.Exportlister,
//             Purchaseer: u.Purchaseer,
//             Invoiceer: u.Invoiceer,
//             Admin: u.Admin,
//             Leader: u.Leader,
//             Warehouse: u.Warehouse,
//             WritePOS: u.WritePOS,
//             Devicelist: u.Devicelist,
//             Receivelist: u.Receivelist,
//             ReadWarehouse: u.ReadWarehouse,
//             groupWithRoles: u.groupWithRoles,
//           },
//           isLoading: false,
//         };

//         setUser(userData);
//         localStorage.setItem("user", JSON.stringify(userData));
//         if (userData.token) localStorage.setItem("jwt", userData.token);

//         return userData;
//       } else {
//         // Chỉ logout khi chắc chắn là 401
//         if (response?.status === 401) {
//           logoutContext();
//         } else {
//           // Lỗi khác (mạng, server) → giữ trạng thái hiện tại
//           console.warn("Fetch user failed (non-auth error), keeping current session:", response);
//           setUser((prev) => ({ ...prev, isLoading: false }));
//         }
//         return null;
//       }
//     } catch (err) {
//       console.error("Unexpected error in fetchUser:", err);
//       setUser((prev) => ({ ...prev, isLoading: false }));
//       return null;
//     }
//   }, []); // ← Dependency rỗng, không còn [user.token]

//   // Login / Logout
//   const loginContext = (userData) => {
//     const { token, ...rest } = userData;
//     const newUser = { ...rest, isAuthenticated: true, token, isLoading: false };
//     setUser(newUser);
//     localStorage.setItem("user", JSON.stringify(newUser));
//     if (token) localStorage.setItem("jwt", token);
//   };

//   const logoutContext = () => {
//     localStorage.removeItem("user");
//     localStorage.removeItem("jwt");
//     setUser({
//       isLoading: false,
//       isAuthenticated: false,
//       token: "",
//       account: {},
//     });

//     if (socket) {
//       try {
//         socket.off();
//         socket.disconnect();
//       } catch (e) {
//         // ignore
//       }
//       setSocket(null);
//     }
//   };

//   // Load từ localStorage khi mount
//   useEffect(() => {
//     const storedUser = localStorage.getItem("user");
//     const publicPaths = [
//       "/",
//       "/login",
//       "/about",
//       "/forgot-password",
//       "/reset-password",
//       "/register",
//       "/verify-otp",
//       "/projectcustomer",
//     ];

//     if (storedUser) {
//       try {
//         const parsed = JSON.parse(storedUser);
//         setUser(parsed);
//       } catch (e) {
//         localStorage.removeItem("user");
//         setUser((prev) => ({ ...prev, isLoading: false }));
//       }
//     } else if (
//       !publicPaths.some((path) => window.location.pathname.startsWith(path))
//     ) {
//       // Chỉ fetch khi vào route protected và không có localStorage
//       fetchUser();
//     } else {
//       setUser((prev) => ({ ...prev, isLoading: false }));
//     }
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, []);

//   // BỎ POLLING 30s (không cần nữa, interceptor đã xử lý 401 toàn app)
//   // Nếu vẫn muốn giữ để refresh data user, có thể để nhưng tăng thời gian lên 10 phút

//   // Persist user khi thay đổi (chỉ khi authenticated)
//   useEffect(() => {
//     if (user.isAuthenticated && !user.isLoading) {
//       localStorage.setItem("user", JSON.stringify(user));
//       if (user.token) localStorage.setItem("jwt", user.token);
//     }
//   }, [user]);

//   return (
//     <UserContext.Provider
//       value={{ user, loginContext, logoutContext, fetchUser, setUser }}
//     >
//       {children}
//     </UserContext.Provider>
//   );
// };


import React, { useState, useEffect, createContext, useCallback } from "react";
import { getUserAccount } from "../services/userServices";

export const UserContext = createContext(null);

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState({
    isLoading: true,
    isAuthenticated: false,
    token: "",
    account: {},
  });

  const logoutContext = useCallback(() => {
    localStorage.removeItem("user");
    localStorage.removeItem("jwt");
    setUser({ isLoading: false, isAuthenticated: false, token: "", account: {} });
  }, []);

  const fetchUser = useCallback(async () => {
    try {
      const response = await getUserAccount();
      if (response && response.EC === 0) {
        const u = response.DT;
        const userData = {
          isAuthenticated: true,
          token: u.access_token || localStorage.getItem("jwt") || "", // Ưu tiên token mới
          account: { ...u }, // Spread để lấy toàn bộ field từ server
          isLoading: false,
        };

        setUser(userData);
        localStorage.setItem("user", JSON.stringify(userData));
        if (userData.token) localStorage.setItem("jwt", userData.token);
        return userData;
      } else {
        if (response?.status === 401) logoutContext();
        setUser((prev) => ({ ...prev, isLoading: false }));
        return null;
      }
    } catch (err) {
      setUser((prev) => ({ ...prev, isLoading: false }));
      return null;
    }
  }, [logoutContext]);

  const loginContext = (userData) => {
    const { token, ...rest } = userData;
    const newUser = { ...rest, isAuthenticated: true, token, isLoading: false };
    setUser(newUser);
    localStorage.setItem("user", JSON.stringify(newUser));
    if (token) localStorage.setItem("jwt", token);
  };

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const isPublicPath = ["/", "/login", "/register", "/about"].some(path => window.location.pathname.startsWith(path));

    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        logoutContext();
      }
    } else if (!isPublicPath) {
      fetchUser();
    } else {
      setUser((prev) => ({ ...prev, isLoading: false }));
    }
  }, [fetchUser, logoutContext]);

  return (
    <UserContext.Provider value={{ user, loginContext, logoutContext, fetchUser, setUser }}>
      {children}
    </UserContext.Provider>
  );
};