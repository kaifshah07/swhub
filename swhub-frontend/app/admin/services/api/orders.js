import api from "./api";

// Get all orders
export const getOrders = async (params = {}) => {
  try {
    const { data } = await api.get("/orders", {
      params,
    });

    return data;
  } catch (error) {
    console.error("Get Orders Error:", error);

    return {
      orders: [],
      pagination: {},
    };
  }
};

// Get order by ID
export const getOrderById = async (id) => {
  try {
    const { data } = await api.get(`/orders/${id}`);
    return data.data;
  } catch (error) {
    console.error("Get Order Error:", error);
    throw error;
  }
};

// Update Order Status
export const updateOrderStatus = async (id, orderStatus) => {
  try {
    const { data } = await api.patch(`/orders/${id}/status`, {
      orderStatus,
    });

    return data.data;
  } catch (error) {
    console.error("Update Order Status Error:", error);
    throw error;
  }
};

// Update Payment Status
export const updatePaymentStatus = async (
  id,
  paymentStatus
) => {
  try {
    const { data } = await api.patch(`/orders/${id}/payment`, {
      paymentStatus,
    });

    return data.data;
  } catch (error) {
    console.error("Update Payment Error:", error);
    throw error;
  }
};

// Cancel Order
export const cancelOrder = async (id) => {
  try {
    const { data } = await api.patch(`/orders/${id}/cancel`);
    return data.data;
  } catch (error) {
    console.error("Cancel Order Error:", error);
    throw error;
  }
};

// Delete Order
export const deleteOrder = async (id) => {
  try {
    const { data } = await api.delete(`/orders/${id}`);
    return data;
  } catch (error) {
    console.error("Delete Order Error:", error);
    throw error;
  }
};