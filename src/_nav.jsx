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
  cilLibraryBuilding, // ← thêm dòng này
} from "@coreui/icons";
import { CNavGroup, CNavItem } from "@coreui/react";

const storedUser = localStorage.getItem("user");
const parsedUser = storedUser ? JSON.parse(storedUser) : null;
// const userPurchase = parsedUser?.account?.Purchase || "";
// const userExportlist = parsedUser?.account?.Exportlist || "";
// const userAdmin = parsedUser?.account?.Admin || "";
// const userLeader = parsedUser?.account?.Leader || "";
const userPurchase = parsedUser?.account?.Purchase;
const userExportlist = parsedUser?.account?.Exportlist;
const userAdmin = parsedUser?.account?.Admin;
const userLeader = parsedUser?.account?.Leader;
const userReadWarehouse = parsedUser?.account?.ReadWarehouse;

const _nav = [
  {
    component: CNavItem,
    name: "Dashboard",
    to: "/dhg/dashboard",
    icon: (
      <CIcon
        icon={cilSpeedometer}
        customClassName="nav-icon"
        style={{ color: "#1E90FF" }}
      />
    ),
    badge: { color: "info", text: "NEW" },
  },
  {
    component: CNavGroup,
    name: "Công việc",
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
        name: "Dự án và kế hoạch",
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
    name: "Khách hàng",
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
        name: "Danh sách khách hàng",
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
    name: "Thiết bị",
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
        name: "Thiết bị khách hàng",
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
        name: "Phiếu thiết bị",
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
    name: "Kho",
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
        name: "Danh sách kho",
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
        name: "Phiếu Xuất Kho POS",
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
            name: "Phiếu Nhập Kho DHG",
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
            name: "Bảng Kê Kho",
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
        name: "Phiếu Xuất Kho DHG",
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
    name: "Sản phẩm",
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
            name: "Nhà cung cấp",
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
            name: "Danh mục sản phẩm",
            to: "/dhg/sanpham/sp",
            icon: (
              <CIcon
                icon={cilLibraryBuilding}
                customClassName="nav-icon"
                style={{ color: "#20B2AA" }}
              />
            ),
          },
        ]
        : []),
      {
        component: CNavItem,
        name: "Nhập Hàng sản phẩm",
        to: "/dhg/sanpham/nhaphang",
        icon: (
          <CIcon
            icon={cilPlus}
            customClassName="nav-icon"
            style={{ color: "#20B2AA" }}
          />
        ),
      },
      {
        component: CNavItem,
        name: "Chi tiết sản phẩm",
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
  {
    component: CNavGroup,
    name: "Nhân sự",
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
            name: "Phân quyền",
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
      ...(userLeader === true
        ? [
          {
            component: CNavItem,
            name: "Danh sách nhân sự",
            to: "/dhg/user/ns",
            icon: (
              <CIcon
                icon={cilList}
                customClassName="nav-icon"
                style={{ color: "#FF69B4" }}
              />
            ),
          },
        ]
        : []),
    ],
  },
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
        name: "Thư mục lưu trữ",
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
        name: "Lịch làm việc",
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
        name: "Lịch xoay vòng",
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
