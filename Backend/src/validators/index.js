import { body, param } from "express-validator";
import {
    AvailableUserRoles,
    AvailableTaskPriority,
    AvailableTaskStatuses,
} from "../utils/constants.js";

const userRegistrationValidator = () => {
    return [
        body("name").trim().notEmpty().withMessage("Name is required"),

        body("username")
            .trim()
            .notEmpty()
            .withMessage("Username is required")
            .isLength({ min: 3 })
            .withMessage("username should me at least 3 char")
            .isLength({ max: 50 })
            .withMessage("username should not exceed 13 char"),

        body("email")
            .trim()
            .notEmpty()
            .withMessage("Email is Required")
            .isEmail()
            .withMessage("Email is invalid"),

        body("password")
            .notEmpty()
            .withMessage("Password is required")
            .isStrongPassword({
                minLength: 8,
                minLowercase: 1,
                minUppercase: 1,
                minNumbers: 1,
                minSymbols: 1,
            })
            .withMessage(
                "password should contain one uppercase, one lowercase, one number and one special character and min length must be 8",
            ),
    ];
};

const userLoginValidator = () => {
    return [
        body("email, username").custom((value, { req }) => {
            if (!value && !req.body.email && !req.body.username) {
                throw new Error("Either email or username is required");
            }
            return true;
        }),
        body("password").notEmpty().withMessage("Password cannot be empty"),
    ];
};

const emailValidator = () => {
    return [body("email").isEmail().withMessage("Email is not valid")];
};

const nameAndUsernameValidator = () => {
    return [
        body("name").trim().notEmpty().withMessage("Name is required"),
        body("username")
            .trim()
            .notEmpty()
            .withMessage("Username is required")
            .isLength({ min: 3 })
            .withMessage("Username must be at least 3 characters long")
            .isLength({ max: 50 })
            .withMessage("Username must not exceed 50 characters"),
    ];
};

const userIdValidator = () => {
    return [
        param("userId").trim().isMongoId().withMessage("User id is invalid"),
    ];
};

const passwordValidator = () => {
    return [
        body("password")
            .notEmpty()
            .withMessage("Password is required")
            .isStrongPassword({
                minLength: 8,
                minLowercase: 1,
                minUppercase: 1,
                minNumbers: 1,
                minSymbols: 1,
            })
            .withMessage(
                "Password must be at least 8 characters long and include one uppercase letter, one lowercase letter, one number, and one special character",
            ),
    ];
};

const changePasswordValidator = () => {
    return [
        body(["password", "newPassword"])
            .notEmpty()
            .withMessage("Password and new password are required")
            .isStrongPassword({
                minLength: 8,
                minLowercase: 1,
                minUppercase: 1,
                minNumbers: 1,
                minSymbols: 1,
            })
            .withMessage(
                "Password must be at least 8 characters long and include one uppercase letter, one lowercase letter, one number, and one special character",
            ),
    ];
};

const projectValidator = () => {
    return [
        body("name")
            .trim()
            .notEmpty()
            .withMessage("Product name is required")
            .isLength({ max: 100 })
            .withMessage("Product name should not exceed 100 characters"),
        body("description")
            .trim()
            .notEmpty()
            .withMessage("Product description is required")
            .isLength({ max: 1000 })
            .withMessage(
                "Product description should not exceed 1000 characters",
            ),
    ];
};

const projectIdValidator = () => {
    return [
        param("projectId")
            .trim()
            .isMongoId()
            .withMessage("project id is invalid"),
    ];
};

const roleValidator = () => {
    return [
        body("role")
            .trim()
            .notEmpty()
            .withMessage("Role is required")
            .isIn(AvailableUserRoles)
            .withMessage(
                `Role must be one of: ${AvailableUserRoles.join(", ")}`,
            ),
    ];
};

const taskIdValidator = () => {
    return [
        param("taskId").trim().isMongoId().withMessage("Task id is invalid"),
    ];
};

const taskStatusAndPriorityValidator = () => {
    return [
        body("status")
            .trim()
            .notEmpty()
            .withMessage("Status is required")
            .isIn(AvailableTaskStatuses)
            .withMessage(
                `Status must be one of: ${AvailableTaskStatuses.join(", ")}`,
            ),
        body("priority")
            .trim()
            .notEmpty()
            .withMessage("Priority is required")
            .isIn(AvailableTaskPriority)
            .withMessage(
                `Priority must be one of: ${AvailableTaskPriority.join(", ")}`,
            ),
    ];
};

const taskValidator = () => {
    return [
        body("title")
            .trim()
            .notEmpty()
            .withMessage("Title is required")
            .isLength({ max: 100 })
            .withMessage("Title should not exceed 100 characters"),
        body("description")
            .trim()
            .notEmpty()
            .withMessage("Description is required")
            .isLength({ max: 1000 })
            .withMessage("Description should not exceed 1000 characters"),

        body("assignedTo")
            .optional()
            .isMongoId()
            .withMessage("Assigned user id is invalid"),
        body("attachments")
            .optional()
            .isArray()
            .withMessage("Attachments must be an array"),
        taskStatusAndPriorityValidator(),
    ];
};
// notes
const noteValidator = () => {
    return [
        body("content")
            .trim()
            .notEmpty()
            .withMessage("Content is required")
            .isLength({ max: 5000 })
            .withMessage("Content should not exceed 5000 characters"),
    ];
};

const noteIdValidator = () => {
    return [
        param("noteId").trim().isMongoId().withMessage("Note id is invalid"),
    ];
};

// subtasks

const subtaskValidator = () => {
    return [
        body("title")
            .trim()
            .notEmpty()
            .withMessage("Title is required")
            .isLength({ max: 100 })
            .withMessage("Title should not exceed 100 characters"),

        body("isCompleted")
            .optional()
            .isBoolean()
            .withMessage("isCompleted must be a boolean value"),
    ];
};

const subtaskIdValidator = () => {
    return [
        param("subtaskId")
            .trim()
            .isMongoId()
            .withMessage("Subtask id is invalid"),
    ];
};

export {
    userRegistrationValidator,
    userLoginValidator,
    emailValidator,
    passwordValidator,
    projectValidator,
    projectIdValidator,
    taskIdValidator,
    taskStatusAndPriorityValidator,
    noteValidator,
    roleValidator,
    taskValidator,
    noteIdValidator,
    subtaskValidator,
    subtaskIdValidator,
    userIdValidator,
    nameAndUsernameValidator,
    changePasswordValidator,
};
