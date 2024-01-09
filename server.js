const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const { format } = require('date-fns');
const app = express();
const port = 5000;
const { Doctor, Patient, Appointment, Record } = require('./src/schemas/schemas.js');

app.use(bodyParser.json());
app.use(cors());

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

async function connectToMongoDB() {
  try {
    await mongoose.connect('mongodb+srv://somaramsoujanya:Soujanya%40123@cluster0.ldrxmqy.mongodb.net/test');
    console.log('Connected to Database');
  } catch (err) {
    console.log('Error connecting to database');
    console.error(err);
  }
}

// Connect to MongoDB when the server starts
connectToMongoDB();

// Endpoint to handle doctor login
app.post('/doctor-login', async (req, res) => {
  const { doctor_id, password } = req.body;
  try {
    // Query the Doctor collection for the provided email and password
    const doctor = await Doctor.findOne({ doctor_id, password });
    if (doctor) {
      res.status(200).json({ success: true, message: 'Doctor login successful' });
    } else {
      res.status(401).json({ success: false, message: 'Invalid credentials' });
    }
  } catch (error) {
    console.error('Error during doctor login:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

// Endpoint to handle patient login
app.post('/patient-login', async (req, res) => {
  const { patientEmail, password } = req.body;
  const email = patientEmail;
  try {
    // Query the Patient collection for the provided email and password
    const patient = await Patient.findOne({ email, password });
    if (patient) {
      res.status(200).json({ success: true, message: 'Patient login successful' });
    } else {
      res.status(401).json({ success: false, message: 'Invalid credentials' });
    }
  } catch (error) {
    console.error('Error during patient login:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

// Endpoint to handle patient registration
app.post('/patient-register', async (req, res) => {
  const { name, patientEmail, password } = req.body;
  const email = patientEmail;
  try {
    // Check if a patient with the provided email already exists
    const existingPatient = await Patient.findOne({ email });
    if (existingPatient) {
      res.status(409).json({ success: false, message: 'Patient already registered with this email' });
    } else {
      // Create a new patient in the database
      const newPatient = await Patient.create({ name, email, password });
      res.status(200).json({ success: true, message: 'Patient registration successful', data: newPatient });
    }
  } catch (error) {
    console.error('Error during patient registration:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

app.post('/doctor-data', async (req, res) => {
  const { doctorEmail } = req.body;

  try {
    const apps = await Appointment.find({ doctorEmail });
    const allRecords = await Record.find({ doctorEmail });
    const appointments = [];
    const doctorRecords = [];
    // Categorize appointments into todayApps and laterApps
    apps.forEach((appointment) => {
      appointments.push(appointment);
    });
    // Sorting appointments by time
    appointments.sort((a, b) => (a.date === b.date ? a.time > b.time ? 1 : -1 : a.date > b.date ? 1 : -1));
    // Categorize requests
    allRecords.forEach((record) => {
      doctorRecords.push(record);
    });
    // Sorting requests by time
    doctorRecords.sort((a, b) => (a.date === b.date ? a.time > b.time ? 1 : -1 : a.date > b.date ? 1 : -1));
    res.status(200).json({ apps: appointments, records: doctorRecords });
  } catch (error) {
    console.error('Error fetching doctor\'s appointments:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/patient-data', async (req, res) => {
  const { patientEmail } = req.body;
  try {
    // Fetch appointments from the database using the patient's email
    const patientAppointments = await Appointment.find({ patientEmail });
    const patientRecords = await Record.find({ patientEmail });
    res.status(200).json({appointments: patientAppointments, records: patientRecords});
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
});

app.post('/book-appointment', async (req, res) => {
  const { patientEmail, doctor, appointmentDate } = req.body;
  try {

    const firstName = doctor.split(' ')[1];
    const doctorEmail = `${firstName.toLowerCase()}@gmail.com`;

    // Create a new appointment
    const newBookedAppointment = {
      patientEmail: patientEmail,
      doctorEmail: doctorEmail,
      appointmentDate: appointmentDate,
    };
    await Appointment.create(newBookedAppointment);
    res.status(200).json({ success: true, message: 'Appointment booked successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
});

app.post('/record', async (req, res) => {
  const recordData = req.body.formData;
  const appointmentData = req.body.selectedAppointment;
  try {
    // Create a new record in the database
    const newRecord = await Record.create(recordData);
    // Assuming appointmentData contains the necessary information to identify the appointment
    // Remove the particular appointment from the Appointments collection
    await Appointment.deleteOne(appointmentData);

    res.status(200).json({ success: true, message: 'Record submitted successfully', data: newRecord });
  } catch (error) {
    console.error('Error submitting record:', error);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
});



































// // Registering a new doctor
// async function registerDoctor(doctorData) {
//   try {
//     // Create a new doctor in the database
//     const newDoctor = await Doctor.create(doctorData);
//     console.log('Doctor registration successful:', newDoctor);
//   } catch (error) {
//     console.error('Error during doctor registration:', error);
//   }
// }

// const doctorRegistrationData = {
//   name: 'Dr. Bhuwan',
//   email: 'bhuwan@gmail.com',
//   specialization: 'Cardiologist',
//   password: 'bhuwan',
// };

// registerDoctor(doctorRegistrationData);