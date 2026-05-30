// frontend/src/services/ApiClient.js
import axios from "axios";
import { API_BASE_URL, TOKEN_KEY, USER_KEY } from "../utils/constants";

class ApiClient {
  constructor(baseURL = API_BASE_URL) {
    this.client = axios.create({
      baseURL,
      headers: {
        "Content-Type": "application/json",
      },
    });

    this._setupInterceptors();
  }

  _setupInterceptors() {
    this.client.interceptors.request.use((config) => {
      const token = localStorage.getItem(TOKEN_KEY);
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    });

    this.client.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          // Clear auth data and redirect only once
          const currentPath = window.location.pathname;
          if (!currentPath.includes("/login") && !currentPath.includes("/register")) {
            localStorage.removeItem(TOKEN_KEY);
            localStorage.removeItem(USER_KEY);
            window.location.href = "/login";
          }
        }
        return Promise.reject(error);
      }
    );
  }

  get(url, config = {}) { return this.client.get(url, config); }
  post(url, data = {}, config = {}) { return this.client.post(url, data, config); }
  patch(url, data = {}, config = {}) { return this.client.patch(url, data, config); }
  put(url, data = {}, config = {}) { return this.client.put(url, data, config); }
  delete(url, config = {}) { return this.client.delete(url, config); }
}

const apiClient = new ApiClient();
export default apiClient;