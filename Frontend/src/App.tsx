import "./App.css";
import { Route, Routes } from "react-router";
import Login from "@/views/login.view";
import Register from "@/views/register.view";
import ForgotPassword from "@/views/forgot-password.view";
import MainApp from "@/views/main-app.view";
import ThemeProvider from "./components/contexts/theme-provider";
import RequireAuth from "./components/auth/require-auth";
import AuthProvider from "./components/contexts/auth-provider";

function App() {
    return (
        <>
            <ThemeProvider defaultTheme="system" storageKey="ui-theme">
                <AuthProvider>
                    <Routes>
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
                </AuthProvider>
            </ThemeProvider>
        </>
    );
}

export default App;
