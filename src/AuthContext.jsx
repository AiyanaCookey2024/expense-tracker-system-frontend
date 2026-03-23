import { createContext, useState, useEffect, useContext } from "react";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState(null);
  const [authChecked, setAuthChecked] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    const storedUser = localStorage.getItem("username");

    if (
      token &&
      token !== "undefined" &&
      token !== "null" &&
      storedUser
    ) {
      setIsLoggedIn(true);
      setUsername(storedUser);
    } else {
      setIsLoggedIn(false);
      setUsername(null);
    }

    setAuthChecked(true);
  }, []);

  const login = (access, refresh, user) => {
    localStorage.setItem("access_token", access);
    localStorage.setItem("refresh_token", refresh);
    localStorage.setItem("username", user);

    setIsLoggedIn(true);
    setUsername(user);
  };

  const logout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("username");

    setIsLoggedIn(false);
    setUsername(null);
  };

  const getAccessToken = () => localStorage.getItem("access_token");

  return (
    <AuthContext.Provider
      value={{ isLoggedIn, username, login, logout, getAccessToken, authChecked }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);