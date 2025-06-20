import { Navigate, useLocation } from "react-router";
import { useAuth } from "@/hooks/use-auth";
import type { JSX } from "react";
import Loading from "../loading/loading";

interface Props {
    children: JSX.Element;
}

const RequireAuth = ({ children }: Props) => {
    const { user, isLoading } = useAuth();
    const location = useLocation();

    if (isLoading) {
        return <Loading />;
    }

    if (!user.isAuthenticated) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    return children;
};

export default RequireAuth;
