import api from "./api";

// =====================================================
// PUBLIC PRODUCTS
// =====================================================

export const getPublicProducts = async () => {
  try {
    const { data } =
      await api.get("/products");

    return data.data || [];
  } catch (error) {
    console.error(
      "Get Public Products Error:",
      error
    );

    throw error;
  }
};

// Get single public product
export const getPublicProduct = async (
  id
) => {
  try {
    const { data } =
      await api.get(`/products/${id}`);

    return data.data;
  } catch (error) {
    console.error(
      "Get Public Product Error:",
      error
    );

    throw error;
  }
};

// =====================================================
// ADMIN PRODUCTS
// =====================================================

// Get all admin products
export const getProducts = async () => {
  try {
    const { data } =
      await api.get("/admin/products");

    return data.data || data;
  } catch (error) {
    console.error(
      "Get Products Error:",
      error
    );

    throw error;
  }
};

// =====================================================
// CREATE PRODUCT
// =====================================================

export const createProduct = async (
  productData
) => {
  try {
    const { data } =
      await api.post(
        "/admin/products",
        productData
      );

    return data;
  } catch (error) {
    console.error(
      "Create Product Error:",
      error?.response?.data || error
    );

    throw error;
  }
};

// =====================================================
// UPDATE PRODUCT
// =====================================================

export const updateProduct = async (
  id,
  productData
) => {
  try {
    const { data } =
      await api.put(
        `/admin/products/${id}`,
        productData
      );

    return data;
  } catch (error) {
    console.error(
      "Update Product Error:",
      error?.response?.data || error
    );

    throw error;
  }
};

// =====================================================
// DELETE PRODUCT
// =====================================================

export const deleteProduct = async (
  id
) => {
  try {
    const { data } =
      await api.delete(
        `/admin/products/${id}`
      );

    return data;
  } catch (error) {
    console.error(
      "Delete Product Error:",
      error?.response?.data || error
    );

    throw error;
  }
};