// import React, { useState, useEffect, createContext } from "react";
// import { getUserAccount } from "../services/userServices";

// export const UserContext = createContext(null);

// export const UserProvider = ({ children }) => {
//   const [user, setUser] = useState({
//     isLoading: true,
//     isAuthenticated: false,
//     token: "",
//     account: {},
//   });

//   const loginContext = (userData) => {
//     const { token, ...rest } = userData; // Lấy token và các dữ liệu khác
//     setUser({ ...rest, isAuthenticated: true, token, isLoading: false });
//     localStorage.setItem("user", JSON.stringify({ ...rest, isAuthenticated: true, token }));
//     localStorage.setItem("jwt", token); // Lưu JWT vào localStorage
//   };

//   const logoutContext = () => {
//     localStorage.removeItem("user");
//     localStorage.removeItem("jwt");
//     setUser({ isLoading: false, isAuthenticated: false, token: "", account: {} });
//   };

//   const fetchUser = async () => {
//     try {
//       const response = await getUserAccount();
//       if (response && response.EC === 0) {
//         const { groupWithRoles, email, username, access_token: token } = response.DT;
//         const userData = {
//           isAuthenticated: true,
//           token, // Đảm bảo rằng token không phải là undefined
//           account: { groupWithRoles, email, username },
//           isLoading: false,
//         };
//         setUser(userData);
//         localStorage.setItem("user", JSON.stringify(userData));
//         localStorage.setItem("jwt", token); // Lưu JWT vào localStorage
//       } else {
//         setUser({ isLoading: false, isAuthenticated: false, token: "", account: {} });
//       }
//     } catch (error) {
//       console.error("Failed to fetch user:", error);
//       setUser({ isLoading: false, isAuthenticated: false, token: "", account: {} });
//     }
//   };

//   useEffect(() => {
//     const storedUser = localStorage.getItem('user');
//     if (storedUser) {
//       setUser(JSON.parse(storedUser));
//     } else if (
//       window.location.pathname !== '/' &&
//       window.location.pathname !== '/login' &&
//       window.location.pathname !== '/about' &&
//       window.location.pathname !== '/forgot-password' &&
//       window.location.pathname !== '/reset-password' &&
//       !window.location.pathname.startsWith('/card/')
//     ) {
//       fetchUser();
//     } else {
//       setUser(prevState => ({ ...prevState, isLoading: false }));
//     }
//   }, []);

//   useEffect(() => {
//     if (user.isAuthenticated) {
//       localStorage.setItem('user', JSON.stringify(user)); // Lưu thông tin người dùng vào localStorage
//     }
//   }, [user]);

//   return (
//     <UserContext.Provider value={{ user, loginContext, logoutContext }}>
//       {children}
//     </UserContext.Provider>
//   );
// };

//-------------------------------------------------------------------------------------------------------------------------
// import React, { useState, useEffect, createContext, useCallback } from "react";
// import { getUserAccount } from "../services/userServices";
// //import { io } from "socket.io-client";

// export const UserContext = createContext(null);

// export const UserProvider = ({ children }) => {
//   const [user, setUser] = useState({
//     isLoading: true,
//     isAuthenticated: false,
//     token: "",
//     account: {},
//   });

//   const [socket, setSocket] = useState(null);

//   // ---------- Fetch user (memoized) ----------
//   const fetchUser = useCallback(async () => {
//     try {
//       const response = await getUserAccount(); // implement của bạn gọi API /me hoặc tương tự
//       if (response && response.EC === 0) {
//         const u = response.DT;
//         const userData = {
//           isAuthenticated: true,
//           token: user.token || u.access_token || "",
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
//             groupWithRoles: u.groupWithRoles,
//           },
//           isLoading: false,
//         };

//         setUser(userData);
//         localStorage.setItem("user", JSON.stringify(userData));
//         if (userData.token) localStorage.setItem("jwt", userData.token);
//         return userData;
//       } else {
//         setUser({
//           isLoading: false,
//           isAuthenticated: false,
//           token: "",
//           account: {},
//         });
//         return null;
//       }
//     } catch (err) {
//       console.error("Failed to fetch user:", err);
//       setUser({
//         isLoading: false,
//         isAuthenticated: false,
//         token: "",
//         account: {},
//       });
//       return null;
//     }
//   }, [user.token]);

