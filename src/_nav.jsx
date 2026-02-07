// import React from "react";
// import CIcon from "@coreui/icons-react";
// import {
//   cilSpeedometer,
//   cilFolder,
//   cilUser,
//   cilDevices,
//   cilBuilding,
//   cilBasket,
//   cilSpreadsheet,
//   cilCalendar,
//   cilStar,
//   cilPlus,
//   cilList,
//   cilFile,
//   cilLibraryBuilding, // ← thêm dòng này
// } from "@coreui/icons";
// import { CNavGroup, CNavItem } from "@coreui/react";

// const storedUser = localStorage.getItem("user");
// const parsedUser = storedUser ? JSON.parse(storedUser) : null;
// const userPurchase = parsedUser?.account?.Purchase;
// const userExportlist = parsedUser?.account?.Exportlist;
// const userAdmin = parsedUser?.account?.Admin;
// const userLeader = parsedUser?.account?.Leader;
// const userReadWarehouse = parsedUser?.account?.ReadWarehouse;
// const lang = localStorage.getItem('app_lang') || 'vi';

// const _nav = [

//   {
//     component: CNavItem,
//     name: lang === 'vi' ? 'Trang chủ' : 'Dashboard',
//     to: '/dhg/dashboard',
//     icon: <CIcon icon={cilSpeedometer} customClassName="nav-icon" />,
//   },
//   {
//     component: CNavGroup,
//     name: "Công việc",
//     icon: (
//       <CIcon
//         icon={cilFolder}
//         customClassName="nav-icon"
//         style={{ color: "#FF8C00" }}
//       />
//     ),
//     items: [
//       {
//         component: CNavItem,
//         name: "Dự án và kế hoạch",
//         to: "/dhg/cv/projectplant",
//         icon: (
//           <CIcon
//             icon={cilList}
//             customClassName="nav-icon"
//             style={{ color: "#FF8C00" }}
//           />
//         ),
//       },
//     ],
//   },
//   {
//     component: CNavGroup,
//     name: "Khách hàng",
//     icon: (
//       <CIcon
//         icon={cilUser}
//         customClassName="nav-icon"
//         style={{ color: "#32CD32" }}
//       />
//     ),
//     items: [
//       {
//         component: CNavItem,
//         name: "Danh sách khách hàng",
//         to: "/dhg/khlist",
//         icon: (
//           <CIcon
//             icon={cilList}
//             customClassName="nav-icon"
//             style={{ color: "#32CD32" }}
//           />
//         ),
//       },
//     ],
//   },
//   {
//     component: CNavGroup,
//     name: "Thiết bị",
//     icon: (
//       <CIcon
//         icon={cilDevices}
//         customClassName="nav-icon"
//         style={{ color: "#FF1493" }}
//       />
//     ),
//     items: [
//       {
//         component: CNavItem,
//         name: "Thiết bị khách hàng",
//         to: "/dhg/customerdevice",
//         icon: (
//           <CIcon
//             icon={cilDevices}
//             customClassName="nav-icon"
//             style={{ color: "#FF1493" }}
//           />
//         ),
//       },
//       {
//         component: CNavItem,
//         name: "Phiếu thiết bị",
//         to: "/dhg/thietbikhaibao",
//         icon: (
//           <CIcon
//             icon={cilFile}
//             customClassName="nav-icon"
//             style={{ color: "#FF1493" }}
//           />
//         ),
//       },
//     ],
//   },
//   {
//     component: CNavGroup,
//     name: "Kho",
//     icon: (
//       <CIcon
//         icon={cilBuilding}
//         customClassName="nav-icon"
//         style={{ color: "#8A2BE2" }}
//       />
//     ),
//     items: [
//       {
//         component: CNavItem,
//         name: "Danh sách kho",
//         to: "/dhg/kho/list",
//         icon: (
//           <CIcon
//             icon={cilList}
//             customClassName="nav-icon"
//             style={{ color: "#8A2BE2" }}
//           />
//         ),
//       },
//       {
//         component: CNavItem,
//         name: "Phiếu Xuất Kho POS",
//         to: "/dhg/kho/pxkhokt",
//         icon: (
//           <CIcon
//             icon={cilFile}
//             customClassName="nav-icon"
//             style={{ color: "#8A2BE2" }}
//           />
//         ),
//       },
//       ...(userExportlist === true
//         ? [
//           {
//             component: CNavItem,
//             name: "Phiếu Nhập Kho DHG",
//             to: "/dhg/kho/pnkho",
//             icon: (
//               <CIcon
//                 icon={cilFile}
//                 customClassName="nav-icon"
//                 style={{ color: "#8A2BE2" }}
//               />
//             ),
//           },
//         ]
//         : []),
//       ...(userReadWarehouse === true
//         ? [
//           {
//             component: CNavItem,
//             name: "Bảng Kê Kho",
//             to: "/dhg/kho/inventory",
//             icon: (
//               <CIcon
//                 icon={cilSpreadsheet}
//                 customClassName="nav-icon"
//                 style={{ color: "#FF4500" }}
//               />
//             ),
//           },
//         ]
//         : []),
//       {
//         component: CNavItem,
//         name: "Phiếu Xuất Kho DHG",
//         to: "/dhg/kho/pxkho",
//         icon: (
//           <CIcon
//             icon={cilFile}
//             customClassName="nav-icon"
//             style={{ color: "#8A2BE2" }}
//           />
//         ),
//       },
//     ],
//   },
//   {
//     component: CNavGroup,
//     name: "Sản phẩm",
//     icon: (
//       <CIcon
//         icon={cilBasket}
//         customClassName="nav-icon"
//         style={{ color: "#20B2AA" }}
//       />
//     ),
//     items: [
//       ...(userPurchase === true
//         ? [
//           {
//             component: CNavItem,
//             name: "Nhà cung cấp",
//             to: "/dhg/sanpham/ncc",
//             icon: (
//               <CIcon
//                 icon={cilBuilding}
//                 customClassName="nav-icon"
//                 style={{ color: "#20B2AA" }}
//               />
//             ),
//           },
//           {
//             component: CNavItem,
//             name: "Danh mục sản phẩm",
//             to: "/dhg/sanpham/sp",
//             icon: (
//               <CIcon
//                 icon={cilLibraryBuilding}
//                 customClassName="nav-icon"
//                 style={{ color: "#20B2AA" }}
//               />
//             ),
//           },
//           {
//             component: CNavItem,
//             name: "Nhập Hàng sản phẩm",
//             to: "/dhg/sanpham/nhaphang",
//             icon: (
//               <CIcon
//                 icon={cilPlus}
//                 customClassName="nav-icon"
//                 style={{ color: "#20B2AA" }}
//               />
//             ),
//           },
//         ]
//         : []),
//       {
//         component: CNavItem,
//         name: "Chi tiết sản phẩm",
//         to: "/dhg/sanpham/spdetail",
//         icon: (
//           <CIcon
//             icon={cilFile}
//             customClassName="nav-icon"
//             style={{ color: "#20B2AA" }}
//           />
//         ),
//       },
//     ],
//   },

