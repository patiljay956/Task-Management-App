import { getRefreshToken, setToken, setRefreshToken } from "./auth";
import { API_USER_ENDPOINTS } from "./endpoints";

export async function refreshAccessToken(): Promise<string> {
    const refreshToken = getRefreshToken();
    if (!refreshToken) throw new Error("No refresh token available");

    const response = await API_USER_ENDPOINTS.refreshAccessToken();

    const { accessToken, refreshToken: newRefreshToken } = response.data;

    // Save new tokens
    setToken(accessToken);
    setRefreshToken(newRefreshToken);

    return accessToken;
}