//   // ---------- Login / Logout ----------
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
//         socket.off(); // remove listeners
//         socket.disconnect();
//       } catch (e) {
//         // ignore
//       }
//       setSocket(null);
//     }
//   };

//   // ---------- Load user from localStorage on start ----------
//   useEffect(() => {
//     const storedUser = localStorage.getItem("user");
//     if (storedUser) {
//       try {
//         setUser(JSON.parse(storedUser));
//       } catch (e) {
//         localStorage.removeItem("user");
//         setUser((prev) => ({ ...prev, isLoading: false }));
//       }
//     } else if (
//       window.location.pathname !== "/" &&
//       window.location.pathname !== "/login" &&
//       window.location.pathname !== "/about" &&
//       window.location.pathname !== "/forgot-password" &&
//       window.location.pathname !== "/reset-password" &&
//       !window.location.pathname.startsWith("/card/")
//     ) {
//       // fetch only when navigating protected routes
//       fetchUser();
//     } else {
//       setUser((prev) => ({ ...prev, isLoading: false }));
//     }
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, []); // only run once

//   // ---------- Polling fallback (every 30s) ----------
//   const { isAuthenticated } = user;
//   useEffect(() => {
//     if (!isAuthenticated) return;
//     const interval = setInterval(async () => {
//       try {
//         await fetchUser();
//       } catch (err) {
//         console.error("Polling fetch error:", err);
//       }
//     }, 30000); // 30s, thay đổi nếu cần

//     return () => clearInterval(interval);
//   }, [isAuthenticated, fetchUser]);

//   // ---------- Socket.IO listener (strapi-plugin-io style) ----------
//   // Destructure to avoid eslint missing deps
//   // const token = user.token;
//   // const userId = user.account?.id;

//   // useEffect(() => {
//   //   if (!isAuthenticated || !token) return;

//   //   const SERVER_URL = "http://113.161.81.49:1338"; // đổi theo env nếu cần
//   //   const sock = io(SERVER_URL, {
//   //     auth: {
//   //       strategy: "jwt", // bắt buộc theo strapi-plugin-io
//   //       token,
//   //     },
//   //     transports: ["websocket"], // cố gắng dùng websocket để tránh polling/cors
//   //     autoConnect: true,
//   //   });

//   //   sock.on("connect", () => {
//   //     console.log("Socket connected (strapi-plugin-io)", sock.id);
//   //   });

//   //   // Lắng nghe event emit mặc định của plugin IO cho user content-type
//   //   sock.on("plugin::users-permissions.user:update", (data) => {
//   //     console.log("socket event plugin::users-permissions.user:update", data);
//   //     if (data && data.id && data.id === userId) {
//   //       // update bằng fetch để chắc chắn populated fields, hoặc bạn có thể merge payload
//   //       fetchUser().catch((e) =>
//   //         console.error("fetchUser after socket event error:", e)
//   //       );
//   //     }
//   //   });

//   //   // optional: also listen generic updates (if your backend emits custom events)
//   //   sock.on(`userUpdated:${userId}`, (data) => {
//   //     console.log("socket event userUpdated:<id>", data);
//   //     if (data && data.id === userId) {
//   //       fetchUser().catch((e) =>
//   //         console.error("fetchUser after userUpdated event error:", e)
//   //       );
//   //     }
//   //   });

//   //   // save socket
//   //   setSocket(sock);

//   //   // cleanup
//   //   return () => {
//   //     try {
//   //       sock.off("plugin::users-permissions.user:update");
//   //       sock.off(`userUpdated:${userId}`);
//   //       sock.disconnect();
//   //     } catch (e) {
//   //       // ignore
//   //     }
//   //     setSocket(null);
//   //   };
//   //   // eslint-disable-next-line react-hooks/exhaustive-deps
//   // }, [isAuthenticated, token, userId, fetchUser]); // fetchUser included

