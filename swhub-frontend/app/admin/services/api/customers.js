import api from "./api";

// Get Customers
export const getCustomers = async (params = {}) => {
  try {
    const { data } = await api.get("/customers", {
      params,
    });

    return data;
  } catch (error) {
    console.error(error);

    return {
      customers: [],
      pagination: {},
    };
  }
};

// Get Single Customer
export const getCustomer = async (id) => {
  const { data } = await api.get(`/customers/${id}`);
  return data.data;
};

// Create Customer
export const createCustomer = async (customer) => {
  const { data } = await api.post(
    "/customers",
    customer
  );

  return data;
};

// Update Customer
export const updateCustomer = async (
  id,
  customer
) => {
  const { data } = await api.put(
    `/customers/${id}`,
    customer
  );

  return data;
};

// Block
export const blockCustomer = async (id) => {
  const { data } = await api.patch(
    `/customers/${id}/block`
  );

  return data;
};

// Unblock
export const unblockCustomer = async (id) => {
  const { data } = await api.patch(
    `/customers/${id}/unblock`
  );

  return data;
};

// Delete
export const deleteCustomer = async (id) => {
  const { data } = await api.delete(
    `/customers/${id}`
  );

  return data;
};