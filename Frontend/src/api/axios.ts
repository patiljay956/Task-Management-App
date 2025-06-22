import axios from "axios";
import { attachAuthTokenInterceptor } from "./interceptors";

const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL, // 🛠️ Replace with your API base URL
    timeout: 10000,
    headers: {
        "Content-Type": "application/json",
    },
    withCredentials: true,
});

// 🔐 Attach token injector
attachAuthTokenInterceptor(api);

export default api;
