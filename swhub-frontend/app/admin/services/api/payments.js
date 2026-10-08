import api from "./api";

// Get All Payments
export const getPayments = async (params = {}) => {
  const { data } = await api.get("/payments", {
    params,
  });

  return data;
};

// Get Single Payment
export const getPayment = async (id) => {
  const { data } = await api.get(`/payments/${id}`);
  return data.data;
};

// Update Payment Status
export const updatePaymentStatus = async (
  id,
  paymentStatus
) => {
  const { data } = await api.patch(
    `/payments/${id}/status`,
    {
      paymentStatus,
    }
  );

  return data;
};

// Refund Payment
export const refundPayment = async (id) => {
  const { data } = await api.patch(
    `/payments/${id}/refund`
  );

  return data;
};