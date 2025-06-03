import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";
const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            trim: true,
            required: true,
            index: true,
        },
        avatar: {
            type: {
                url: String,
                mimeType: String,
                size: Number,
                public_id: String,
            },
            default: {
                url: "https://placehold.co/600x400",
                localPath: "",
            },
        },
        username: {
            type: String,
            trim: true,
            required: true,
            lowercase: true,
        },
        email: {
            type: String,
            trim: true,
            required: true,
            lowercase: true,
        },
        password: {
            type: String,
            required: true,
        },
        isEmailVerified: {
            type: Boolean,
            default: false,
        },
        emailVerificationToken: {
            type: String,
        },
        emailVerificationExpiry: {
            type: Date,
        },
        forgotPasswordToken: {
            type: String,
        },
        forgotPasswordExpiry: {
            type: Date,
        },
        refreshToken: {
            type: String,
        },
        role: {
            type: String,
            enum: ["user", "admin"],
            default: "user",
        },
    },
    { timestamps: true },
);

userSchema.pre("save", async function (next) {
    if (this.isModified("password")) {
        this.password = await bcrypt.hash(this.password, 10);
        next();
    } else {
        next();
    }
});

userSchema.methods.isPasswordCorrect = async function (password) {
    return await bcrypt.compare(password, this.password);
};

userSchema.methods.generateAccessToken = function () {
    return jwt.sign(
        {
            _id: this._id,
            email: this.email,
            username: this.username,
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
        },
    );
};

userSchema.methods.generateRefreshToken = function () {
    return jwt.sign(
        {
            _id: this._id,
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
        },
    );
};

userSchema.methods.generateTemporaryToken = function (requestFor) {
    const unHashedToken = crypto.randomBytes(20).toString("hex");

    const hashedToken = crypto
        .createHash("sha256")
        .update(unHashedToken)
        .digest("hex");

    const tokenExpiry = Date.now() + 20 * 60 * 1000;

    if (requestFor == "email") {
        this.emailVerificationExpiry = tokenExpiry;
        this.emailVerificationToken = hashedToken;
    } else if (requestFor == "password") {
        this.forgotPasswordToken = hashedToken;
        this.emailVerificationExpiry = tokenExpiry;
    }

    return {
        unHashedToken,
    };
};

export const User = mongoose.model("User", userSchema);
