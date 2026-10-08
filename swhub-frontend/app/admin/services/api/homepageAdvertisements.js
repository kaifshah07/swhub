import api from "./axios";

export const getAdvertisements = async () => {
  const res = await api.get(
    "/homepage/advertisements"
  );

  return res.data.data;
};

export const createAdvertisement = async (
  formData
) => {
  const res = await api.post(
    "/homepage/advertisements",
    formData,
    {
      headers: {
        "Content-Type":
          "multipart/form-data",
      },
    }
  );

  return res.data;
};

export const updateAdvertisement = async (
  id,
  formData
) => {
  const res = await api.put(
    `/homepage/advertisements/${id}`,
    formData,
    {
      headers: {
        "Content-Type":
          "multipart/form-data",
      },
    }
  );

  return res.data;
};

export const deleteAdvertisement =
  async (id) => {
    const res = await api.delete(
      `/homepage/advertisements/${id}`
    );

    return res.data;
  };