//   ...(userLeader === true
//     ? [
//       {
//         component: CNavGroup,
//         name: "Nhân sự",
//         icon: (
//           <CIcon
//             icon={cilUser}
//             customClassName="nav-icon"
//             style={{ color: "#FF69B4" }}
//           />
//         ),
//         items: [
//           ...(userAdmin === true
//             ? [
//               {
//                 component: CNavItem,
//                 name: "Phân quyền",
//                 to: "/dhg/user/pq",
//                 icon: (
//                   <CIcon
//                     icon={cilFile}
//                     customClassName="nav-icon"
//                     style={{ color: "#FF69B4" }}
//                   />
//                 ),
//               },
//             ]
//             : []),
//           ...(userLeader === true
//             ? [
//               {
//                 component: CNavItem,
//                 name: "Danh sách nhân sự",
//                 to: "/dhg/user/ns",
//                 icon: (
//                   <CIcon
//                     icon={cilList}
//                     customClassName="nav-icon"
//                     style={{ color: "#FF69B4" }}
//                   />
//                 ),
//               },
//             ]
//             : []),
//         ],
//       },
//     ]
//     : []),
//   {
//     component: CNavGroup,
//     name: "POS",
//     icon: (
//       <CIcon
//         icon={cilCalendar}
//         customClassName="nav-icon"
//         style={{ color: "#FF6347" }}
//       />
//     ),
//     items: [
//       {
//         component: CNavItem,
//         name: "Thư mục lưu trữ",
//         to: "/dhg/pos/files",
//         icon: (
//           <CIcon
//             icon={cilFolder}
//             customClassName="nav-icon"
//             style={{ color: "#FF8C00" }}
//           />
//         ),
//       },
//       {
//         component: CNavItem,
//         name: "Lịch làm việc",
//         to: "/dhg/cvpos/lichlv",
//         icon: (
//           <CIcon
//             icon={cilCalendar}
//             customClassName="nav-icon"
//             style={{ color: "#FF6347" }}
//           />
//         ),
//       },
//       {
//         component: CNavItem,
//         name: "Lịch xoay vòng",
//         to: "/dhg/cvpos/lichxv",
//         icon: (
//           <CIcon
//             icon={cilCalendar}
//             customClassName="nav-icon"
//             style={{ color: "#FF6347" }}
//           />
//         ),
//       },
//     ],
//   },
// ];

