import { Routes, Route, Link, Navigate, Outlet } from "react-router-dom";

/**
 * This is a wrapper component that provides protected routing
 * logic.
 */
const ProtectedRoute = (
  isAllowed: boolean,
  redirectPath: string,
  children?: React.FC
) => {
  if (!isAllowed) {
    return <Navigate to={redirectPath} replace />;
  }
  return children ? children : <Outlet />;
};

export default ProtectedRoute;
