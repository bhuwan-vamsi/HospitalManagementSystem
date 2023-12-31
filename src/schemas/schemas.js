const mongoose = require('mongoose');

// Define Doctor Schema
const doctorSchema = new mongoose.Schema({
  doctorId: { type: String, required: true },
  name: { type: String, required: true },
  specialization: { type: String, required: true },
  contactInfo: { type: String, required: true },
  password: { type: String, required: true },
});

// Define Patient Schema
const patientSchema = new mongoose.Schema({
  patientId: { type: String, required: true },
  name: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  contactInfo: { type: String, required: true },
});

// Define Appointment Schema
const appointmentSchema = new mongoose.Schema({
  appointmentId: { type: String, required: true },
  patientId: { type: String, required: true },
  doctorId: { type: String, required: true },
  date: { type: Date, required: true },
  time: { type: String, required: true },
});

// Define Records Schema
const recordsSchema = new mongoose.Schema({
  recordId: { type: String, required: true },
  patientId: { type: String, required: true },
  doctorId: { type: String, required: true },
  diagnosis: { type: String, required: true },
  medications: { type: String, required: true },
  testResults: { type: String, required: true },
});

// Create models from the schemas
const Doctor = mongoose.model('Doctor', doctorSchema);
const Patient = mongoose.model('Patient', patientSchema);
const Appointment = mongoose.model('Appointment', appointmentSchema);
const Records = mongoose.model('Records', recordsSchema);

module.exports = {
  Doctor,
  Patient,
  Appointment,
  Records,
};
