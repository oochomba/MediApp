import Appointment  from "../models/Appointment";

//create appointment
export async function createAppointment(req, res) {
  try {
    const { doctor, service, date, time, patientName, patientEmail, patientPhone } = req.body;
    const owner = req.auth.userId; // Assuming Clerk middleware sets req.auth.userId
    const createdBy = req.auth.userId; // The user creating the appointment is also the owner
    const newAppointment = new Appointment({
        owner,
        createdBy,
        doctor,
        service,
        date,
        time,
        patientName,
        patientEmail,
        patientPhone,
    });
    await newAppointment.save();    
    res.status(201).json({
      success: true,
      message: "Appointment created successfully",
      appointment: newAppointment,
    });
  }
    catch (error) {
    console.error("Error creating appointment:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create appointment",
      error: error.message,
    });
  }
}

//get appointments for a user
export async function getAppointments(req, res) {
  try {
    const userId = req.auth.userId; // Assuming Clerk middleware sets req.auth.userId
    const appointments = await Appointment.find({ owner: userId })

    res.status(200).json({
        success: true,
        data: appointments,
    });
  }
    catch (error) {
    console.error("Error fetching appointments:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch appointments",
      error: error.message,
    });
  }
}

//get appointment by id
export async function getAppointmentById(req, res) {
  try {
    const { id } = req.params;
    const appointment = await Appointment
        .find
        .findById(id)
        .populate("doctor", "name specialization") // Populate doctor name and specialization
        .populate("service", "name description price");



    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: "Appointment not found",
      });
    }
    res.status(200).json({
      success: true,
      data: appointment,
    });
  } catch (error) {
    console.error("Error fetching appointment by ID:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch appointment",
      error: error.message,
    });
  }
}

//update appointment status
export async function updateAppointmentStatus(req, res) {
  try {
    const { id } = req.params;  
    const { status } = req.body; // Expecting status in the request body
    const validStatuses = ["scheduled", "completed", "canceled"];


    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid status value",
      });
    }
    const appointment = await Appointment.findById(id);
    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: "Appointment not found",
      });
    }
    appointment.status = status;
    await appointment.save();
    res.status(200).json({
      success: true,
      message: "Appointment status updated successfully",
      data: appointment,
    });
  }
    catch (error) {
    console.error("Error updating appointment status:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update appointment status",
      error: error.message,
    });
  }
}

