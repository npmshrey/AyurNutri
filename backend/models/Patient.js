const mongoose = require('mongoose');

const PatientSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    age: { type: Number },
    dosha: { type: String },
    condition: { type: String },
    status: { type: String, default: 'new' },
    lastVisit: { type: Date, default: null },
    nextAppointment: { type: Date, default: null },
    progress: { type: Number, default: 0 }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Patient', PatientSchema);
