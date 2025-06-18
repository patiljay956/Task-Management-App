import "./App.css";
import { Navigate, Route, Routes } from "react-router";
import Login from "@/views/login.view";
import Register from "@/views/register.view";
import ForgotPassword from "@/views/forgot-password.view";
import MainApp from "@/views/main-app.view";
import ThemeProvider from "./components/contexts/theme-provider";
import RequireAuth from "./components/auth/require-auth";
import AuthProvider from "./components/contexts/auth-provider";
import { ErrorBoundary } from "./components/error/error-boundary";
import { Toaster } from "./components/ui/sonner";
import TokenAction from "./views/token-action.view";
import { StoreProvider } from "./components/contexts/store-provider";
import NotFound from "./views/not-found.view";

function App() {
    return (
        <>
            <ErrorBoundary>
                <StoreProvider>
                    <ThemeProvider defaultTheme="system" storageKey="ui-theme">
                        <AuthProvider>
                            <Routes>
                                <Route
                                    path="/"
                                    element={<Navigate to="/app" replace />}
                                />
                                <Route path="/login" Component={Login} />
                                <Route path="/register" Component={Register} />
                                <Route
                                    path="/forgot-password"
                                    Component={ForgotPassword}
                                />
                                <Route
                                    path="/verify-email/:token"
                                    element={
                                        <TokenAction action="verifyEmail" />
                                    }
                                />
                                <Route
                                    path="/reset-password/:token"
                                    element={
                                        <TokenAction action="resetPassword" />
                                    }
                                />
                                <Route
                                    path="/app/*"
                                    element={
                                        <RequireAuth>
                                            <MainApp />
                                        </RequireAuth>
                                    }
                                />
                                <Route
                                    path="*"
                                    element={
                                        <NotFound className="min-h-screen" />
                                    }
                                />
                            </Routes>
                            <Toaster></Toaster>
                        </AuthProvider>
                    </ThemeProvider>
                </StoreProvider>
            </ErrorBoundary>
        </>
    );
}

export default App;
