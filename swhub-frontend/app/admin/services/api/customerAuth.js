import api from "./api";

// =========================
// CUSTOMER REGISTER
// =========================

export const registerCustomer = async (customerData) => {
  try {
    const { data } = await api.post(
      "/auth/customer/register",
      customerData
    );

    return data;
  } catch (error) {
    throw error;
  }
};


// =========================
// VERIFY OTP
// =========================

export const verifyCustomerOtp = async (
  customerId,
  otp
) => {
  try {
    const { data } = await api.post(
      "/auth/customer/verify-otp",
      {
        customerId,
        otp,
      }
    );

    return data;
  } catch (error) {
    throw error;
  }
};


// =========================
// RESEND OTP
// =========================

export const resendCustomerOtp = async (
  customerId
) => {
  try {
    const { data } = await api.post(
      "/auth/customer/resend-otp",
      {
        customerId,
      }
    );

    return data;
  } catch (error) {
    throw error;
  }
};


// =========================
// CUSTOMER LOGIN
// =========================

export const loginCustomer = async (
  loginData
) => {
  try {
    const { data } = await api.post(
      "/auth/customer/login",
      loginData
    );

    return data;
  } catch (error) {
    throw error;
  }
};


// =========================
// CUSTOMER PROFILE
// =========================

export const getCustomer = async () => {
  try {
    const { data } = await api.get(
      "/auth/customer/me"
    );

    return data;
  } catch (error) {
    console.error(
      "Get Customer Error:",
      error
    );

    throw error;
  }
};

// =========================
// CUSTOMER LOGOUT
// =========================

export const logoutCustomer = () => {
  localStorage.removeItem("customer_token");
  localStorage.removeItem("customer");
};