import express from "express";
import cookieParser from "cookie-parser";

const app = express();
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));
app.use(express.json({ limit: "16kb" }));
app.use(cookieParser());

// import routes
import healthCheckRouter from "./routes/chealthcheck.routes.js";
import usersRouters from "./routes/auth.routes.js";

// routes declaration
app.use("/api/v1/healthcheck", healthCheckRouter);
app.use("/api/v1/user", usersRouters);

export default app;
