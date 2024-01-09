const mongoose = require('mongoose');
const DoctorsData = require('./src/pages/DoctorsData');

const doctorSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  specialization: { type: String, required: true },
  password: { type: String, required: true },
});

const {Doctor} = require('./src/schemas/schemas');

async function connectToMongoDB() {
  try {
    await mongoose.connect('mongodb+srv://somaramsoujanya:Soujanya%40123@cluster0.ldrxmqy.mongodb.net/test', { useNewUrlParser: true, useUnifiedTopology: true });
    console.log('Connected to Database');
  } catch (err) {
    console.log('Error connecting to the database');
    console.error(err);
  }
}

// Function to save doctors' data to MongoDB
async function saveDoctorsDataToMongoDB() {
  try {
    // Iterate through each specialization
    for (const [specialization, doctors] of Object.entries(DoctorsData)) {
      // Iterate through each doctor in the specialization
      for (const doctorName of doctors) {
        const firstName = doctorName.split(' ')[1];
        const email = `${firstName.toLowerCase()}@gmail.com`;

        // Create a new document
        const newDoctor = new Doctor({
          name: doctorName,
          email: email,
          specialization: specialization,
          password: firstName,
        });

        // Save the document to the database
        await newDoctor.save();
      }
    }

    console.log('Doctor documents successfully saved to MongoDB.');
  } catch (error) {
    console.error('Error saving doctor documents to MongoDB:', error);
  }
}

// Connect to MongoDB when the file is executed
connectToMongoDB();

// Save doctors' data to MongoDB when the file is executed
saveDoctorsDataToMongoDB();
