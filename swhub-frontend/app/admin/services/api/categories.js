import api from "./api";

/**
 * Get public categories
 */
export const getCategories = async () => {
  const { data } = await api.get("/categories/public");
  return data.data;
};

/**
 * Get category by ID
 */
export const getCategoryById = async (id) => {
  const { data } = await api.get(`/categories/public/${id}`);
  return data.data;
};

/**
 * Create category
 */
export const createCategory = async (categoryData) => {
  const { data } = await api.post("/admin/categories", categoryData);
  return data;
};

/**
 * Update category
 */
export const updateCategory = async (id, categoryData) => {
  const { data } = await api.put(
    `/admin/categories/${id}`,
    categoryData
  );

  return data;
};

/**
 * Delete category
 */
export const deleteCategory = async (id) => {
  const { data } = await api.delete(
    `/admin/categories/${id}`
  );

  return data;
};