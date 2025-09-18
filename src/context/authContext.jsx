import React, { createContext, useState, useEffect, useContext } from "react";
import api from "../api"; // axios instance 

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  //Get the current user
  const fetchUser = async () => {
    setLoading(true);
    try {
      const resUser = await api.get("/auth/me");
      if (resUser.data.user) {
        setUser({ ...resUser.data.user, role: "user" });
        return;
      }
    } catch (err) {
      if (err.response?.status !== 404) {
        console.error("Error fetching user:", err);
      }
    }

    try {
      const resDriver = await api.get("/driver/details", { withCredentials: true });
      if (resDriver.data.driver) {
        setUser({ ...resDriver.data.driver, role: "driver" });
        return;
      }
    } catch (err) {
      console.error("Error fetching driver:", err);
    }

    setUser(null);
    setLoading(false);
  };

  useEffect(() => {
    fetchUser();
  }, []);

  useEffect(() => {
    console.log("Fetched user:", user);
  }, [user]);

  const login = async ({ role, ...credentials }) => {
    if (role === "driver") {
      await api.post("/driver/verify-otp-driver", credentials, {
        withCredentials: true,
      });
    } else {
      await api.post("/auth/verify-otp-login", credentials, {
        withCredentials: true,
      });
    }
    await fetchUser();
  };

  const logout = async () => {
    try {
      if (user?.role === "driver") {
        await api.post("/driver/logout", {}, { withCredentials: true });
      } else {
        await api.post("/auth/logout", {}, { withCredentials: true });
      }
      setUser(null);
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
