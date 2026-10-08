import api from "./api";

export const getDashboard = async () => {
  const { data } = await api.get("/admin/dashboard");
  const dashboard = data.dashboard ?? data.data ?? data;

  if (!dashboard?.statistics) {
    throw new Error("Dashboard response is missing statistics");
  }

  return dashboard;
};
