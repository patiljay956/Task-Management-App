import axios from "axios";
import { attachAuthTokenInterceptor } from "./interceptors";

const api = axios.create({
    baseURL: "http://localhost:3000/api/v1", // 🛠️ Replace with your API base URL
    timeout: 10000,
    headers: {
        "Content-Type": "application/json",
    },
    withCredentials: true,
});

// 🔐 Attach token injector
attachAuthTokenInterceptor(api);

export default api;
