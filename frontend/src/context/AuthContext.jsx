import { createContext, useContext, useEffect, useState } from "react";

import api from "../services/api";

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  // ========================================
  // STATE
  // ========================================

  const [user, setUser] = useState(null);

  const [token, setToken] = useState(localStorage.getItem("jobtrack_token"));

  const [loading, setLoading] = useState(true);

  // ========================================
  // GET USER PROFILE
  // ========================================

  const getProfile = async (savedToken) => {
    try {
      const response = await api.get("/users/profile", {
        headers: {
          Authorization: `Bearer ${savedToken}`,
        },
      });

      if (response.data.success) {
        setUser(response.data.user);
      } else {
        throw new Error(response.data.message || "Unable to load user profile");
      }
    } catch (error) {
      console.error("Get Profile Error:", error);

      // Invalid / expired token
      localStorage.removeItem("jobtrack_token");

      setToken(null);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  // ========================================
  // CHECK LOGIN ON APP START
  // ========================================

  useEffect(() => {
    const savedToken = localStorage.getItem("jobtrack_token");

    if (savedToken) {
      setToken(savedToken);
      getProfile(savedToken);
    } else {
      setLoading(false);
    }
  }, []);

  // ========================================
  // REGISTER
  // ========================================

  const register = async (name, email, password) => {
    try {
      const response = await api.post("/auth/register", {
        name,
        email,
        password,
      });

      if (!response.data.success) {
        throw new Error(response.data.message || "Registration failed");
      }

      const newToken = response.data.token;

      if (!newToken) {
        throw new Error("Token was not received from server");
      }

      // Save token
      localStorage.setItem("jobtrack_token", newToken);

      // Update state
      setToken(newToken);
      setUser(response.data.user);

      return response.data;
    } catch (error) {
      console.error("Register Error:", error);

      throw error;
    }
  };

  // ========================================
  // LOGIN
  // ========================================

  const login = async (email, password) => {
    try {
      const response = await api.post("/auth/login", {
        email,
        password,
      });

      if (!response.data.success) {
        throw new Error(response.data.message || "Login failed");
      }

      const newToken = response.data.token;

      if (!newToken) {
        throw new Error("Token was not received from server");
      }

      // Save token
      localStorage.setItem("jobtrack_token", newToken);

      // Update state
      setToken(newToken);
      setUser(response.data.user);

      return response.data;
    } catch (error) {
      console.error("Login Error:", error);

      throw error;
    }
  };

  // ========================================
  // LOGOUT
  // ========================================

  const logout = () => {
    localStorage.removeItem("jobtrack_token");

    setToken(null);
    setUser(null);

    window.location.href = "/login";
  };

  // ========================================
  // CONTEXT VALUE
  // ========================================

  const value = {
    user,
    token,
    loading,
    register,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// ========================================
// CUSTOM HOOK
// ========================================

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }

  return context;
};
