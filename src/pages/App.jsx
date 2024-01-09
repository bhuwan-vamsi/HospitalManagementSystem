import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Home from './Home';
import DoctorLogin from './DoctorLogin';
import PatientLogin from './PatientLogin';
import DoctorHome from './DoctorHome';
import PatientHome from './PatientHome';
import ForgotPassword from './ForgotPassword';

function App() {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Home/>} />
        <Route path="/doctor-login" element={<DoctorLogin/>} />
        <Route path="/patient-login" element={<PatientLogin/>} />
        <Route path="/doctor-home" element={<DoctorHome/>} />
        <Route path="/patient-home" element={<PatientHome/>} />
        <Route path="/forgot-password" element={<ForgotPassword/>}/>
      </Routes>
    </div>
  );
}

export default App;
