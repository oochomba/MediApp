import Doctor from "../models/Doctor.js";
import { uploadToCloudinary, deleteFromCloudinary } from "../utils/cloudinary.js";
import jwt from "jsonwebtoken";
//helper functions
// Helper function to convert time string (e.g., "2:30 PM") to minutes since midnight
const parseTimeToMinutes = (t = "") => {
    const [time = "0:00", ampm = ""] = (t || "").split(" ");
    const [hh = 0, mm = 0] = time.split(":").map(Number);
    let h = hh % 12;
    if ((ampm || "").toUpperCase() === "PM") h += 12;
    return h * 60 + (mm || 0);
};
// Helper function to deduplicate and sort schedule slots for each date
function dedupeAndSortSchedule(schedule = {}) {
    const out = {};
    Object.entries(schedule).forEach(([date, slots]) => {
        if (!Array.isArray(slots)) return;
        const uniq = Array.from(new Set(slots));
        uniq.sort((a, b) => parseTimeToMinutes(a) - parseTimeToMinutes(b));
        out[date] = uniq;
    });
    return out;
}
// Helper function to parse schedule input, which can be a JSON string or an object
function parseScheduleInput(s) {
    if (!s) return {};
    if (typeof s === "string") {
        try {
            s = JSON.parse(s);
        } catch {
            return {};
        }
    }
    return dedupeAndSortSchedule(s || {});
}
// Helper function to normalize doctor document for client response
function normalizeDocForClient(raw = {}) {
    const doc = { ...raw };

    // convert Mongoose Map to plain object
    if (doc.schedule && typeof doc.schedule.forEach === "function") {
        const obj = {};
        doc.schedule.forEach((val, key) => {
            obj[key] = Array.isArray(val) ? val : [];
        });
        doc.schedule = obj;
    } else if (!doc.schedule || typeof doc.schedule !== "object") {
        doc.schedule = {};
    }

    doc.availability = doc.availability === undefined ? "Available" : doc.availability;
    doc.patients = doc.patients ?? "";
    doc.rating = doc.rating ?? 0;
    doc.fee = doc.fee ?? doc.fees ?? 0;

    return doc;
}





// Controller function to create a new doctor
export const createDoctor = async (req, res) => {
    try {
        const body = req.body || {};
        if (!body.email || !body.password || !body.name) {
            return res.status(400).json({
                success: false,
                message: "Email, password, and name are required."
            });
        }
        const emailLC = (body.email || "").toLowerCase();
        const existingDoctor = await Doctor.findOne({ email: emailLC });
        if (existingDoctor) {
            return res.status(400).json({
                success: false,
                message: "Doctor with this email already exists."
            });
        }
        let imageUrl = body.imageUrl || null;
        let imagePublicId = body.imagePublicId || null;
        if (req.file?.path) {
            const uploaded = await uploadToCloudinary(req.file.path, "doctors");
            imageUrl = uploaded?.secure_url || uploaded?.url || imageUrl;
            imagePublicId = uploaded?.public_id || uploaded?.publicId || imagePublicId;
        }
        const schedule = parseScheduleInput(body.schedule);


        const doctor = new Doctor({
            email: emailLC,
            password: body.password,
            name: body.name,
            specialization: body.specialization || "",
            imageUrl,
            imagePublicId,
            availability: body.availability || "Available",
            experience: body.experience || "",
            qualifications: body.qualifications || "",
            location: body.location || "",
            about: body.about || "",
            fee: body.fee !== undefined ? Number(body.fee) : 0,
            schedule,
            success: body.success || "",
            patients: body.patients || "",
            rating: body.rating !== undefined ? Number(body.rating) : 0,
        });
        await doctor.save();
        const secret = process.env.JWT_SECRET;
        if (!secret) {
            return res.status(500).json({
                success: false,
                message: "Server configuration error."
            });
        }
        const token = jwt.sign({
            id: doctor._id.toString(),
            email: doctor.email
        }, secret, { expiresIn: "7d" });
        const out = normalizeDocForClient(doctor.toObject());
        delete out.password;

        res.status(201).json({
            success: true,
            message: "Doctor created successfully.",
            data: out,
            token
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
};

export const getDoctors = async (req, res) => {
    try {
        const doctors = await Doctor.find();
        res.status(200).json(doctors);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};
