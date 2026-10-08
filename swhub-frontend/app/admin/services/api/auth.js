import api from "./api";

// Admin Login
export const login = async (username, password) => {
  try {
    const { data } = await api.post("/admin/login", {
      username,
      password,
    });

    // Save JWT Token
    if (data.token) {
      localStorage.setItem("adminToken", data.token);
    }

    // Save Admin Info (optional)
    if (data.admin) {
      localStorage.setItem(
        "adminUser",
        JSON.stringify(data.admin)
      );
    }

    return data;
  } catch (error) {
    console.error("Login Error:", error);
    throw error;
  }
};

// Logout
export const logout = () => {
  localStorage.removeItem("adminToken");
  localStorage.removeItem("adminUser");
};

// Get Token
export const getToken = () => {
  return localStorage.getItem("adminToken");
};

// Get Logged In Admin
export const getAdmin = () => {
  const admin = localStorage.getItem("adminUser");

  return admin ? JSON.parse(admin) : null;
};

// Check Login
export const isAuthenticated = () => {
  return !!localStorage.getItem("adminToken");
};