//   // ---------- Persist user changes (kept minimal) ----------
//   useEffect(() => {
//     if (user.isAuthenticated) {
//       localStorage.setItem("user", JSON.stringify(user));
//       if (user.token) localStorage.setItem("jwt", user.token);
//     }
//   }, [user]);

//   return (
//     <UserContext.Provider
//       value={{ user, loginContext, logoutContext, fetchUser }}
//     >
//       {children}
//     </UserContext.Provider>
//   );
// };
//-------------------------------------------------------------------------------------------------------------------------
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

//   // ---------- Fetch user (memoized) ----------

//   const fetchUser = useCallback(async () => {
//     try {
//       const response = await getUserAccount();

//       if (response && response.EC === 0) {
//         const u = response.DT;
//         const userData = {
//           isAuthenticated: true,
//           token: user.token || u.access_token || "", // giữ token cũ nếu API không trả mới
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
//             groupWithRoles: u.groupWithRoles,
//           },
//           isLoading: false,
//         };

//         setUser(userData);
//         localStorage.setItem("user", JSON.stringify(userData));
//         if (userData.token) localStorage.setItem("jwt", userData.token);
//         return userData;
//       } else {
//         // EC !== 0 → kiểm tra xem có phải lỗi 401 không
//         if (response?.status === 401) {
//           // Chỉ logout khi chắc chắn token hết hạn hoặc không hợp lệ
//           logoutContext();
//         } else {
//           // Các lỗi khác (500, network error, timeout...): KHÔNG logout
//           console.warn("Fetch user failed but not auth error, keeping current user:", response);
//           setUser(prev => ({ ...prev, isLoading: false })); // chỉ tắt loading
//         }
//         return null;
//       }
//     } catch (err) {
//       // Trường hợp exception ngoài getUserAccount (rất hiếm)
//       console.error("Unexpected error fetching user:", err);
//       setUser(prev => ({ ...prev, isLoading: false }));
//       return null;
//     }
//   }, []); // ⚠️ Đổi dependency thành [] để ổn định

//   // ---------- Login / Logout ----------
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
//         socket.off(); // remove listeners
//         socket.disconnect();
//       } catch (e) {
//         // ignore
//       }
//       setSocket(null);
//     }
//   };

//   // ---------- Load user from localStorage on start ----------
//   useEffect(() => {
//     const storedUser = localStorage.getItem("user");
//     if (storedUser) {
//       try {
//         setUser(JSON.parse(storedUser));
//       } catch (e) {
//         localStorage.removeItem("user");
//         setUser((prev) => ({ ...prev, isLoading: false }));
//       }
//     } else if (
//       window.location.pathname !== "/" &&
//       window.location.pathname !== "/login" &&
//       window.location.pathname !== "/about" &&
//       window.location.pathname !== "/forgot-password" &&
//       window.location.pathname !== "/reset-password" &&
//       !window.location.pathname.startsWith("/card/")
//     ) {
//       // fetch only when navigating protected routes
//       fetchUser();
//     } else {
//       setUser((prev) => ({ ...prev, isLoading: false }));
//     }
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, []); // only run once

//   // ---------- Polling fallback (every 30s) ----------
//   const { isAuthenticated } = user;
//   useEffect(() => {
//     if (!isAuthenticated) return;
//     const interval = setInterval(async () => {
//       try {
//         await fetchUser();
//       } catch (err) {
//         console.error("Polling fetch error:", err);
//       }
//     }, 300000); // 30s, thay đổi nếu cần

//     return () => clearInterval(interval);
//   }, [isAuthenticated, fetchUser]);


//   // ---------- Persist user changes (kept minimal) ----------
//   useEffect(() => {
//     if (user.isAuthenticated) {
//       localStorage.setItem("user", JSON.stringify(user));
//       if (user.token) localStorage.setItem("jwt", user.token);
//     }
//   }, [user]);

