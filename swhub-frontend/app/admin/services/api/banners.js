import api from "./axios";

export const getBanners = async () => {
  const res = await api.get("/banners");
  return res.data.data;
};

export const getBanner = async (id) => {
  const res = await api.get(`/banners/${id}`);
  return res.data.data;
};

export const createBanner = async (formData) => {
  const res = await api.post(
    "/banners",
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );

  return res.data;
};

export const updateBanner = async (
  id,
  formData
) => {
  const res = await api.put(
    `/banners/${id}`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );

  return res.data;
};

export const deleteBanner = async (id) => {
  const res = await api.delete(
    `/banners/${id}`
  );

  return res.data;
};
