import { v2 as cloudinary } from "cloudinary";
import fs from "fs/promises";
import { ApiError } from "./apiErrors.js";
import dotenv from "dotenv";
dotenv.config();

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadOnCloudinary = async (localFilePath, folder = "users") => {
    try {
        if (!localFilePath)
            throw new ApiError(400, "Local file path is missing");

        const result = await cloudinary.uploader.upload(localFilePath, {
            folder,
            resource_type: "auto",
        });

        // delete local file
        await fs.unlink(localFilePath);

        return result;
    } catch (error) {
        console.error("Cloudinary Upload Error:", error);

        // delete file even if error occurs
        try {
            await fs.unlink(localFilePath);
        } catch (e) {
            console.warn("Failed to delete temp file:", e);
        }
        return null;
    }
};

const deleteFromCloudinary = async (publicId) => {
    try {
        if (!publicId) throw new ApiError(400, "Public ID is missing");

        const result = await cloudinary.uploader.destroy(publicId, {
            resource_type: "auto",
        });

        if (result.result !== "ok") {
            throw new ApiError(500, "Failed to delete from Cloudinary");
        }

        return true;
    } catch (error) {
        console.error("Cloudinary Delete Error:", error);
        return false;
    }
};

export { uploadOnCloudinary, deleteFromCloudinary };
