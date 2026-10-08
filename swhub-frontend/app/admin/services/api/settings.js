import api from "./api";

// Get Settings
export const getSettings = async () => {
  try {
    const { data } = await api.get("/settings");
    return data.data;
  } catch (error) {
    console.error("Get Settings Error:", error);
    return {};
  }
};

// Update Settings
export const updateSettings = async (settingsData) => {
  try {
    const { data } = await api.put("/settings", settingsData);
    return data.data;
  } catch (error) {
    console.error("Update Settings Error:", error);
    throw error;
  }
};