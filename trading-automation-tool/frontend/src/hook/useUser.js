import React, { useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import { useNavigate } from "react-router-dom";

function useUser() {
  const navigate = useNavigate();
  const [cookies, setCookie, removeCookie] = useCookies(["user"]);
  const [isLogIn, setIsLogIn] = useState();
  const user = cookies?.user;

  const logIn = (user) => {
    setCookie("user", user, { path: "/" });
  };

  const logout = () => {
    removeCookie("user");
    setCookie("user", null, { path: "/" });
    navigate("/");
  };

  useEffect(() => {
    if (user) {
      setIsLogIn(true);
    } else {
      setIsLogIn(false);
    }
  }, [user]);

  return { isLogIn, user, logIn, logout };
}

export default useUser;
