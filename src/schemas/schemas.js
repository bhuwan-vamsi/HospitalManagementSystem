const mongoose = require('mongoose');

// Define Doctor Schema
const doctorSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true},
  specialization: { type: String, required: true },
  password: { type: String, required: true },
});

// Define Patient Schema
const patientSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
});

// Define Appointment Schema
const appointmentSchema = new mongoose.Schema({
  patientEmail: { type: String, required: true },
  doctorEmail: { type: String, required: true },
  appointmentDate: { type: Date, required: true },
});

// Define Records Schema
const recordSchema = new mongoose.Schema({
  patientEmail: { type: String, required: true },
  doctorEmail: { type: String, required: true },
  diagnosis: { type: String, required: true },
  medications: { type: String, required: true },
});

// Create models from the schemas
const Doctor = mongoose.model('Doctor', doctorSchema);
const Patient = mongoose.model('Patient', patientSchema);
const Appointment = mongoose.model('Appointment', appointmentSchema);
const Record = mongoose.model('Record', recordSchema);

module.exports = {
  Doctor,
  Patient,
  Appointment,
  Record,
};
