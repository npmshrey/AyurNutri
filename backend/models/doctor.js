import mongoose from "mongoose";

const DoctorSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phoneNumber: { type: String, unique: true, sparse: true },
    gender: { type: String },

    // For password storage
    passwordHash: { type: String, required: true },

    // Doctor Verification Fields
    reg_no: { type: String, required: true },                // Registration Number
    council: { type: String, required: true },               // Medical Council
    verified: { type: Boolean, default: false },             // Verified by our IMR database

    // Organisation-admin approval workflow (routes/orgAdmin.js). These are
    // separate from `verified` above on purpose: a doctor can self-verify
    // and log in immediately (current signup flow), while still showing up
    // in an organisation's pending-approval list if they belong to one.
    organisationName: { type: String },
    approvalStatus: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
    isApproved: { type: Boolean, default: false },
    approvedBy: { type: mongoose.Schema.Types.ObjectId, ref: "OrgAdmin" },
    approvalDate: { type: Date },

    // Forgot-password flow (routes/auth.js)
    resetTokenHash: { type: String, select: false },
    resetTokenExpires: { type: Date, select: false },
  },
  { timestamps: true }
);

const Doctor =
  mongoose.models.Doctor || mongoose.model("Doctor", DoctorSchema);

export default Doctor;
