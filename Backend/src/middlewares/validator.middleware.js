import { validationResult } from "express-validator";

import { ApiError } from "../utils/apiErrors.js";

export const validate = (req, res, next) => {
    const errors = validationResult(req);

    if (errors.isEmpty()) {
        return next();
    }

    const extractedErrors = [];

    errors.array().map((err) =>
        extractedErrors.push({
            [err.path]: err.msg,
        }),
    );
    console.log(extractedErrors);

    throw new ApiError(422, "Received data is not valid", extractedErrors);
};
