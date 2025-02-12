import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./Login";
import Dashboard from "./Dashboard";
import Header from "./components/header";
import SideNavBar from "./components/SideNavBar";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css"; // Custom CSS for additional styling

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activeSection, setActiveSection] = useState("showList"); // Default section
  const [isSidebarVisible, setIsSidebarVisible] = useState(true); // Sidebar visibility state

  const handleLogin = () => setIsAuthenticated(true);
  const handleLogout = () => setIsAuthenticated(false);

  const handleNavClick = (section) => {
    setActiveSection(section); // Update the active section
  };

  const toggleSidebar = () => {
    setIsSidebarVisible(!isSidebarVisible); // Toggle sidebar visibility
  };

  return (
    <Router>
      <div className="app-container">
        {isAuthenticated ? (
          <>
            {/* Header */}
            <Header
              onLogout={handleLogout}
              toggleSidebar={toggleSidebar}
              isSidebarVisible={isSidebarVisible}
            />

            {/* Sidebar and Main Content */}
            <div className="d-flex">
              {/* Sidebar */}
              {isSidebarVisible && (
                <SideNavBar
                  handleNavClick={handleNavClick}
                  toggleSidebar={toggleSidebar}
                />
              )}

              {/* Main Content */}
              <div
                className={`flex-grow-1 p-4 content ${isSidebarVisible ? "" : "centered-content"}`}
              >
                <Routes>
                  <Route
                    path="/dashboard"
                    element={<Dashboard activeSection={activeSection} />}
                  />
                  <Route path="*" element={<Navigate to="/dashboard" />} />
                </Routes>
              </div>
            </div>
          </>
        ) : (
          <Routes>
            <Route path="/login" element={<Login onLogin={handleLogin} />} />
            <Route path="*" element={<Navigate to="/login" />} />
          </Routes>
        )}
      </div>
    </Router>
  );
}

export default App;