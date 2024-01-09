import React, { useState } from "react";
import "../css/Login.css";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

function PatientLogin() {
  const [name, setName] = useState('');
  const [patientEmail, setPatientEmail] = useState('');
  const [password, setPassword] = useState('');

  const navigate = useNavigate();

  const handleRegister = async (userData) => {
    const response = await fetch('http://localhost:5000/patient-register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(userData)
    });
    if (response.ok) {
      localStorage.setItem('patientEmail', patientEmail);
      alert('Registered successfully');
      navigate('/patient-home');
    } else {
      alert('Registration failed');
    }
  };

  const handleLogin = async (userData) => {
    const response = await fetch('http://localhost:5000/patient-login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(userData)
    });

    if (response.ok) {
      navigate('/patient-home');
      localStorage.setItem('patientEmail', patientEmail);
      alert('Logged in successfully')
    } else {
      alert('Signin failed');
    }
  };

  const [isRightPanelActive, setRightPanelActive] = useState(false);
    function handleSignUp() {
        setRightPanelActive(true);
    }
    function handleSignIn() {
        setRightPanelActive(false);
    }

    const handleRegisterSubmit = (e) => {
      e.preventDefault();
      const userData = { name, patientEmail, password };
      handleRegister(userData);
    };
  
    const handleLoginSubmit = (e) => {
      e.preventDefault();
      const userData = { patientEmail, password };
      handleLogin(userData);
    };

  return (
    <div className="body">
      <div className={`container ${isRightPanelActive ? 'right-panel-active' : ''}`} id="container">
        <div className="form-container sign-up-container">
          <form onSubmit={handleRegisterSubmit}>
            <h1>Create Account</h1>
            <input type="text" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} />
            <input type="email" placeholder="Email" value={patientEmail} onChange={(e) => setPatientEmail(e.target.value)} />
            <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
            <button type="submit" className="signUp">Sign Up</button>
          </form>
        </div>
        <div className="form-container sign-in-container">
          <form onSubmit={handleLoginSubmit}>
            <h1>Sign In</h1>
            <input type="email" placeholder="Email" value={patientEmail} onChange={(e) => setPatientEmail(e.target.value)} />
            <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
            <Link to="/forgotpassword">Forgot your password?</Link>
            <button type="submit" className="signIn">Sign In</button>
          </form>
        </div>
        <div className="overlay-container">
          <div className="overlay">
            <div className="overlay-panel overlay-left">
              <h1>Welcome Back!</h1>
              <p>To keep connected with us please login with your personal info</p>
              <button className="ghost" id="signIn" onClick={handleSignIn}>Sign In</button>
            </div>
            <div className="overlay-panel overlay-right">
              <h1>Hello, Friend!</h1>
              <p>Enter your personal details and start journey with us</p>
              <button className="ghost" id="signUp" onClick={handleSignUp}>Sign Up</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PatientLogin;