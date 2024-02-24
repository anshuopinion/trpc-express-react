import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import useUser from "../hook/useUser";
const HideSigninRoutes = () => {
  const { isLogIn } = useUser();

  if (isLogIn === true) {
    return <Navigate to="/dashboard" />;
  }

  return <Outlet />;
};

export default HideSigninRoutes;
