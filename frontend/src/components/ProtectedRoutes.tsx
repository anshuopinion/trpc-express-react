import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import useUser from "src/hook/useUser";
import DashboardLayout from "src/layout/DashboardLayout/DashboardLayout";
const ProtectedRoutes = () => {
  const { isLogIn } = useUser();

  if (isLogIn === false) {
    return <Navigate to="/signin" />;
  }

  return (
    <DashboardLayout title="">
      <Outlet />
    </DashboardLayout>
  );
};

export default ProtectedRoutes;
