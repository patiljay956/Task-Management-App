import { ApiError } from "../utils/apiErrors.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { Project } from "../models/project.models.js";
import { Task } from "../models/task.models.js";

import { ProjectMember } from "../models/projectmember.models.js";
import { TaskStatusEnum, UserRolesEnum } from "../utils/constants.js";
import { ProjectNote } from "../models/notes.models.js";
import { User } from "../models/user.models.js";
// all project admin related operations

const getProjectsSummary = asyncHandler(async (req, res) => {
    const userId = req.user._id;

    // Get projects where user is an admin or project manager
    const adminProjects = await ProjectMember.find({
        user: userId,
        role: { $in: UserRolesEnum.ADMIN },
    }).populate("project");

    const projectIds = adminProjects.map((member) => member.project._id);

    // Count total projects
    const totalProjects = projectIds.length;

    // Count tasks by status
    const AllTaskStats = await Task.aggregate([
        { $match: { project: { $in: projectIds } } },
        {
            $group: {
                _id: "$status",
                count: { $sum: 1 },
            },
        },
    ]);

    // Get most active projects (by task count)
    const topFiveActiveProjects = await Task.aggregate([
        { $match: { project: { $in: projectIds } } },
        {
            $group: {
                _id: "$project",
                taskCount: { $sum: 1 },
            },
        },
        { $sort: { taskCount: -1 } },
        { $limit: 5 },
    ]);

    return res.status(200).json(
        new ApiResponse(
            200,
            {
                totalProjects,
                AllTaskStats,
                topFiveActiveProjects,
            },
            "Project summary fetched successfully",
        ),
    );
});

const getProjectDetails = asyncHandler(async (req, res) => {
    const userId = req.user._id;

    // Get projects where user is an admin or project manager
    const adminProjects = await ProjectMember.find({
        user: userId,
        role: { $in: UserRolesEnum.ADMIN },
    }).populate("project");

    const projectIds = adminProjects.map((member) => member.project._id);

    // Get detailed project info
    const projects = await Project.find({ _id: { $in: projectIds } });

    // For each project, get member count and task completion rate
    const projectDetails = await Promise.all(
        projects.map(async (project) => {
            const memberCount = await ProjectMember.countDocuments({
                project: project._id,
            });

            const tasks = await Task.find({ project: project._id });
            const totalTasks = tasks.length;
            const completedTasks = tasks.filter(
                (task) => task.status === TaskStatusEnum.DONE,
            ).length;
            const completionRate =
                totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

            return {
                _id: project._id,
                name: project.name,
                description: project.description,
                createdAt: project.createdAt,
                memberCount,
                taskCount: totalTasks,
                completionRate: Math.round(completionRate),
            };
        }),
    );

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                projectDetails,
                "Project details fetched successfully",
            ),
        );
});

export { getProjectsSummary, getProjectDetails };

const getTeamOverview = asyncHandler(async (req, res) => {
    const userId = req.user._id;

    // Get projects where user is an admin
    const adminProjects = await ProjectMember.find({
        user: userId,
        role: { $in: UserRolesEnum.ADMIN },
    });

    const projectIds = adminProjects.map((member) => member.project);

    // Get all team members
    const teamMembers = await ProjectMember.find({
        project: { $in: projectIds },
    }).populate("user", "name email username avatar");

    // Count members by role
    const membersByRole = teamMembers.reduce((acc, member) => {
        acc[member.role] = (acc[member.role] || 0) + 1;
        return acc;
    }, {});

    // Get recently added members
    const recentMembers = await ProjectMember.find({
        project: { $in: projectIds },
    })
        .sort({ createdAt: -1 })
        .limit(5)
        .populate("user", "name email username avatar")
        .populate("project", "name");

    return res.status(200).json(
        new ApiResponse(
            200,
            {
                totalMembers: teamMembers.length,
                membersByRole,
                recentMembers,
            },
            "Team overview fetched successfully",
        ),
    );
});

const getMemberPerformance = asyncHandler(async (req, res) => {
    const userId = req.user._id;

    // Get projects where user is an admin
    const adminProjects = await ProjectMember.find({
        user: userId,
        role: { $in: UserRolesEnum.ADMIN },
    });

    const projectIds = adminProjects.map((member) => member.project);

    // Get all team members
    const teamMembers = await ProjectMember.find({
        project: { $in: projectIds },
    }).populate("user", "name email username avatar");

    const memberIds = teamMembers.map((member) => member.user._id);

    // Get tasks assigned to each member
    const memberPerformance = await Promise.all(
        memberIds.map(async (memberId) => {
            const user = teamMembers.find((m) =>
                m.user._id.equals(memberId),
            ).user;

            const assignedTasks = await Task.find({
                project: { $in: projectIds },
                assignedTo: memberId,
            });

            const totalTasks = assignedTasks.length;
            const completedTasks = assignedTasks.filter(
                (task) => task.status === TaskStatusEnum.DONE,
            ).length;
            const completionRate =
                totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

            return {
                user: {
                    _id: user._id,
                    name: user.name,
                    username: user.username,
                    avatar: user.avatar,
                },
                totalTasks,
                completedTasks,
                completionRate: Math.round(completionRate),
            };
        }),
    );

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                memberPerformance,
                "Member performance fetched successfully",
            ),
        );
});

