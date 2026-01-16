import React from "react";
import PrivateRoutes from "../routes/PrivateRoutes";

import Home from "../views/dashboard/Dashboard";
import Dashboard from "../views/dashboard/Dashboard";
import Project from "../components/DHG/Project/Project";
import Store from "../components/DHG/NewStore/Store";
import CustomersList from "../components/DHG/List Customer/CustomersList";
import DeviceFMV from "../components/DHG/List Customer/DeviceCustomer/DeviceFMV";
import DeviceKohnan from "../components/DHG/List Customer/DeviceCustomer/DeviceKohnan";
import DeviceList from "../components/DHG/List Customer/DeviceCustomer/DeviceList";
import DeviceManagers from "../components/DHG/List Customer/DeviceCustomer/DeviceManagers";
import SupplierList from "../components/DHG/ProductDHG/SupplierList";
import PurchaseOrderList from "../components/DHG/ProductDHG/PurchaseOrderList";
import WarehouseListPage from "../components/DHG/Warehouse/WarehouseListPage";
import ProductSupplierDetail from "../components/DHG/ProductDHG/ProductSupplierDetail";
import InventoryTable from "../components/DHG/Warehouse/InventoryTable";
import ExportList from "../components/DHG/Warehouse/ExportList";
import ExportLoanPOS from "../components/DHG/Warehouse/ExportLoanPOS";
import ExportLoanDetail from "../components/DHG/Warehouse/ExportLoanDetail";
import ProductList from "../components/DHG/ProductDHG/ProductList";
import UserManagement from "../components/DHG/CompanyStaff/UserManagement";
import TeamCalendar from "../components/DHG/POS/TeamCalendar";
import ImportList from "../components/DHG/Warehouse/ImportList";
import UserPermissions from "../components/DHG/CompanyStaff/UserPermissions";
import FileManager from "../components/FileManager/FileManager";

const DHGRoutes = [
  {
    path: "/",
    name: "Home",
    element: <PrivateRoutes element={<Dashboard />} />,
  },
  {
    path: "/dashboard",
    name: "Dashboard",
    element: <PrivateRoutes element={<Dashboard />} />,
  },
  {
    path: "/cv/projectplant",
    name: "Project",
    element: <PrivateRoutes element={<Project />} />,
  },
  {
    path: "/khlist",
    name: "FamilyMart List",
    element: <PrivateRoutes element={<CustomersList />} />,
  },
  { path: "/store/:storeId", element: <PrivateRoutes element={<Store />} /> },
  {
    path: "/familymartlist/:storeID",
    element: <PrivateRoutes element={<DeviceFMV />} />,
  },
  {
    path: "/customerdevice",
    element: <PrivateRoutes element={<DeviceList />} />,
  },
  {
    path: "/thietbikhaibao",
    element: <PrivateRoutes element={<DeviceManagers />} />,
  },
  {
    path: "/kohnanlist/:storeID",
    element: <PrivateRoutes element={<DeviceKohnan />} />,
  },
  {
    path: "/sanpham/ncc",
    element: <PrivateRoutes element={<SupplierList />} />,
  },
  { path: "/sanpham/sp", element: <PrivateRoutes element={<ProductList />} /> },
  {
    path: "/sanpham/nhaphang",
    element: <PrivateRoutes element={<PurchaseOrderList />} />,
  },
  {
    path: "/sanpham/spdetail",
    element: <PrivateRoutes element={<ProductSupplierDetail />} />,
  },
  {
    path: "/kho/list",
    element: <PrivateRoutes element={<WarehouseListPage />} />,
  },
  {
    path: "/kho/inventory",
    element: <PrivateRoutes element={<InventoryTable />} />,
  },
  { path: "/kho/pxkho", element: <PrivateRoutes element={<ExportList />} /> },
  {
    path: "/kho/pxkhokt",
    element: <PrivateRoutes element={<ExportLoanPOS />} />,
  },
  {
    path: "/kho/pxkhokt/:Votes",
    element: <PrivateRoutes element={<ExportLoanDetail />} />,
  },
  { path: "/user/ns", element: <PrivateRoutes element={<UserManagement />} /> },
  {
    path: "/user/pq",
    element: <PrivateRoutes element={<UserPermissions />} />,
  },
  {
    path: "/cvpos/lichlv",
    element: <PrivateRoutes element={<TeamCalendar />} />,
  },
  { path: "/kho/pnkho", element: <PrivateRoutes element={<ImportList />} /> },
  { path: "/pos/files", element: <PrivateRoutes element={<FileManager />} /> },
];

export default DHGRoutes;
