import React, { useState, createContext } from "react";
import { Outlet, Link, useNavigate } from "react-router-dom";

import AdminNavbar from "components/Navbars/AdminNavbar";
import Footer from "components/Footer/Footer";
import Sidebar from "components/Sidebar/Sidebar";

import routes from "routes.js";

import sidebarImage from "assets/img/sidebar-3.jpg";

export const DataContext = createContext();

function Admin() {
  const [image, setImage] = useState(sidebarImage);
  const [color, setColor] = useState("black");
  const [hasImage, setHasImage] = useState(true);
  const [data, setData] = useState({});

  return (
    <div className="wrapper flex">
      <DataContext.Provider value={{ data, setData }}>
        <Sidebar color={color} image={hasImage ? image : ""} routes={routes} />
        <div className="main-panel w-75">
          <AdminNavbar />
          <div className="content">
            <Outlet />
          </div>
          <Footer />
        </div>
      </DataContext.Provider>
    </div>
  );
}

export default Admin;
