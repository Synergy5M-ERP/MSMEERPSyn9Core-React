import axios from "axios";

//const axiosInstance = axios.create({
 // baseURL: "https://localhost:7145/api",
//});
const axiosInstance = axios.create({
  baseURL: "https://msmeerpsyn9-core.azurewebsites.net/api",
});
axiosInstance.interceptors.request.use(
  (config) => {
    const token = sessionStorage.getItem("token"); // ✅ FIX

    console.log("TOKEN:", token);

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

export default axiosInstance;