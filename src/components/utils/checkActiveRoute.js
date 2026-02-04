// src/components/utils/checkActiveRoute.js
export const checkActiveRoute = (routePath, options = {}) => {
  const {
    basePath = "",
    isFirstItem = false,
    items = [],
    currentPath = "", // Accept it here
  } = options;

  // Use `currentPath` instead of global `location.pathname`
  const isCurrentUrl = currentPath === routePath;

  const isHomePage =
    isFirstItem &&
    (currentPath === basePath || currentPath === `${basePath}/`) &&
    items.length > 0;

  return isCurrentUrl || isHomePage;
};