//   return (
//     <UserContext.Provider
//       value={{ user, loginContext, logoutContext, fetchUser }}
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

  const [socket, setSocket] = useState(null);

  // Memoized fetchUser - dependency rỗng để ổn định
  const fetchUser = useCallback(async () => {
    try {
      const response = await getUserAccount();

      if (response && response.EC === 0) {
        const u = response.DT;
        const userData = {
          isAuthenticated: true,
          token: user.token || u.access_token || "", // giữ token cũ nếu không có mới
          account: {
            id: u.id,
            username: u.username,
            email: u.email,
            provider: u.provider,
            confirmed: u.confirmed,
            blocked: u.blocked,
            createdAt: u.createdAt,
            updatedAt: u.updatedAt,
            Name: u.Name,
            Position: u.Position,
            Department: u.Department,
            qr_code_url: u.qr_code_url,
            DHGPosition: u.DHGPosition,
            startingdate: u.startingdate,
            Phone: u.Phone,
            IDuser: u.IDuser,
            Status: u.Status,
            EmailDHG: u.EmailDHG,
            Exportlist: u.Exportlist,
            Purchase: u.Purchase,
            Invoice: u.Invoice,
            ReadPOS: u.ReadPOS,
            Exportlister: u.Exportlister,
            Purchaseer: u.Purchaseer,
            Invoiceer: u.Invoiceer,
            Admin: u.Admin,
            Leader: u.Leader,
            Warehouse: u.Warehouse,
            WritePOS: u.WritePOS,
            Devicelist: u.Devicelist,
            Receivelist: u.Receivelist,
            ReadWarehouse: u.ReadWarehouse,
            groupWithRoles: u.groupWithRoles,
          },
          isLoading: false,
        };

        setUser(userData);
        localStorage.setItem("user", JSON.stringify(userData));
        if (userData.token) localStorage.setItem("jwt", userData.token);

        return userData;
      } else {
        // Chỉ logout khi chắc chắn là 401
        if (response?.status === 401) {
          logoutContext();
        } else {
          // Lỗi khác (mạng, server) → giữ trạng thái hiện tại
          console.warn("Fetch user failed (non-auth error), keeping current session:", response);
          setUser((prev) => ({ ...prev, isLoading: false }));
        }
        return null;
      }
    } catch (err) {
      console.error("Unexpected error in fetchUser:", err);
      setUser((prev) => ({ ...prev, isLoading: false }));
      return null;
    }
  }, []); // ← Dependency rỗng, không còn [user.token]

  // Login / Logout
  const loginContext = (userData) => {
    const { token, ...rest } = userData;
    const newUser = { ...rest, isAuthenticated: true, token, isLoading: false };
    setUser(newUser);
    localStorage.setItem("user", JSON.stringify(newUser));
    if (token) localStorage.setItem("jwt", token);
  };

  const logoutContext = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("jwt");
    setUser({
      isLoading: false,
      isAuthenticated: false,
      token: "",
      account: {},
    });

    if (socket) {
      try {
        socket.off();
        socket.disconnect();
      } catch (e) {
        // ignore
      }
      setSocket(null);
    }
  };

  // Load từ localStorage khi mount
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const publicPaths = [
      "/",
      "/login",
      "/about",
      "/forgot-password",
      "/reset-password",
      "/register",
      "/verify-otp",
      "/projectcustomer",
    ];

    if (storedUser) {
      try {
        const parsed = JSON.parse(storedUser);
        setUser(parsed);
      } catch (e) {
        localStorage.removeItem("user");
        setUser((prev) => ({ ...prev, isLoading: false }));
      }
    } else if (
      !publicPaths.some((path) => window.location.pathname.startsWith(path))
    ) {
      // Chỉ fetch khi vào route protected và không có localStorage
      fetchUser();
    } else {
      setUser((prev) => ({ ...prev, isLoading: false }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // BỎ POLLING 30s (không cần nữa, interceptor đã xử lý 401 toàn app)
  // Nếu vẫn muốn giữ để refresh data user, có thể để nhưng tăng thời gian lên 10 phút

  // Persist user khi thay đổi (chỉ khi authenticated)
  useEffect(() => {
    if (user.isAuthenticated && !user.isLoading) {
      localStorage.setItem("user", JSON.stringify(user));
      if (user.token) localStorage.setItem("jwt", user.token);
    }
  }, [user]);

  return (
    <UserContext.Provider
      value={{ user, loginContext, logoutContext, fetchUser, setUser }}
    >
      {children}
    </UserContext.Provider>
  );
};