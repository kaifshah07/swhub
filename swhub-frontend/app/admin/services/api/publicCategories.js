import api from "./api";

export const getPublicCategories = async () => {
  try {
    const { data } = await api.get("/categories");

    return data.data;
  } catch (error) {
    console.error("Get Public Categories Error:", error);
    throw error;
  }
};