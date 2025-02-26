import React from "react";
import { Link, useLocation } from "react-router-dom";
import { FaSignOutAlt, FaBars, FaArrowLeft } from "react-icons/fa";

const Header = ({ onLogout, toggleSidebar, isSidebarVisible }) => {
  const location = useLocation();

  return (
    <header
      className="bg-primary text-white shadow-sm"
      style={{
        position: "fixed",
        top: 0,
        width: "100%",
        zIndex: 1000,
      }}
    >
      <div className="container d-flex align-items-center justify-content-between " >
        {/* Left Section: Toggle Sidebar Button and Logo */}
        <div className="d-flex align-items-center">
          {/* Show the button only when the sidebar is hidden */}
          {!isSidebarVisible && (
            <button
              className="btn btn-outline-light me-3 d-flex align-items-center"
              onClick={toggleSidebar}
            >
              <FaBars />
            </button>
          )}
          <img
            src="/logo.png"
            alt="Logo"
            style={{ width: "250px", height: "75px",marginTop:"0", borderRadius:"12px", objectFit: "contain" }}
          />
        </div>

        {/* Center Section: Project Title */}
        <div className="text-center" >
          <h4 className="mb-0">Facturation</h4>
        </div>

        {/* Right Section: Logout Button */}
        <div>
          {location.pathname.includes("/company/") && (
            <button
              onClick={() => window.history.back()}
              className="btn btn-outline-light me-2 d-flex align-items-center"
            >
              <FaArrowLeft className="me-2" /> Retour
            </button>
          )}
          <Link
            onClick={onLogout}
            className="btn btn-outline-light d-flex align-items-center"
          >
            <FaSignOutAlt className="me-2" /> Logout
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Header;