import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";

const app = express();
app.use(
    cors({
        origin: process.env.FRONTEND_URL,
        credentials: true,
        methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
        allowedHeaders: ["Content-Type", "Authorization"],
    }),
);
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));
app.use(express.json({ limit: "16kb" }));
app.use(cookieParser());

// import routes
import healthCheckRouter from "./routes/chealthcheck.routes.js";
import usersRouters from "./routes/auth.routes.js";
import projectsRouters from "./routes/project.routes.js";
import notesRoutes from "./routes/note.routes.js";
import subtasksRoutes from "./routes/subtask.routes.js";

import projectAdminRoutes from "./routes/project_admin.routes.js";

// routes declaration
app.use("/api/v1/healthcheck", healthCheckRouter);
app.use("/api/v1/user", usersRouters);
app.use("/api/v1/project", projectsRouters);
app.use("/api/v1/note", notesRoutes);
app.use("/api/v1/subtask", subtasksRoutes);
app.use("/api/v1/project-admin", projectAdminRoutes);

import { ApiError } from "./utils/apiErrors.js";

app.use((err, req, res, next) => {
    console.error("Global Error Handler:", err);

    // console.log(req);

    if (err instanceof ApiError) {
        return res.status(err.statusCode).json({
            status: err.statusCode,
            message: err.message,
            errors: err.errors || [],
            success: false,
        });
    }

    return res.status(500).json({
        status: 500,
        message: err.message || "Internal Server Error",
        success: false,
    });
});

export default app;
