import React, { useState, useEffect } from "react";
import "./App.css";
import "primereact/resources/themes/mdc-dark-indigo/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
import { Toolbar } from "primereact/toolbar";
import { Button } from "primereact/button";
import { Dropdown } from "primereact/dropdown";
import { isLoggedIn, isUserAdmin, logout } from "./axios_helper";
import AdminListLinks from "./components/admin/ListLink";
import Login from "./components/Login";
import Register from "./components/Register";
import ListLinks from "./components/ListLink";
import AdminListUsers from "./components/admin/ListUsers";

function App() {
  const [showLogin, setShowLogin] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(isLoggedIn());
  const [selectedComponent, setSelectedComponent] = useState(
    isAuthenticated ? "ListLinks" : null
  );

  useEffect(() => {
    window.addEventListener("error", (e) => {
      if (
        e.message ===
        "ResizeObserver loop completed with undelivered notifications."
      ) {
        const resizeObserverErrDiv = document.getElementById(
          "webpack-dev-server-client-overlay-div"
        );
        const resizeObserverErr = document.getElementById(
          "webpack-dev-server-client-overlay"
        );
        if (resizeObserverErr) {
          resizeObserverErr.setAttribute("style", "display: none");
        }
        if (resizeObserverErrDiv) {
          resizeObserverErrDiv.setAttribute("style", "display: none");
        }
      }
    });

    const loginListener = () => setIsAuthenticated(true);
    window.addEventListener("loginSuccess", loginListener);
    return () => window.removeEventListener("loginSuccess", loginListener);
  }, []);

  useEffect(() => {
    if (selectedComponent) {
      localStorage.setItem("selectedComponent", selectedComponent);
    }
  }, [selectedComponent]);

  let componentOptions = [{ label: "List Links", value: "ListLinks" }];

  if (isUserAdmin()) {
    componentOptions.push(
      { label: "Admin List Links", value: "AdminListLinks" },
      { label: "Admin List Users", value: "AdminListUsers" }
    );
  }

  const toggleForm = () => {
    setShowLogin(!showLogin);
  };

  const handleLogout = () => {
    logout();
    setIsAuthenticated(false);
    localStorage.removeItem("selectedComponent");
    setSelectedComponent(null);
  };

  const startContent = (
    <div className="flex justify-center items-center">
      <p>WebGuardian</p>
    </div>
  );

  const endContent = isAuthenticated ? (
    <div className="flex ">
      {isAuthenticated && (
        <Dropdown
          value={selectedComponent}
          options={componentOptions}
          onChange={(e) => setSelectedComponent(e.value)}
          placeholder="Select Component"
          className="mr-2"
        />
      )}
      <Button
        label="Logout"
        onClick={handleLogout}
        className="p-button-danger"
      />
    </div>
  ) : (
    <div className="flex justify-center items-center">
      <Button
        label="Login"
        onClick={() => setShowLogin(true)}
        className="p-button-text"
      />
      <Button
        label="Register"
        onClick={() => setShowLogin(false)}
        className="p-button-text"
      />
    </div>
  );

  const renderComponent = () => {
    switch (selectedComponent) {
      case "AdminListLinks":
        return <AdminListLinks />;
      case "ListLinks":
        return <ListLinks />;
      case "AdminListUsers":
        return <AdminListUsers />;
      default:
        return null;
    }
  };

  return (
    <div className="App flex flex-col h-screen">
      <Toolbar start={startContent} end={endContent} />
      {isAuthenticated ? (
        renderComponent()
      ) : (
        <div className="flex-grow grid grid-cols-1 md:grid-cols-2 h-screen">
          <div className="flex justify-center items-center">
            <i className="pi pi-shield p-mr-2" style={{ fontSize: "32rem" }}></i>
          </div>
          <div className="bg-[#9FA8DA] flex justify-center items-center h-full">
            {showLogin ? (
              <Login
                onLoginSuccess={() => {
                  setIsAuthenticated(true);
                  setSelectedComponent("ListLinks");
                }}
                onToggle={toggleForm}
              />
            ) : (
              <Register
                onRegisterSuccess={() => {
                  setIsAuthenticated(true);
                  setSelectedComponent("ListLinks");
                }}
                onToggle={toggleForm}
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
