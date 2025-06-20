import { createContext, useEffect, useState } from "react";
import {
    getAccessTokenFromLS,
    getRefreshTokenFromLS,
    getUserFromLS,
    setAccessTokenToLS,
    setRefreshTokenToLS,
    setUserToLS,
    clearUserFromLS,
    clearTokensFromLS,
} from "@/api/auth";

import { type User } from "@/types/auth";

type Props = {
    children: React.ReactNode;
};

type Tokens = {
    accessToken: string;
    refreshToken: string;
};

const initialUser: User = {
    _id: "",
    name: "",
    email: "",
    username: "",
    avatar: {
        url: "",
        _id: "",
        mimeType: "",
        size: 0,
        public_id: "",
    },
    isAuthenticated: false,
    role: "user",
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
    isLoading: boolean;
    resetAuthData: () => void;
};

export const AuthContext = createContext<AuthContextProps>({
    user: initialUser,
    tokens: initialTokens,
    setLocalTokens: () => {},
    setLocalUser: () => {},
    isLoading: true,
    resetAuthData: () => {},
});

export default function AuthProvider({ children }: Props) {
    const [user, setUser] = useState<User>(initialUser);
    const [tokens, setTokens] = useState<Tokens>(initialTokens);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    //useEffect to load access token and refresh token from local storage
    useEffect(() => {
        const accessToken = getAccessTokenFromLS();
        const refreshToken = getRefreshTokenFromLS();
        const user = getUserFromLS();

        if (accessToken && refreshToken && user) {
            setUser(user);
            setTokens({ accessToken, refreshToken });
        }

        setIsLoading(false);
    }, []);

    //set access token and refresh token in local storage
    function setLocalUser(user: User) {
        setUserToLS<User>(user);
        setUser(user);
    }

    //set access token and refresh token in local storage
    function setLocalTokens(tokens: Tokens) {
        setAccessTokenToLS(tokens.accessToken);
        setRefreshTokenToLS(tokens.refreshToken);
        setTokens(tokens);
    }

    function resetAuthData() {
        setUser(initialUser);
        setTokens(initialTokens);
        clearUserFromLS();
        clearTokensFromLS();
    }

    const value = {
        user,
        tokens,
        setLocalTokens,
        setLocalUser,
        isLoading,
        resetAuthData,
    };

    return (
        <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
    );
}
