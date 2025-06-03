import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiErrors.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { ProjectMember } from "../models/projectmember.models.js";
import { User } from "../models/user.models.js";
import { AvailableUserRoles, UserRolesEnum } from "../utils/constants.js";
import { Project } from "../models/project.models.js";
import { projectInvitationMailGenContent } from "../utils/mail.js";

const getProjectMembers = asyncHandler(async (req, res) => {
    const { projectId } = req.params;

    if (!projectId) {
        throw new ApiError(400, "Project ID is required");
    }

    const members = await ProjectMember.find({ project: projectId })
        .populate({ path: "user", select: "name" })
        .populate({ path: "project", select: "name" })
        .lean();

    if (members.length === 0) {
        return res
            .status(200)
            .json(new ApiResponse(200, [], "No members found"));
    }

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                members,
                "Project members fetched successfully",
            ),
        );
});

const addMemberToProject = asyncHandler(async (req, res) => {
    const { projectId } = req.params;
    const { memberId, role } = req.body; //validation handled in middleware

    // check if project is exists
    const existingProject = await Project.findById(projectId);
    if (!existingProject) throw new ApiError(404, "Project not found ");

    // check if user is exists before add
    const existingUser = await User.findById(memberId).lean();
    if (!existingUser) throw new ApiError(404, "User not found");

    // check if user is already a member of the project
    const existingMember = await ProjectMember.findOne({
        user: memberId,
        project: projectId,
    });

    if (existingMember)
        throw new ApiError(409, "User is already a member of the project");

    // add new member to the project

    const newProjectMember = await ProjectMember.create({
        user: memberId,
        project: projectId,
        role,
    });

    if (!newProjectMember)
        throw new ApiError(500, "Unable to add member to project");

    return res
        .status(201)
        .json(
            new ApiResponse(
                201,
                newProjectMember,
                "Member added to project successfully",
            ),
        );
});

const removeMemberFromProject = asyncHandler(async (req, res) => {
    const { projectId } = req.params;
    const { memberId } = req.body; //validation handled in middleware

    // check if project is exists
    const existingProject = await Project.findById(projectId);
    if (!existingProject) throw new ApiError(404, "Project not found ");

    // check if user is exists before removing
    const existingUser = await User.findById(memberId).lean();
    if (!existingUser) throw new ApiError(404, "User not found");

    // check if user is  a member of the project
    const existingMember = await ProjectMember.findOne({
        user: memberId,
        project: projectId,
    });

    if (!existingMember)
        throw new ApiError(409, "User is not a member of the project");

    if (existingProject.createdBy.toString() === memberId.toString()) {
        throw new ApiError(400, "Cannot remove the project creator");
    }

    const deleteMember = await ProjectMember.deleteOne({
        user: memberId,
        project: projectId,
    });

    // TODO: delete tasks and notes

    if (deleteMember.deletedCount === 0)
        throw new ApiError(500, "Unable to remove member from project");

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                deleteMember,
                "Member removed from project successfully",
            ),
        );
});

const updateMemberRole = asyncHandler(async (req, res) => {
    const { projectId } = req.params;
    const { memberId, role } = req.body; //validation handled in middleware

    // check if project is exists
    const existingProject = await Project.findById(projectId);
    if (!existingProject) throw new ApiError(404, "Project not found ");

    // check if user is exists before add
    const existingUser = await User.findById(memberId).lean();
    if (!existingUser) throw new ApiError(404, "User not found");

    // check if user is already a member of the project
    const existingMember = await ProjectMember.findOne({
        user: memberId,
        project: projectId,
    });

    if (!existingMember)
        throw new ApiError(409, "User is not a member of the project");

    existingMember.role = role;
    const updateMemberRole = await existingMember.save();

    if (!updateMemberRole)
        throw new ApiError(500, "Unable to update user role");

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                existingMember,
                "Member role updated successfully",
            ),
        );
});

const addMemberByEmail = asyncHandler(async (req, res) => {
    const { projectId } = req.params;
    const { email, role } = req.body; //validation handled in middleware

    // check if project is exists
    const existingProject = await Project.findById(projectId);
    if (!existingProject) throw new ApiError(404, "Project not found ");

    // check if user is exists before add
    const existingUser = await User.findOne({ email }).lean();
    if (!existingUser) throw new ApiError(404, "User not found");

    // check if user is already a member of the project
    const existingMember = await ProjectMember.findOne({
        user: existingUser._id,
        project: projectId,
    });

    if (existingMember)
        throw new ApiError(409, "User is already a member of the project");

    // add new member to the project
    const newProjectMember = await ProjectMember.create({
        user: existingUser._id,
        project: projectId,
        role,
    });

    if (!newProjectMember)
        throw new ApiError(500, "Unable to add member to project");

    // send email invitation to the user
    const emailContent = projectInvitationMailGenContent(
        existingUser.name,
        existingProject.name,
        existingProject.description,
        `${process.env.FRONTEND_URL}/projects/${projectId}`,
    );
    const emailSent = await existingUser.sendEmail(
        "Project Invitation",
        emailContent,
    );

    if (!emailSent) {
        throw new ApiError(500, "Failed to send project invitation email");
    }

    return res
        .status(201)
        .json(
            new ApiResponse(
                201,
                newProjectMember,
                "Member added to project successfully",
            ),
        );
});

export {
    getProjectMembers,
    addMemberToProject,
    removeMemberFromProject,
    updateMemberRole,
    addMemberByEmail,
};
