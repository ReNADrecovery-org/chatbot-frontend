import { createRoot } from "react-dom/client";
import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./assets/css/animate.min.css";
import "./assets/scss/light-bootstrap-dashboard-react.scss?v=2.0.0";
import "./assets/css/demo.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "react-tooltip/dist/react-tooltip.css";
import AdminLayout from "layouts/Admin.js";
import TableList from "views/Icons";
import routes from "routes.js";
import Entry from "views/entry/Entry";
import PrivateRoute from "components/Auth/PrivateRoute";
import { AuthProvider } from "components/Auth/AuthContext";
import { useAuth } from "components/Auth/AuthContext";
import { useEffect } from "react";
import { environment } from "environment";
import httpClient from "components/Auth/httpClient";

function App() {
  const BASE_URL = environment.BASE_URL;
  const { dispatch } = useAuth();

  useEffect(() => {
    (async () => {
      try {
        const res = await httpClient.get(`${BASE_URL}/api/@me`);
        console.log(res);
        dispatch({ type: "LOGIN", user });
        navigate("/admin");
      } catch (error) {
        console.error(error);
      }
    })();
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/admin"
          // element={<PrivateRoute element={<AdminLayout />} />}
          element={<AdminLayout />}
        >
          {routes.map((route) => (
            <Route
              path={route.path}
              // element={<PrivateRoute element={<route.component />} />}
              element={<route.component />}
              key={route}
            />
          ))}
        </Route>
        <Route path="/" element={<Navigate to="/admin/dashboard" />} />
      </Routes>
    </BrowserRouter>
  );
}

const root = document.getElementById("root");

createRoot(root).render(
  <AuthProvider>
    <App />
  </AuthProvider>
);
