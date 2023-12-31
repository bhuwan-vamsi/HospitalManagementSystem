import { Link } from 'react-router-dom';
import React from 'react';

function Home() {
  return (
    <div>
      <h1>ANK HOSPITALS</h1>
      <p>Welcome to ANK Hospitals. Please choose an option:</p>
      <div>
        <Link to="/doctor-login">Doctor Login</Link>
      </div>
      <div>
        <Link to="/patient-login">Patient Login</Link>
      </div>
    </div>
  )
}

export default Home;