// SessionContext.js
import React, { createContext, useContext, useEffect, useState } from 'react';

const SessionContext = createContext();

export function useSession() {
  return useContext(SessionContext);
}

export function SessionProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [logoutTimer, setLogoutTimer] = useState(null);
  const [idleTimer, setIdleTimer] = useState(null);

  const login = (userData, authToken) => {
    setUser(userData);
    setToken(authToken);
    localStorage.setItem('token', authToken);
    resetLogoutTimer();
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("userId");
    localStorage.removeItem("token");
    clearTimeout(logoutTimer);
    clearTimeout(idleTimer);
  };

  const resetLogoutTimer = () => {
    clearTimeout(logoutTimer);
    setLogoutTimer(
      setTimeout(() => {
        logout();
        window.location.replace("/");
      }, 12000000) // 2 minutes in milliseconds 120000
    );
  };

  const resetIdleTimer = () => {
    clearTimeout(idleTimer);
    setIdleTimer(
      setTimeout(() => {
        logout();
        window.location.replace("/");
      }, 12000000) // 2 minutes in milliseconds
    );
  };

  const handleUserActivity = () => {
    resetLogoutTimer();
    resetIdleTimer();
  };

  useEffect(() => {
    if (token) {
      resetLogoutTimer();
      resetIdleTimer();

      window.addEventListener('mousemove', handleUserActivity);
      window.addEventListener('keydown', handleUserActivity);

      return () => {
        window.removeEventListener('mousemove', handleUserActivity);
        window.removeEventListener('keydown', handleUserActivity);
      };
    }
  }, [token]);

  return (
    <SessionContext.Provider value={{ user, token, login, logout }}>
      {children}
    </SessionContext.Provider>
  );
}
