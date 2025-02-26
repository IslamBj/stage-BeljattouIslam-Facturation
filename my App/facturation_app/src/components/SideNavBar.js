import React from "react";
import { FaPlusCircle, FaListUl, FaArchive, FaTimes, FaUserCog } from "react-icons/fa";

const SideNavBar = ({ handleNavClick, toggleSidebar }) => {
  return (
    <nav
      className="shadow-sm p-3"
      style={{
        height: "100%",
        position: "fixed",
        top: "75px",
        overflowY: "auto",
        background: "#04152f",
        width: "200px",
      }}
    >
      {/* Close Button to Hide Sidebar */}
      <button
        className="btn btn-outline-light btn-sm btn-no-border"
        onClick={toggleSidebar}
      >
        <FaTimes />
      </button>
      <br />
      <br />

      <h5 className="text-center mb-4" style={{ color: "white" }}>Navigation</h5>
      <ul className="nav flex-column">
        {/* Add Society Button */}
        <li className="nav-item mb-2">
          <button
            className="nav-link btn w-100 text-start d-flex align-items-center rounded-3 p-2"
            onClick={() => handleNavClick("addSociety")}
            style={{
              transition: "all 0.3s ease",
              color: "rgb(148, 148, 148)",
            }}
          >
            <FaPlusCircle className="me-2" /> Ajouter Société
          </button>
        </li>

        {/* Show List Button */}
        <li className="nav-item mb-2">
          <button
            className="nav-link btn w-100 text-start d-flex align-items-center rounded-3 p-2"
            onClick={() => handleNavClick("showList")}
            style={{
              transition: "all 0.3s ease",
              color: "rgb(148, 148, 148)",
            }}
          >
            <FaListUl className="me-2" /> Afficher Liste
          </button>
        </li>

        {/* Show Archive Button */}
        <li className="nav-item mb-2">
          <button
            className="nav-link btn w-100 text-start d-flex align-items-center rounded-3 p-2"
            onClick={() => handleNavClick("showArchive")}
            style={{
              transition: "all 0.3s ease",
              color: "rgb(148, 148, 148)",
            }}
          >
            <FaArchive className="me-2" /> Afficher Archive
          </button>
        </li>

        {/* Manage Profile Button */}
        <li className="nav-item mb-2">
          <button
            className="nav-link btn w-100 text-start d-flex align-items-center rounded-3 p-2"
            onClick={() => handleNavClick("manageProfile")}
            style={{
              transition: "all 0.3s ease",
              color: "rgb(148, 148, 148)",
            }}
          >
            <FaUserCog className="me-2" /> Gérer le Profil
          </button>
        </li>
      </ul>
    </nav>
  );
};

export default SideNavBar;