import React, { useState } from "react";
import "../css/Login.css";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

function DoctorLogin() {
  const [doctorEmail, setDoctorEmail] = useState('');
  const [password, setPassword] = useState('');

  const navigate = useNavigate();

  const handleLogin = async (userData) => {
    const response = await fetch('http://localhost:5000/doctor-login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(userData)
    });
    if (response.ok) {
      navigate('/doctor-home');
      alert('Logged in successfully')
      localStorage.setItem('doctorEmail', doctorEmail);
    } else {
      alert('Signin failed');
    }
  };

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    const userData = { doctorEmail, password };
    handleLogin(userData);
  };

  return (
    <div className="body">
      <div className="container" id="container">
        <div className="form-container sign-in-container">
          <h1>Doctor Login</h1>
          <form onSubmit={handleLoginSubmit}>
            <input type="email" placeholder="Email" value={doctorEmail} onChange={(e) => setDoctorEmail(e.target.value)} />
            <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
            <Link to="/forgotpassword">Forgot your password?</Link>
            <button type="submit" className="signIn">Sign In</button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default DoctorLogin;
