export interface LoginResponse {
    user: User;
    accessToken: string;
    refreshToken: string;
}

export interface User {
    _id: string;
    name: string;
    avatar: Avatar;
    username: string;
    email: string;
    role: "user" | "admin"; // Add other roles if needed
    createdAt?: string; // ISO date string
    updatedAt?: string; // ISO date string
    isAuthenticated?: boolean;
}

export interface Avatar {
    url: string;
    mimeType?: string;
    size?: number;
    public_id?: string;
    _id?: string;
}
