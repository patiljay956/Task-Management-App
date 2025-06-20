import { useContext } from "react";
import { AuthContext } from "@/components/contexts/auth-provider";

export const useAuth = () => {
    const context = useContext(AuthContext);

    if (context === undefined)
        throw new Error("useTheme must be used within a ThemeProvider");

    return context;
};
