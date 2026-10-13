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
  identifierOrData,
  otpCode
) => {
  try {
    let payload = {};

    if (typeof identifierOrData === "object" && identifierOrData !== null) {
      payload = {
        customerId: identifierOrData.customerId ? Number(identifierOrData.customerId) : undefined,
        email: identifierOrData.email ? String(identifierOrData.email).trim() : undefined,
        otp: String(identifierOrData.otp || otpCode || "").trim(),
      };
    } else if (typeof identifierOrData === "number" || (!isNaN(Number(identifierOrData)) && String(identifierOrData).length < 10 && !String(identifierOrData).includes("@"))) {
      payload = {
        customerId: Number(identifierOrData),
        otp: String(otpCode || "").trim(),
      };
    } else if (typeof identifierOrData === "string" && identifierOrData.includes("@")) {
      payload = {
        email: identifierOrData.trim(),
        otp: String(otpCode || "").trim(),
      };
    } else {
      payload = {
        customerId: identifierOrData,
        otp: String(otpCode || "").trim(),
      };
    }

    // Clean undefined keys
    Object.keys(payload).forEach((k) => payload[k] === undefined && delete payload[k]);

    const { data } = await api.post(
      "/auth/customer/verify-otp",
      payload
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
  identifierOrData
) => {
  try {
    let payload = {};

    if (typeof identifierOrData === "object" && identifierOrData !== null) {
      payload = {
        customerId: identifierOrData.customerId ? Number(identifierOrData.customerId) : undefined,
        email: identifierOrData.email ? String(identifierOrData.email).trim() : undefined,
      };
    } else if (typeof identifierOrData === "number" || (!isNaN(Number(identifierOrData)) && String(identifierOrData).length < 10 && !String(identifierOrData).includes("@"))) {
      payload = {
        customerId: Number(identifierOrData),
      };
    } else if (typeof identifierOrData === "string" && identifierOrData.includes("@")) {
      payload = {
        email: identifierOrData.trim(),
      };
    } else {
      payload = {
        customerId: identifierOrData,
      };
    }

    Object.keys(payload).forEach((k) => payload[k] === undefined && delete payload[k]);

    const { data } = await api.post(
      "/auth/customer/resend-otp",
      payload
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
// GOOGLE AUTH
// =========================

export const googleAuthCustomer = async (idToken) => {
  try {
    const { data } = await api.post(
      "/auth/customer/google",
      { idToken }
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