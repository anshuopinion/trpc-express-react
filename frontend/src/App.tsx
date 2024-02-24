import React, { useState } from "react";
import "@fontsource/ibm-plex-sans/400.css";
import "@fontsource/ibm-plex-sans/500.css";
import "@fontsource/ibm-plex-sans/700.css";
import { ChakraProvider, theme } from "@chakra-ui/react";

import { Route, Routes } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

import { httpBatchLink } from "@trpc/client";

import { baseURl } from "./constant";
import Error404 from "src/pages/404/Error404";
import Dashboard from "src/pages/dashboard/Dashboard";
import ForgotPassword from "./pages/forgot-password/ForgotPassword";
import Home from "src/pages/home/Home";
import ResetPassword from "src/pages/reset-password/ResetPassword";
import Signin from "src/pages/signin/SignIn";
import Signup from "src/pages/signup/Signup";
import { refreshHeaderToken } from "src/utils/refreshHeaderToken";
import { trpc } from "src/utils/trpc";
import MainLayout from "./layout/MainLayout/MainLayout";
import HideSigninRoutes from "./components/HideSigninRoutes";
import ProtectedRoutes from "./components/ProtectedRoutes";
function App() {
  const [queryClient] = useState(() => new QueryClient());
  const [trpcClient] = useState(() =>
    trpc.createClient({
      links: [
        httpBatchLink({
          url: baseURl,
          fetch(url, options) {
            return fetch(url, {
              ...options,
              credentials: "include",
            });
          },
          async headers() {
            return refreshHeaderToken();
          },
        }),
      ],
    })
  );

  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>
        <ChakraProvider theme={theme}>
          <Routes>
            <Route element={<MainLayout />}>
              <Route path="/" element={<Home />} />
              <Route element={<HideSigninRoutes />}>
                <Route path="/signin" element={<Signin />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route
                  path="/reset-password/:token"
                  element={<ResetPassword />}
                />
              </Route>
            </Route>

            <Route element={<ProtectedRoutes />}>
              <Route path="/dashboard" element={<Dashboard />} />
            </Route>
            <Route path="*" element={<Error404 />} />
          </Routes>
        </ChakraProvider>
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </trpc.Provider>
  );
}

export default App;
