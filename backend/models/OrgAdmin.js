import mongoose from "mongoose";

const OrgAdminSchema = new mongoose.Schema(
  {
    organisationName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true }, // hashed
    role: { type: String, default: "org-admin" }
  },
  { timestamps: true }
);

export default mongoose.model("OrgAdmin", OrgAdminSchema);