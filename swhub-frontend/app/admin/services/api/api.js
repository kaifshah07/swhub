  import axios from "axios";
  import { API_URL } from "@/lib/api";

  const api = axios.create({
    baseURL: API_URL,
    timeout: 10000,
  });

  // Attach JWT Token automatically
  api.interceptors.request.use(
    (config) => {
      const isFormData =
        typeof FormData !== "undefined" && config.data instanceof FormData;

      if (isFormData) {
        delete config.headers["Content-Type"];
      } else {
        config.headers["Content-Type"] = "application/json";
      }

      if (typeof window !== "undefined") {
        const isAdminRequest =
          config.url?.startsWith("/admin") ||
          window.location.pathname.startsWith("/admin");

        const adminToken = localStorage.getItem("adminToken");
        const customerToken = localStorage.getItem("customer_token");

        const token = isAdminRequest ? adminToken : (customerToken || adminToken);

        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
      }

      return config;
    },
    (error) => Promise.reject(error)
  );

  // Handle expired token globally
  api.interceptors.response.use(
    (response) => response,
    (error) => {
      if (
        error.response?.status === 401 &&
        typeof window !== "undefined"
      ) {
        const isAdminRequest =
          error.config?.url?.startsWith("/admin") ||
          window.location.pathname.startsWith("/admin");

        if (isAdminRequest) {
          localStorage.removeItem("adminToken");
          window.location.href = "/admin/login";
        }
      }

      return Promise.reject(error);
    }
  );

  export default api;

  // import axios from "axios";

  // const api = axios.create({
  //   baseURL: "http://localhost:5000/api",
  //   headers: {
  //     "Content-Type": "application/json",
  //   },
  // });

  // export default api;
