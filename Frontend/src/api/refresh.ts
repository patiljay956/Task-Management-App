import {
    getRefreshTokenFromLS,
    setRefreshTokenToLS,
    setAccessTokenToLS,
} from "./auth";
import { API_USER_ENDPOINTS } from "./endpoints";
import { useNavigate } from "react-router";

export async function refreshAccessToken(): Promise<string> {
    const navigate = useNavigate();
    const refreshToken = getRefreshTokenFromLS();
    if (!refreshToken) {
        // navigate to login
        navigate("/login", { replace: true });
        throw new Error("No refresh token found");
    }

    const response = await API_USER_ENDPOINTS.refreshAccessToken();

    const { accessToken, refreshToken: newRefreshToken } = response.data;

    // Save new tokens
    setAccessTokenToLS(accessToken);
    setRefreshTokenToLS(newRefreshToken);

    return accessToken;
}
