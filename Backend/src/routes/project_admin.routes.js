import { Router } from "express";

import { UserRolesEnum, AvailableUserRoles } from "../utils/constants.js";

import { hasProjectRole, verifyToken } from "../middlewares/auth.middleware.js";
import { validate } from "../middlewares/validator.middleware.js";
import {
    getActivityFeed,
    getContentMetrics,
    getMemberPerformance,
    getProjectDetails,
    getProjectsSummary,
    getTasksOverview,
    getTaskTimeline,
    getTeamOverview,
    getUserManagementStats,
} from "../controllers/project_admin.controller.js";

const router = Router();

// Apply authentication middleware to all routes
router.use(verifyToken);

// Project Overview Routes
router.get("/projects/summary", getProjectsSummary);
router.get("/projects/details", getProjectDetails);

// Team Management Routes
router.get("/teams/overview", getTeamOverview);
router.get("/members/performance", getMemberPerformance);

// Task Tracking Routes
router.get("/tasks/overview", getTasksOverview);
router.get("/tasks/timeline", getTaskTimeline);

// Project Content Routes
router.get("/content/metrics", getContentMetrics);

// Activity Feed Routes
router.get("/activity", getActivityFeed);

// User Management Routes (System Admin Only)
router.get("/users/stats", getUserManagementStats);

export default router;
