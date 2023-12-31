const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');


const app = express();
const port = 5000;

app.use(bodyParser.json());
app.use(cors());

mongoose.connect('mongodb://127.0.0.1:27017/ank_hospitals', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const doctorCredentials = {
  email: 'doctor@gmail.com',
  username: 'doctor1',
  password: 'doctorpassword',
};

const patientCredentials = {
  email: 'patient@gmail.com',
  username: 'patient1',
  password: 'patientpassword',
};

app.post('/doctor-login', (req, res) => {
  const { email, password } = req.body;
  if (email === doctorCredentials.email && password === doctorCredentials.password) {
    res.status(200).json({ success: true, message: 'Doctor login successful' });
  } else {
    res.status(401).json({ success: false, message: 'Invalid credentials' });
  }
});

app.post('/patient-login', (req, res) => {
  const { email, password } = req.body;
  if (email === patientCredentials.email && password === patientCredentials.password) {
    res.status(200).json({ success: true, message: 'Patient login successful' });
  } else {
    res.status(401).json({ success: false, message: 'Invalid credentials' });
  }
});

app.post('/patient-register', (req, res) => {
  const { email, name, password } = req.body;
  res.status(200).json({ success: true, message: 'Patient login successful' });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
