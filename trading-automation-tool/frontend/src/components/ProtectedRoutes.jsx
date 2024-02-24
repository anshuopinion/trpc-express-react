import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import useUser from "../hook/useUser";
import DashboardLayout from "../layout/DashboardLayout/DashboardLayout";
const ProtectedRoutes = () => {
  const { isLogIn } = useUser();

  if (isLogIn === false) {
    return <Navigate to="/signin" />;
  }

  return (
    <DashboardLayout>
      <Outlet />
    </DashboardLayout>
  );
};

export default ProtectedRoutes;
