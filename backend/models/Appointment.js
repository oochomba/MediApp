import mongoose from "mongoose";
const appointmentSchema = new mongoose.Schema(
  {
    owner: {type:String, required:true,index:true}, 
    createdBy: {type:String, default:null, required:true}, 
    
    doctor: {  
        type: mongoose.Schema.Types.ObjectId,
        ref: "Doctor",
        required: true,
    },
    service: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Service",
        required: true,

    },
    date: { type: String, required: true },
    time: { type: String, required: true },
    patientName: { type: String, required: true },
    patientEmail: { type: String, required: true },
    patientPhone: { type: String, required: true },
    status: { type: String, enum: ["scheduled", "completed", "canceled"], default: "scheduled" },
  },
  { timestamps: true },
);
const Appointment = mongoose.models.Appointment || mongoose.model("Appointment", appointmentSchema);
export default Appointment;
