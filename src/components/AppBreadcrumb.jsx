import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import DHGRoutes from '../routes/DHGRoutes';
import { CBreadcrumb, CBreadcrumbItem } from '@coreui/react';

// Hàm tìm tên route dựa trên pathname
const getRouteName = (pathname, DHGRoutes) => {
  let currentRoute = DHGRoutes.find((route) => route.path === pathname);

  // Nếu không tìm thấy, tìm route có tham số động (dạng :storeId)
  if (!currentRoute) {
    currentRoute = DHGRoutes.find((route) => {
      const routeRegex = new RegExp(`^${route.path.replace(/:\w+/g, '\\w+')}$`);
      return routeRegex.test(pathname);
    });
  }

  return currentRoute ? currentRoute.name : false;
};

// Hàm tạo các breadcrumb
const getBreadcrumbs = (location, DHGRoutes) => {
  const breadcrumbs = [];
  const pathnames = location.split('/').filter((x) => x); // Loại bỏ các phần tử rỗng

  pathnames.reduce((prev, curr, index, array) => {
    const currentPathname = `${prev}/${curr}`;
    const routeName = getRouteName(currentPathname, DHGRoutes);
    if (routeName) {
      breadcrumbs.push({
        pathname: currentPathname,
        name: routeName,
        active: index + 1 === array.length,
      });
    }
    return currentPathname;
  }, ''); // Bắt đầu từ chuỗi rỗng để không lỗi `/`

  return breadcrumbs;
};

const AppBreadcrumb = () => {
  const location = useLocation().pathname;
  const breadcrumbs = getBreadcrumbs(location, DHGRoutes);

  return (
    <CBreadcrumb className="my-0">
      <CBreadcrumbItem component={Link} to="/dhg"></CBreadcrumbItem>
      {breadcrumbs.map((breadcrumb, index) => (
        <CBreadcrumbItem
          key={index}
          component={breadcrumb.active ? 'span' : Link}
          to={breadcrumb.active ? undefined : breadcrumb.pathname}
          className={breadcrumb.active ? 'active' : ''}
        >
          {breadcrumb.name}
        </CBreadcrumbItem>
      ))}
    </CBreadcrumb>
  );
};

export default React.memo(AppBreadcrumb);
