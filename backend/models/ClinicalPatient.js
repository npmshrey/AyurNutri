// backend/models/ClinicalPatient.js
import mongoose from "mongoose";

const { Schema } = mongoose;

/**
 * Single meal item stored inside a WeeklyDay.
 * - food: free-form full food object (can be library item or lightweight object)
 * - label: optional display label
 * - grams: doctor's assigned grams for this item (optional)
 * - consumedGrams: patient's entered eaten grams (optional)
 * - checked: whether patient marked it completed
 */
const MealItemSchema = new Schema(
  {
    food: { type: Schema.Types.Mixed },
    label: { type: String },
    grams: { type: Number }, // doctor's assigned grams
    consumedGrams: { type: Number }, // patient's entered grams
    checked: { type: Boolean, default: false },
  },
  { _id: false }
);

/**
 * Exercise item schema used in a day
 */
const ExerciseSchema = new Schema(
  {
    name: { type: String, required: true },
    reps: { type: String },
    durationMinutes: { type: Number },
    checked: { type: Boolean, default: false },
  },
  { _id: false }
);

/**
 * One day inside a WeeklyPlan (used by doctor-created plans)
 * meals: each meal is an array of MealItemSchema
 * date: optional (may be null if plan uses relative days)
 */
const WeeklyDaySchema = new Schema(
  {
    date: { type: Date }, // not strictly required — doctor may create relative days
    meals: {
      breakfast: { type: [MealItemSchema], default: [] },
      lunch: { type: [MealItemSchema], default: [] },
      dinner: { type: [MealItemSchema], default: [] },
    },
    exercises: { type: [ExerciseSchema], default: [] },
  },
  { _id: false }
);

/**
 * Whole weekly plan schema
 */
const WeeklyPlanSchema = new Schema(
  {
    title: { type: String, required: true },
    weekStartDate: { type: Date, required: true },
    doctorId: { type: Schema.Types.ObjectId, ref: "Doctor", required: true },
    durationDays: { type: Number, default: 7 },
    days: { type: [WeeklyDaySchema], default: [] },
    progressPercent: { type: Number, default: 0 },
  },
  { timestamps: true }
);

/**
 * Main ClinicalPatient schema
 * - doctorId: reference to Doctor
 * - patientAccountId: reference to auth patient model (use actual model name you have; adjust if different)
 * - dietPlan: doctor-facing saved diet (separate from weeklyPlans)
 * - weeklyPlans: array of WeeklyPlanSchema
 */
const ClinicalPatientSchema = new Schema(
  {
    doctorId: { type: Schema.Types.ObjectId, ref: "Doctor", required: true },
    patientAccountId: {
      type: Schema.Types.ObjectId,
      ref: "Patient", // the account a patient actually signs up and logs in with
      required: true,
    },

    name: { type: String, required: true },
    age: { type: Number },
    dosha: { type: String },
    condition: { type: String },
    status: { type: String, default: "new" },
    lastVisit: { type: Date },
    nextAppointment: { type: Date },
    progress: { type: Number, default: 0 },

    // health profile
    heightCm: { type: Number },
    weightKg: { type: Number },
    bmi: { type: Number },
    bloodPressure: { type: String },
    heartRate: { type: Number },
    allergies: { type: String },
    medications: { type: String },
    chronicConditions: { type: String },
    lifestyleNotes: { type: String },
    dietPreferences: { type: String },

    // main diet plan (doctor's quick dietPlan snapshot)
    dietPlan: {
      breakfast: { type: [Schema.Types.Mixed], default: [] },
      lunch: { type: [Schema.Types.Mixed], default: [] },
      dinner: { type: [Schema.Types.Mixed], default: [] },
      updatedAt: { type: Date },
    },

    // clinical reports
    clinicalReports: [
      {
        doctorId: { type: Schema.Types.ObjectId, ref: "Doctor" },
        title: { type: String },
        summary: { type: String },
        diagnosis: { type: String },
        notes: { type: String },
        testsRecommended: { type: String },
        plan: { type: String },
        followUpDate: { type: Date },
        createdAt: { type: Date, default: Date.now },
      },
    ],

    // weekly plans created by doctor
    weeklyPlans: { type: [WeeklyPlanSchema], default: [] },

    // medical documents the patient uploads (routes/patientReports.js)
    reportFiles: {
      type: [
        {
          originalName: { type: String },
          fileName: { type: String },
          mimeType: { type: String },
          url: { type: String },
          uploadedAt: { type: Date, default: Date.now },
        },
      ],
      default: [],
    },
  },
  { timestamps: true }
);

const ClinicalPatient = mongoose.model(
  "ClinicalPatient",
  ClinicalPatientSchema
);

export default ClinicalPatient;
