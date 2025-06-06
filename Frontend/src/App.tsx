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

function App() {
    return (
        <>
            <ErrorBoundary>
                <ThemeProvider defaultTheme="system" storageKey="ui-theme">
                    <AuthProvider>
                        <Routes>
                            <Route
                                path="/"
                                element={<Navigate to="/app" replace />}
                            ></Route>
                            <Route path="/login" Component={Login} />
                            <Route path="/register" Component={Register} />
                            <Route
                                path="/forgot-password"
                                Component={ForgotPassword}
                            ></Route>
                            <Route
                                path="/app"
                                element={
                                    <RequireAuth>
                                        <MainApp />
                                    </RequireAuth>
                                }
                            />
                        </Routes>
                        <Toaster></Toaster>
                    </AuthProvider>
                </ThemeProvider>
            </ErrorBoundary>
        </>
    );
}

export default App;
