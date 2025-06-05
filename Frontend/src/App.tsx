import "./App.css";
import { Route, Routes } from "react-router";
import Login from "@/views/login.view";
import Register from "@/views/register.view";
import ForgotPassword from "@/views/forgot-password.view";
import MainApp from "@/views/main-app.view";
import ThemeProvider from "./components/theme/theme-provider";

function App() {
    return (
        <>
            <ThemeProvider defaultTheme="system" storageKey="ui-theme">
                <Routes>
                    <Route path="/login" Component={Login} />
                    <Route path="/register" Component={Register} />
                    <Route
                        path="/forgot-password"
                        Component={ForgotPassword}
                    ></Route>
                    <Route path="/app" Component={MainApp} />
                </Routes>
            </ThemeProvider>
        </>
    );
}

export default App;
