import jwt from 'jsonwebtoken';
import Doctor from '../models/Doctor.js';

const JWT_SECRET = process.env.JWT_SECRET;

export default async function doctorAuth(req, res, next) {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({
            success: false,
            message: "Doctor Unauthorized, token missing"
        });
    }

    const token = authHeader.split(" ")[1];
    try {
        const payload = jwt.verify(token, JWT_SECRET);

if(payload.role && payload.role !== "doctor") {
    return res.status(403).json({
        success: false,
        message: "Access denied, insufficient permissions for doctor resources (not a doctor)"
    });
}

        const doctor = await Doctor.findById(payload.id).select("-password");
        if (!doctor) {
            return res.status(404).json({
                success: false,
                message: "Doctor not found"
            });
        }
        // Attach doctor info to the request object for use in subsequent middleware/routes
        req.doctor = doctor;
        next();
    } catch (error) {
        console.error("Doctor Authentication error:", error);
        res.status(401).json({
            success: false,
            message: "Doctor Unauthorized, invalid token or missing token or token expired"
        });
    }
}