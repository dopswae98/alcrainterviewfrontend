import React, { createContext, useState } from "react";

import { useNavigate } from "react-router-dom";

const DataContext = createContext();

const DataContextProvider = ({ children }) => {
  // Define the values you want to provide to consuming components

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();
  const [todoDetailsModal, setTodoDetailsModal] = useState(null);

  const [auth, setAuth] = useState({ token: false });
  const [addmodal, setAddmodal] = useState(false);
  // const [isauthenticated, setIsAuthenticated] = useState(second)

  const [fakeAuthService, setFakeAuthService] = useState({
    isAuthenticated: true,
    login(callback) {
      this.isAuthenticated = true;
      setTimeout(callback, 100);
    },
    logout(callback) {
      this.isAuthenticated = false;
      setTimeout(callback, 100);
    },
  });

  const login = (token) => {
    localStorage.setItem("token", token);
    setIsAuthenticated(true);
    navigate("/home"); // Redirect to private route after login
  };

  const logout = () => {
    localStorage.removeItem("token");
    setIsAuthenticated(false);
    navigate("/"); // Redirect to login page after logout
  };

  const contextValue = {
    message: "Hello, Context!",

    auth,
    setAuth,
    login,
    isAuthenticated,
    setIsAuthenticated,
    logout,
    fakeAuthService,
    setFakeAuthService,

    addmodal,
    setAddmodal,
    todoDetailsModal,
    setTodoDetailsModal,
    /* add more values as needed */
  };

  return (
    <DataContext.Provider value={contextValue}>{children}</DataContext.Provider>
  );
};

// export default TheContext;
export { DataContext, DataContextProvider };
