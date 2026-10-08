import api from "./axios";

export const submitFranchiseEnquiry = async (formData) => {
  try {
    const { data } = await api.post(
      "/franchise-enquiries",
      formData
    );

    return data;
  } catch (error) {
    console.error(
      "Franchise Enquiry API Error:",
      error.response?.data || error.message
    );

    throw error;
  }
};