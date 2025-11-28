import mongoose from "mongoose";

const DoctorSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phoneNumber: { type: String, unique: true, sparse: true },
    gender: { type: String },
    passwordHash: { type: String, required: true },
  },
  { timestamps: true }
);

const Doctor =
  mongoose.models.Doctor || mongoose.model("Doctor", DoctorSchema);

export default Doctor;
