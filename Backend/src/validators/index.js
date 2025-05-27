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

export { userRegistrationValidator, userLoginValidator };
