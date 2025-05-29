import { body } from "express-validator";

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
        body("email").isEmail().withMessage("Email is not valid"),
        body("password").notEmpty().withMessage("Password cannot be empty"),
    ];
};

const emailValidator = () => {
    return [body("email").isEmail().withMessage("Email is not valid")];
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

const productValidator = () => {
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

export {
    userRegistrationValidator,
    userLoginValidator,
    emailValidator,
    passwordValidator,
    productValidator,
};
