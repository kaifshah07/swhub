import api from "./axios";

export const getHomepageSections = async () => {
  const res = await api.get(
    "/homepage/sections"
  );

  return res.data.data;
};

export const updateHomepageSection = async (
  key,
  data
) => {
  const res = await api.put(
    `/homepage/sections/${key}`,
    data
  );

  return res.data.data;
};