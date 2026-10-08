import api from "./api";

// Get Coupons
export const getCoupons = async (params = {}) => {
  try {
    const { data } = await api.get("/coupons", {
      params,
    });

    return data;
  } catch (error) {
    console.error(error);

    return {
      coupons: [],
      pagination: {},
    };
  }
};

// Get Single Coupon
export const getCoupon = async (id) => {
  const { data } = await api.get(`/coupons/${id}`);
  return data.data;
};

// Create
export const createCoupon = async (coupon) => {
  const { data } = await api.post(
    "/coupons",
    coupon
  );

  return data;
};

// Update
export const updateCoupon = async (
  id,
  coupon
) => {
  const { data } = await api.put(
    `/coupons/${id}`,
    coupon
  );

  return data;
};

// Activate
export const activateCoupon = async (id) => {
  const { data } = await api.patch(
    `/coupons/${id}/activate`
  );

  return data;
};

// Deactivate
export const deactivateCoupon = async (id) => {
  const { data } = await api.patch(
    `/coupons/${id}/deactivate`
  );

  return data;
};

// Delete
export const deleteCoupon = async (id) => {
  const { data } = await api.delete(
    `/coupons/${id}`
  );

  return data;
};