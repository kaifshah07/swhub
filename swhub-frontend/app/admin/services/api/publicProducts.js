import api from "./api";

export const getPublicProducts = async () => {
  try {
    const { data } = await api.get("/products");

    return data.data || [];
  } catch (error) {
    console.error("Get Public Products Error:", error);
    throw error;
  }
};

export const getPublicProduct = async (id) => {
  try {
    const { data } = await api.get(`/products/${id}`);

    return data.data || null;
  } catch (error) {
    console.error("Get Public Product Error:", error);
    throw error;
  }
};