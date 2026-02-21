import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Function to upload an image to Cloudinary
export async function uploadToCloudinary(filePath) {
    try {
        const result = await cloudinary.uploader.upload(filePath, {
            folder, // Optional: specify a folder name
            resource_type: 'image', // Ensure the resource type is set to image
        });
        return result;
    } catch (error) {
        throw new Error("Cloudinary upload error: " + error.message);
    } finally {
        // Clean up the local file after upload
        fs.unlinkSync(filePath);
    }
}

// Function to delete an image from Cloudinary
export async function deleteFromCloudinary(publicId) {
    try {
        if (!publicId) {
            throw new Error("Public ID is required for deletion.");
        }
        const result = await cloudinary.uploader.destroy(publicId);
        return result;
    } catch (error) {
        throw new Error("Cloudinary delete error: " + error.message);
    }
}
