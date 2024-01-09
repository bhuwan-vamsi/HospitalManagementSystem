import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function ForgotPassword() {
  const [email, setEmail] = useState('');
  const navigate = useNavigate();

  const handleReset = async (userData) => {
    try {
      const response = await fetch('http://localhost:5000/forgot-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(userData)
      });
      if (response.ok) {
        navigate('/');
      } else {
        alert('Email not found');
      }
    } catch (error) {
      console.error(error);
      alert('ERROR');
    }
};
  
const handleSubmit = (e) => {
    e.preventDefault();
    const userData = { email};
    handleReset(userData);
};

    return (
        <div className="body">
            <div className="form-container sign-in-container">
            <form onSubmit={handleSubmit}>
                <h1>ENTER EMAIL</h1>
                <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
                <button type="submit" className="signIn">SUBMIT</button>
            </form>
            </div>
        </div>
    );
}

export default ForgotPassword;
