import api from "./api";

// Get all subcategories
export const getSubCategories = async () => {
  const { data } = await api.get("/subcategories");
  return data.data;
};

// Get subcategories for a specific category
export const getSubCategoriesByCategory = async (
  categoryId
) => {
  const { data } = await api.get(
    `/subcategories/category/${categoryId}`
  );

  return data.data;
};

// Get one subcategory
export const getSubCategoryById = async (id) => {
  const { data } = await api.get(
    `/subcategories/${id}`
  );

  return data.data;
};

// Create
export const createSubCategory = async (
  subCategoryData
) => {
  const { data } = await api.post(
    "/subcategories",
    subCategoryData
  );

  return data;
};

// Update
export const updateSubCategory = async (
  id,
  subCategoryData
) => {
  const { data } = await api.put(
    `/subcategories/${id}`,
    subCategoryData
  );

  return data;
};

// Delete
export const deleteSubCategory = async (id) => {
  const { data } = await api.delete(
    `/subcategories/${id}`
  );

  return data;
};