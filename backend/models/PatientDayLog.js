// backend/models/PatientDayLog.js
import mongoose from "mongoose";

const MealLogSchema = new mongoose.Schema(
  {
    status: {
      type: String,
      enum: ["completed", "skipped", "partial", "overate"],
      default: "completed",
    },
    plannedItems: [String], // optional: names/ids of planned foods
    actualItems: [String],  // optional: free-text or selected foods
  },
  { _id: false }
);

const PatientDayLogSchema = new mongoose.Schema(
  {
    patientId: { type: mongoose.Schema.Types.ObjectId, ref: "Patient" },
    clinicalPatientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ClinicalPatient",
    },
    weekPlanId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "WeekPlan", // or whatever your weekly plan model is called
      required: true,
    },

    date: { type: Date, required: true },
    dayIndex: { type: Number, required: true }, // 0..6 or similar

    meals: {
      breakfast: { type: MealLogSchema, default: () => ({}) },
      lunch: { type: MealLogSchema, default: () => ({}) },
      dinner: { type: MealLogSchema, default: () => ({}) },
    },

    exercise: {
      status: {
        type: String,
        enum: ["completed", "skipped", "partial", "none"],
        default: "none",
      },
      notes: String,
    },

    notes: String,
  },
  { timestamps: true }
);

const PatientDayLog = mongoose.model("PatientDayLog", PatientDayLogSchema);

export default PatientDayLog;