// export default _nav;


import React from "react";
import CIcon from "@coreui/icons-react";
import {
  cilSpeedometer,
  cilFolder,
  cilUser,
  cilDevices,
  cilBuilding,
  cilBasket,
  cilSpreadsheet,
  cilCalendar,
  cilStar,
  cilPlus,
  cilList,
  cilFile,
  cilLibraryBuilding,
} from "@coreui/icons";
import { CNavGroup, CNavItem } from "@coreui/react";

const storedUser = localStorage.getItem("user");
const parsedUser = storedUser ? JSON.parse(storedUser) : null;
const userPurchase = parsedUser?.account?.Purchase;
const userExportlist = parsedUser?.account?.Exportlist;
const userAdmin = parsedUser?.account?.Admin;
const userLeader = parsedUser?.account?.Leader;
const userReadWarehouse = parsedUser?.account?.ReadWarehouse;

// Lấy ngôn ngữ hiện tại
const lang = localStorage.getItem('app_lang') || 'vi';

const _nav = [
  {
    component: CNavItem,
    name: lang === 'vi' ? 'Trang chủ' : 'Dashboard',
    to: '/dhg/dashboard',
    icon: <CIcon icon={cilSpeedometer} customClassName="nav-icon" />,
  },
  {
    component: CNavGroup,
    name: lang === 'vi' ? 'Công việc' : 'Tasks',
    icon: (
      <CIcon
        icon={cilFolder}
        customClassName="nav-icon"
        style={{ color: "#FF8C00" }}
      />
    ),
    items: [
      {
        component: CNavItem,
        name: lang === 'vi' ? 'Dự án và kế hoạch' : 'Projects & Plans',
        to: "/dhg/cv/projectplant",
        icon: (
          <CIcon
            icon={cilList}
            customClassName="nav-icon"
            style={{ color: "#FF8C00" }}
          />
        ),
      },
    ],
  },
  {
    component: CNavGroup,
    name: lang === 'vi' ? 'Khách hàng' : 'Customers',
    icon: (
      <CIcon
        icon={cilUser}
        customClassName="nav-icon"
        style={{ color: "#32CD32" }}
      />
    ),
    items: [
      {
        component: CNavItem,
        name: lang === 'vi' ? 'Danh sách khách hàng' : 'Customer List',
        to: "/dhg/khlist",
        icon: (
          <CIcon
            icon={cilList}
            customClassName="nav-icon"
            style={{ color: "#32CD32" }}
          />
        ),
      },
    ],
  },
  {
    component: CNavGroup,
    name: lang === 'vi' ? 'Thiết bị' : 'Equipment',
    icon: (
      <CIcon
        icon={cilDevices}
        customClassName="nav-icon"
        style={{ color: "#FF1493" }}
      />
    ),
    items: [
      {
        component: CNavItem,
        name: lang === 'vi' ? 'Thiết bị khách hàng' : 'Customer Devices',
        to: "/dhg/customerdevice",
        icon: (
          <CIcon
            icon={cilDevices}
            customClassName="nav-icon"
            style={{ color: "#FF1493" }}
          />
        ),
      },
      {
        component: CNavItem,
        name: lang === 'vi' ? 'Phiếu thiết bị' : 'Device Forms',
        to: "/dhg/thietbikhaibao",
        icon: (
          <CIcon
            icon={cilFile}
            customClassName="nav-icon"
            style={{ color: "#FF1493" }}
          />
        ),
      },
    ],
  },
  {
    component: CNavGroup,
    name: lang === 'vi' ? 'Kho' : 'Warehouse',
    icon: (
      <CIcon
        icon={cilBuilding}
        customClassName="nav-icon"
        style={{ color: "#8A2BE2" }}
      />
    ),
    items: [
      {
        component: CNavItem,
        name: lang === 'vi' ? 'Danh sách kho' : 'Warehouse List',
        to: "/dhg/kho/list",
        icon: (
          <CIcon
            icon={cilList}
            customClassName="nav-icon"
            style={{ color: "#8A2BE2" }}
          />
        ),
      },
      {
        component: CNavItem,
        name: lang === 'vi' ? 'Phiếu Xuất Kho POS' : 'POS Export Slips',
        to: "/dhg/kho/pxkhokt",
        icon: (
          <CIcon
            icon={cilFile}
            customClassName="nav-icon"
            style={{ color: "#8A2BE2" }}
          />
        ),
      },
      ...(userExportlist === true
        ? [
          {
            component: CNavItem,
            name: lang === 'vi' ? 'Phiếu Nhập Kho DHG' : 'DHG Import Slips',
            to: "/dhg/kho/pnkho",
            icon: (
              <CIcon
                icon={cilFile}
                customClassName="nav-icon"
                style={{ color: "#8A2BE2" }}
              />
            ),
          },
        ]
        : []),
      ...(userReadWarehouse === true
        ? [
          {
            component: CNavItem,
            name: lang === 'vi' ? 'Bảng Kê Kho' : 'Inventory Table',
            to: "/dhg/kho/inventory",
            icon: (
              <CIcon
                icon={cilSpreadsheet}
                customClassName="nav-icon"
                style={{ color: "#FF4500" }}
              />
            ),
          },
        ]
        : []),
      {
        component: CNavItem,
        name: lang === 'vi' ? 'Phiếu Xuất Kho DHG' : 'DHG Export Slips',
        to: "/dhg/kho/pxkho",
        icon: (
          <CIcon
            icon={cilFile}
            customClassName="nav-icon"
            style={{ color: "#8A2BE2" }}
          />
        ),
      },
    ],
  },
  {
    component: CNavGroup,
    name: lang === 'vi' ? 'Sản phẩm' : 'Products',
    icon: (
      <CIcon
        icon={cilBasket}
        customClassName="nav-icon"
        style={{ color: "#20B2AA" }}
      />
    ),
    items: [
      ...(userPurchase === true
        ? [
          {
            component: CNavItem,
            name: lang === 'vi' ? 'Nhà cung cấp' : 'Suppliers',
            to: "/dhg/sanpham/ncc",
            icon: (
              <CIcon
                icon={cilBuilding}
                customClassName="nav-icon"
                style={{ color: "#20B2AA" }}
              />
            ),
          },
          {
            component: CNavItem,
            name: lang === 'vi' ? 'Danh mục sản phẩm' : 'Product Catalog',
            to: "/dhg/sanpham/sp",
            icon: (
              <CIcon
                icon={cilLibraryBuilding}
                customClassName="nav-icon"
                style={{ color: "#20B2AA" }}
              />
            ),
          },
          {
            component: CNavItem,
            name: lang === 'vi' ? 'Nhập Hàng sản phẩm' : 'Product Import',
            to: "/dhg/sanpham/nhaphang",
            icon: (
              <CIcon
                icon={cilPlus}
                customClassName="nav-icon"
                style={{ color: "#20B2AA" }}
              />
            ),
          },
        ]
        : []),
      {
        component: CNavItem,
        name: lang === 'vi' ? 'Chi tiết sản phẩm' : 'Product Details',
        to: "/dhg/sanpham/spdetail",
        icon: (
          <CIcon
            icon={cilFile}
            customClassName="nav-icon"
            style={{ color: "#20B2AA" }}
          />
        ),
      },
    ],
  },
  ...(userLeader === true
    ? [
      {
        component: CNavGroup,
        name: lang === 'vi' ? 'Nhân sự' : 'Human Resources',
        icon: (
          <CIcon
            icon={cilUser}
            customClassName="nav-icon"
            style={{ color: "#FF69B4" }}
          />
        ),
        items: [
          ...(userAdmin === true
            ? [
              {
                component: CNavItem,
                name: lang === 'vi' ? 'Phân quyền' : 'Permissions',
                to: "/dhg/user/pq",
                icon: (
                  <CIcon
                    icon={cilFile}
                    customClassName="nav-icon"
                    style={{ color: "#FF69B4" }}
                  />
                ),
              },
            ]
            : []),
          {
            component: CNavItem,
            name: lang === 'vi' ? 'Danh sách nhân sự' : 'Staff List',
            to: "/dhg/user/ns",
            icon: (
              <CIcon
                icon={cilList}
                customClassName="nav-icon"
                style={{ color: "#FF69B4" }}
              />
            ),
          },
        ],
      },
    ]
    : []),
  {
    component: CNavGroup,
    name: "POS",
    icon: (
      <CIcon
        icon={cilCalendar}
        customClassName="nav-icon"
        style={{ color: "#FF6347" }}
      />
    ),
    items: [
      {
        component: CNavItem,
        name: lang === 'vi' ? 'Thư mục lưu trữ' : 'Storage Folder',
        to: "/dhg/pos/files",
        icon: (
          <CIcon
            icon={cilFolder}
            customClassName="nav-icon"
            style={{ color: "#FF8C00" }}
          />
        ),
      },
      {
        component: CNavItem,
        name: lang === 'vi' ? 'Lịch làm việc' : 'Work Schedule',
        to: "/dhg/cvpos/lichlv",
        icon: (
          <CIcon
            icon={cilCalendar}
            customClassName="nav-icon"
            style={{ color: "#FF6347" }}
          />
        ),
      },
      {
        component: CNavItem,
        name: lang === 'vi' ? 'Lịch trực' : 'Worked Schedule',
        to: "/dhg/cvpos/lichpos",
        icon: (
          <CIcon
            icon={cilCalendar}
            customClassName="nav-icon"
            style={{ color: "#FF6347" }}
          />
        ),
      },
      {
        component: CNavItem,
        name: lang === 'vi' ? 'Lịch xoay vòng' : 'Rotating Schedule',
        to: "/dhg/cvpos/lichxv",
        icon: (
          <CIcon
            icon={cilCalendar}
            customClassName="nav-icon"
            style={{ color: "#FF6347" }}
          />
        ),
      },
    ],
  },
];

export default _nav;