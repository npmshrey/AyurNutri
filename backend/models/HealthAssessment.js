import mongoose from "mongoose";

const healthAssessmentSchema = new mongoose.Schema(
  {
    patientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Can be User or Patient depending on the system auth
      required: true,
    },
    answers: {
      type: Array,
      required: true,
    },
    result: {
      vata: { type: Number, required: true },
      pitta: { type: Number, required: true },
      kapha: { type: Number, required: true },
      primaryDosha: { type: String, required: true },
    },
  },
  { timestamps: true }
);

export default mongoose.model("HealthAssessment", healthAssessmentSchema);