export { getTeamOverview, getMemberPerformance };

const getTasksOverview = asyncHandler(async (req, res) => {
    const userId = req.user._id;

    // Get projects where user is an admin
    const adminProjects = await ProjectMember.find({
        user: userId,
        role: { $in: UserRolesEnum.ADMIN },
    });

    const projectIds = adminProjects.map((member) => member.project);

    // Tasks by status
    const tasksByStatus = await Task.aggregate([
        { $match: { project: { $in: projectIds } } },
        {
            $group: {
                _id: "$status",
                count: { $sum: 1 },
            },
        },
    ]);

    // Tasks by priority
    const tasksByPriority = await Task.aggregate([
        { $match: { project: { $in: projectIds } } },
        {
            $group: {
                _id: "$priority",
                count: { $sum: 1 },
            },
        },
    ]);

    // // Overdue tasks
    // const currentDate = new Date();
    // const overdueTasks = await Task.find({
    //     project: { $in: projectIds },
    //     dueDate: { $lt: currentDate },
    //     status: { $ne: TaskStatusEnum.DONE },
    // })
    //     .populate("project", "name")
    //     .populate("assignedTo", "name username avatar");

    return res.status(200).json(
        new ApiResponse(
            200,
            {
                tasksByStatus,
                tasksByPriority,
            },
            "Tasks overview fetched successfully",
        ),
    );
});

const getTaskTimeline = asyncHandler(async (req, res) => {
    const userId = req.user._id;

    // Get projects where user is an admin
    const adminProjects = await ProjectMember.find({
        user: userId,
        role: { $in: UserRolesEnum.ADMIN },
    });

    const projectIds = adminProjects.map((member) => member.project);

    // Recently created tasks
    const recentTasks = await Task.find({
        project: { $in: projectIds },
    })
        .sort({ createdAt: -1 })
        .limit(5)
        .populate("project", "name")
        .populate("assignedTo", "name username avatar")
        .populate("assignedBy", "name username avatar");

    // Recently completed tasks
    const recentlyCompletedTasks = await Task.find({
        project: { $in: projectIds },
        status: TaskStatusEnum.DONE,
    })
        .sort({ updatedAt: -1 })
        .limit(5)
        .populate("project", "name")
        .populate("assignedTo", "name username avatar")
        .populate("assignedBy", "name username avatar");

    // Task completion trend (last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const completionTrend = await Task.aggregate([
        {
            $match: {
                project: { $in: projectIds },
                status: TaskStatusEnum.DONE,
                updatedAt: { $gte: sevenDaysAgo },
            },
        },
        {
            $group: {
                _id: {
                    $dateToString: { format: "%Y-%m-%d", date: "$updatedAt" },
                },
                count: { $sum: 1 },
            },
        },
        { $sort: { _id: 1 } },
    ]);

    return res.status(200).json(
        new ApiResponse(
            200,
            {
                recentTasks,
                recentlyCompletedTasks,
                completionTrend,
            },
            "Task timeline fetched successfully",
        ),
    );
});

export { getTasksOverview, getTaskTimeline };

