import mongoose from "mongoose";

const FoodItemSchema = new mongoose.Schema(
  {
    name: String,
    food: {
      type: Object, // store raw food object from data.json
    },
    checked: { type: Boolean, default: false },
  },
  { _id: false }
);

const ExerciseSchema = new mongoose.Schema(
  {
    name: String,
    reps: Number,
    durationMinutes: Number,
    checked: { type: Boolean, default: false },
  },
  { _id: false }
);

const DaySchema = new mongoose.Schema(
  {
    date: Date,
    meals: {
      breakfast: { type: [FoodItemSchema], default: [] },
      lunch: { type: [FoodItemSchema], default: [] },
      dinner: { type: [FoodItemSchema], default: [] },
    },
    exercises: { type: [ExerciseSchema], default: [] },
  },
  { _id: false }
);

const WeekPlanSchema = new mongoose.Schema(
  {
    patientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Patient",
      required: true,
    },
    clinicalPatientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ClinicalPatient",
      required: true,
    },

    title: { type: String, default: "Weekly Diet & Exercise Plan" },
    weekStartDate: { type: Date, required: true },

    days: { type: [DaySchema], default: [] },

    progressPercent: { type: Number, default: 0 },
  },
  { timestamps: true }
);

const WeekPlan = mongoose.model("WeekPlan", WeekPlanSchema);

export default WeekPlan;
