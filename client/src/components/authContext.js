import React, { createContext, useContext, useState, useEffect } from "react";
import PropTypes from "prop-types";

const AuthContext = createContext({
  currentUser: null,
  login: () => {},
  logout: () => {},
});

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(() => {
    // Initialize from Local Storage
    const storedUser = localStorage.getItem("currentUser"); // Replace with sessionStorage if you prefer
    return storedUser ? JSON.parse(storedUser) : null;
  });

  // Log current user state
  console.log("Current User State:", currentUser);

  const login = (user) => {
    console.log("Logging in user:", user);
    setCurrentUser(user);
    localStorage.setItem("currentUser", JSON.stringify(user)); // Replace with sessionStorage if you prefer
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem("currentUser"); // Replace with sessionStorage if you prefer
  };

  // Optional: Clear user state when the component unmounts
  useEffect(() => {
    return () => {
      setCurrentUser(null);
    };
  }, []);

  return (
    <AuthContext.Provider value={{ currentUser, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

AuthProvider.propTypes = {
  children: PropTypes.object.isRequired,
};

export const useAuth = () => useContext(AuthContext);
