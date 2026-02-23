import express from "express";
import multer from "multer";
import { createDoctor, loginDoctor } from "../controllers/doctorController.js";
import doctorAuth from "../middlewares/doctorAuth.js";      


//Multer configuration for file uploads
const upload = multer({ dest: "temp/" });

doctorRouter=express.Router();

// Route to get all doctors (for testing purposes, can be removed in production)
doctorRouter.get("/", getDoctors);
doctorRouter.get("/search", searchDoctors);
doctorRouter.get("/login", loginDoctor);

// Route to create a new doctor (registration)
doctorRouter.get("/:id", getDoctorById);
doctorRouter.post("/login", upload.single("image"), createDoctor);

//after login, we can use doctorAuth middleware to protect routes that require authentication
doctorRouter.put("/:id", doctorAuth, upload.single("image"), updateDoctor);
doctorRouter.post("/:id/toggle-availability", doctorAuth, toggleAvailability);
doctorRouter.delete("/:id", deleteDoctor); 

export default doctorRouter;