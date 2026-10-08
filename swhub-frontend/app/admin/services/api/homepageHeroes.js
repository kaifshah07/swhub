import api from "./axios";

export const getHeroes = async () => {
  const res = await api.get(
    "/admin/homepage/heroes"
  );

  return res.data.data;
};

export const createHero = async (
  formData
) => {
  const res = await api.post(
    "/admin/homepage/heroes",
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

export const updateHero = async (
  id,
  formData
) => {
  const res = await api.put(
    `/admin/homepage/heroes/${id}`,
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

export const deleteHero = async (
  id
) => {
  const res = await api.delete(
    `/admin/homepage/heroes/${id}`
  );

  return res.data;
};