import { createContext, useEffect, useState } from "react";
import {
    TOKEN_KEY,
    REFRESH_TOKEN_KEY,
    USER_KEY,
    setToken,
    setRefreshToken,
    setUser as loadUser,
} from "@/api/auth";

type Props = {
    children: React.ReactNode;
};

type User = {
    name: string;
    email: string;
    username: string;
    avatar?: string;
    isAuthenticated: boolean;
};

type Tokens = {
    accessToken: string;
    refreshToken: string;
};

const initialUser: User = {
    name: "",
    email: "",
    username: "",
    avatar: "",
    isAuthenticated: false,
};

const initialTokens: Tokens = {
    accessToken: "",
    refreshToken: "",
};

type AuthContextProps = {
    user: User;
    tokens: Tokens;
    setLocalTokens: (tokens: Tokens) => void;
    setLocalUser: (user: User) => void;
};

export const AuthContext = createContext<AuthContextProps>({
    user: initialUser,
    tokens: initialTokens,
    setLocalTokens: () => {},
    setLocalUser: () => {},
});

export default function AuthProvider({ children }: Props) {
    const [user, setUser] = useState<User>(initialUser);
    const [tokens, setTokens] = useState<Tokens>(initialTokens);

    //useEffect to load access token and refresh token from local storage
    useEffect(() => {
        const accessToken = localStorage.getItem(TOKEN_KEY);
        const refreshToken = localStorage.getItem(REFRESH_TOKEN_KEY);
        const user = localStorage.getItem(USER_KEY);

        if (accessToken && refreshToken) {
            setUser((prev) => {
                return {
                    ...prev,
                    accessToken,
                    refreshToken,
                };
            });
        }

        if (user) {
            setUser(JSON.parse(user));
        }
    }, []);

    //set access token and refresh token in local storage
    function setLocalUser(user: User) {
        loadUser<User>(user);
        setUser(user);
    }

    //set access token and refresh token in local storage
    function setLocalTokens(tokens: Tokens) {
        setToken(tokens.accessToken);
        setRefreshToken(tokens.refreshToken);
        setTokens(tokens);
    }

    const value = {
        user,
        tokens,
        setLocalTokens,
        setLocalUser,
    };

    return (
        <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
    );
}
