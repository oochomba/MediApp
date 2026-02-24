import express from "express";
import multer from "multer";
import { createDoctor, getDoctors, loginDoctor,getDoctorById,updateDoctor, toggleAvailability, deleteDoctor } from "../controllers/doctorController.js";
import doctorAuth from "../middlewares/doctorAuth.js";      


//Multer configuration for file uploads
const upload = multer({ dest: "temp/" });


const doctorRouter=express.Router();

// Route to get all doctors (for testing purposes, can be removed in production)
doctorRouter.get("/", getDoctors);
doctorRouter.post("/login", loginDoctor);

doctorRouter.post("/login", upload.single("image"), createDoctor);

doctorRouter.get("/:id", getDoctorById);
doctorRouter.post("/", upload.single("image"), createDoctor); // This route can be used for updating doctor info, but it's better to use PUT for updates and POST for creation. Consider changing this to PUT and ensuring it doesn't create a new doctor if the ID already exists.

//after login, we can use doctorAuth middleware to protect routes that require authentication
doctorRouter.put("/:id", doctorAuth, upload.single("image"), updateDoctor);
doctorRouter.post("/:id/toggle-availability", doctorAuth, toggleAvailability);
doctorRouter.delete("/:id", deleteDoctor); 

export default doctorRouter;