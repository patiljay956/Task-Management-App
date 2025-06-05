import { Navigate, useLocation } from "react-router";
import { useAuth } from "@/hooks/use-auth";
import type { JSX } from "react";

interface Props {
    children: JSX.Element;
}

const RequireAuth = ({ children }: Props) => {
    const { user } = useAuth();
    const location = useLocation();

    if (!user.isAuthenticated) {
        // Redirect to login, preserve the location
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    return children;
};

export default RequireAuth;