const getContentMetrics = asyncHandler(async (req, res) => {
    const userId = req.user._id;

    // Get projects where user is an admin
    const adminProjects = await ProjectMember.find({
        user: userId,
        role: { $in: UserRolesEnum.ADMIN },
    });

    const projectIds = adminProjects.map((member) => member.project);

    // Notes stats
    const notesPerProject = await ProjectNote.aggregate([
        { $match: { project: { $in: projectIds } } },
        {
            $group: {
                _id: "$project",
                count: { $sum: 1 },
            },
        },
        {
            $lookup: {
                from: "projects",
                localField: "_id",
                foreignField: "_id",
                as: "projectInfo",
            },
        },
        {
            $unwind: "$projectInfo",
        },
        {
            $project: {
                _id: 1,
                count: 1,
                projectName: "$projectInfo.name",
            },
        },
    ]);

    // Recent notes
    const recentNotes = await ProjectNote.find({
        project: { $in: projectIds },
    })
        .sort({ createdAt: -1 })
        .limit(5)
        .populate("project", "name")
        .populate("createdBy", "name username avatar");

    // Task attachments
    const tasks = await Task.find({
        project: { $in: projectIds },
        "attachments.0": { $exists: true },
    });

    // Calculate total attachments
    const totalAttachments = tasks.reduce((sum, task) => {
        return sum + task.attachments.length;
    }, 0);

    // Calculate attachments by file type
    const attachmentTypes = {};
    tasks.forEach((task) => {
        task.attachments.forEach((attachment) => {
            const fileType = attachment.url.split(".").pop().toLowerCase();
            attachmentTypes[fileType] = (attachmentTypes[fileType] || 0) + 1;
        });
    });

    return res.status(200).json(
        new ApiResponse(
            200,
            {
                notesPerProject,
                recentNotes,
                totalAttachments,
                attachmentTypes,
            },
            "Content metrics fetched successfully",
        ),
    );
});

export { getContentMetrics };

const getActivityFeed = asyncHandler(async (req, res) => {
    const userId = req.user._id;

    // Get projects where user is an admin
    const adminProjects = await ProjectMember.find({
        user: userId,
        role: { $in: UserRolesEnum.ADMIN },
    });

    const projectIds = adminProjects.map((member) => member.project);

    // Get recent tasks (created/updated)
    const recentTasks = await Task.find({
        project: { $in: projectIds },
    })
        .sort({ updatedAt: -1 })
        .limit(10)
        .populate("project", "name")
        .populate({
            path: "assignedTo", // First, populate the ProjectMember document
            select: "user", // Select only the 'user' field from ProjectMember
            populate: {
                path: "user", // Then, populate the actual User document linked by 'user'
                select: "_id name email username avatar", // Select desired fields from the User
            },
        })
        .populate({
            path: "assignedBy", // First, populate the ProjectMember document
            select: "user", // Select only the 'user' field from ProjectMember
            populate: {
                path: "user", // Then, populate the actual User document linked by 'user'
                select: "_id name email username avatar", // Select desired fields from the User
            },
        });

    // Get recent project members
    const recentMembers = await ProjectMember.find({
        project: { $in: projectIds },
    })
        .sort({ createdAt: -1 })
        .limit(10)
        .populate("user", "name email username avatar")
        .populate("project", "name");

    // Get recent notes
    const recentNotes = await ProjectNote.find({
        project: { $in: projectIds },
    })
        .sort({ createdAt: -1 })
        .limit(10)
        .populate("project", "name")
        .populate("createdBy", "name username avatar");

    // Combine and sort all activities by date
    const activities = [
        ...recentTasks.map((task) => ({
            type: "task",
            data: task,
            date: task.updatedAt,
        })),
        ...recentMembers.map((member) => ({
            type: "member",
            data: member,
            date: member.createdAt,
        })),
        ...recentNotes.map((note) => ({
            type: "note",
            data: note,
            date: note.createdAt,
        })),
    ]
        .sort((a, b) => b.date - a.date)
        .slice(0, 20);

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                activities,
                "Activity feed fetched successfully",
            ),
        );
});

export { getActivityFeed };

const getUserManagementStats = asyncHandler(async (req, res) => {
    // Ensure user is a system admin
    if (req.user.role !== "admin") {
        throw new ApiError(
            403,
            "You are not authorized to access user management stats",
        );
    }

    // Total users
    const totalUsers = await User.countDocuments();

    // Users by verification status
    const verifiedUsers = await User.countDocuments({ isEmailVerified: true });
    const unverifiedUsers = totalUsers - verifiedUsers;

    // Recent registrations
    const recentUsers = await User.find()
        .sort({ createdAt: -1 })
        .limit(10)
        .select("name username email isEmailVerified createdAt");

    // Registration trend (last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const registrationTrend = await User.aggregate([
        {
            $match: {
                createdAt: { $gte: sevenDaysAgo },
            },
        },
        {
            $group: {
                _id: {
                    $dateToString: { format: "%Y-%m-%d", date: "$createdAt" },
                },
                count: { $sum: 1 },
            },
        },
        { $sort: { _id: 1 } },
    ]);

    return res.status(200).json(
        new ApiResponse(
            200,
            {
                totalUsers,
                verificationStats: {
                    verified: verifiedUsers,
                    unverified: unverifiedUsers,
                    verificationRate: Math.round(
                        (verifiedUsers / totalUsers) * 100,
                    ),
                },
                recentUsers,
                registrationTrend,
            },
            "User management stats fetched successfully",
        ),
    );
});

export { getUserManagementStats };
