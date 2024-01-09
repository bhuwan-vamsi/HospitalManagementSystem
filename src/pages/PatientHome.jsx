import React, { useState, useEffect } from 'react';
import '../css/PatientHome.css';
import { useNavigate } from 'react-router-dom';
import Categories from './Categories';
import DoctorsData from './DoctorsData';

function PatientHome() {
  const [selectedMenuItem, setSelectedMenuItem] = useState('Home');
  const [currentTime, setCurrentTime] = useState('');
  const [currentDate, setCurrentDate] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedDoctor, setSelectedDoctor] = useState('');
  const [appointmentDate, setAppointmentDate] = useState('');
  const [appointments, setAppointments] = useState([]);
  const [records, setRecords] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const updateCurrentTime = () => {
      const now = new Date();
      const day = now.getDate().toString().padStart(2, '0');
      const month = (now.getMonth() + 1).toString().padStart(2, '0');
      const year = now.getFullYear();

      const hours = now.getHours().toString().padStart(2, '0');
      const minutes = now.getMinutes().toString().padStart(2, '0');
      const seconds = now.getSeconds().toString().padStart(2, '0');
      const formattedDate = `${day}/${month}/${year}`;
      const formattedTime = `${hours}:${minutes}:${seconds}`;
      setCurrentTime(formattedTime);
      setCurrentDate(formattedDate);
    };

    updateCurrentTime();
    const intervalId = setInterval(updateCurrentTime, 1000);
    fetchAppointments(); // Call fetchAppointments when the component mounts
    return () => clearInterval(intervalId);
  }, []);

  const findDoctorCategory = (doctorName) => {
    for (const category in DoctorsData) {
      if (DoctorsData[category].includes(doctorName)) {
        return category;
      }
    }
    return 'Unknown Category';
  };

  const fetchAppointments = async () => {
    try {
      const patientEmail = localStorage.getItem('patientEmail');

      if (!patientEmail) {
        alert('Patient email not found. Please log in.');
        navigate('/patient-login');
        return;
      }

      const response = await fetch('http://localhost:5000/patient-data', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ patientEmail }),
      });

      if (response.ok) {
        const {appointments, records} = await response.json();
        setAppointments(appointments);
        setRecords(records);
        console.log(appointments);
      } else {
        alert('Failed to fetch appointments. Please try again.');
      }
    } catch (error) {
      console.error(error);
      alert('Internal Server Error. Please try again later.');
    }
  };

  const handleCategoryChange = (event) => {
    setSelectedCategory(event.target.value);
    setSelectedDoctor('');
    setAppointmentDate('');
  };

  const handleDoctorChange = (event) => {
    setSelectedDoctor(event.target.value);
  };

  const handleDateChange = (event) => {
    setAppointmentDate(event.target.value);
  };

  const capitalizeFirstLetter = (name) => {
    return name.charAt(0).toUpperCase() + name.slice(1);
  };

  const handleAppointmentSubmit = async (event) => {
    event.preventDefault();

    if (!selectedCategory || !selectedDoctor || !appointmentDate) {
      alert('Please fill in all fields');
      return;
    }

    const patientEmail = localStorage.getItem('patientEmail');

    if (!patientEmail) {
      alert('Patient email not found. Please log in.');
      navigate('/patient-login');
      return;
    }

    const appointmentData = {
      patientEmail: patientEmail,
      doctor: selectedDoctor,
      appointmentDate: appointmentDate,
    };

    try {
      const response = await fetch('http://localhost:5000/book-appointment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(appointmentData),
      });

      if (response.ok) {
        const result = await response.json();
        alert(result.message);
        fetchAppointments(); // Fetch updated appointments after booking
      } else {
        alert('Failed to book the appointment. Please try again.');
      }
    } catch (error) {
      console.error(error);
      alert('Internal Server Error. Please try again later.');
    }
  };

  const handleMenuClick = (menuItem) => {
    if (menuItem === 'Logout') {
      navigate('/');
    } else if (menuItem === 'Home') {
      setSelectedMenuItem(menuItem);
      fetchAppointments();
    } else {
      setSelectedMenuItem(menuItem);
    }
  };

  return (
    <div className="PatientHome">
      <div className="leftMenu">
        <button onClick={() => handleMenuClick('Home')}>Home</button>
        <button onClick={() => handleMenuClick('Book an Appointment')}>Book an Appointment</button>
        <button onClick={() => handleMenuClick('Account')}>Account</button>
        <button onClick={() => handleMenuClick('Logout')}>Logout</button>
      </div>
      <div className="RightMenu">
        {selectedMenuItem === 'Home' && (
          <div>
            <p className="Date">Date: {currentDate}</p>
            <p className="time">Time: {currentTime}</p>
            <div className="appointments">
              <h2>Your Appointments</h2>
              <table>
                <thead>
                  <tr>
                    <th>Category</th>
                    <th>Doctor</th>
                    <th>Appointment Date</th>
                  </tr>
                </thead>
                <tbody>
                  {appointments.map((appointment, index) => (
                    <tr key={index}>
                      <td>{findDoctorCategory(`Dr. ${capitalizeFirstLetter(appointment.doctorEmail.split('@')[0])}`)}</td>
                      <td>{`Dr. ${capitalizeFirstLetter(appointment.doctorEmail.split('@')[0])}`}</td>
                      <td>{new Date(appointment.appointmentDate).toLocaleDateString('en-GB', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric',
                      })}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {appointments.length === 0 && <p>No appointments available.</p>}

              <h2>Your Records</h2>
                <table>
                  <thead>
                    <tr>
                      <th>Category</th>
                      <th>Doctor</th>
                      <th>Diagnosis</th>
                      <th>Medications</th>
                    </tr>
                  </thead>
                  <tbody>
                    {records.map((record, index) => (
                      <tr key={index}>
                        <td>{findDoctorCategory(`Dr. ${capitalizeFirstLetter(record.doctorEmail.split('@')[0])}`)}</td>
                        <td>{`Dr. ${capitalizeFirstLetter(record.doctorEmail.split('@')[0])}`}</td>
                        <td>{record.diagnosis}</td>
                        <td>{record.medications}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {records.length === 0 && <p>No records available.</p>}

            </div>
          </div>
        )}
        {selectedMenuItem === 'Book an Appointment' && (
          <div>
            <p className="Date">Date: {currentDate}</p>
            <p className="time">Time: {currentTime}</p>
            <form onSubmit={handleAppointmentSubmit}>
              <label>Select Category:</label>
              <select value={selectedCategory} onChange={handleCategoryChange}>
                <option value="" disabled>
                  Select a category
                </option>
                {Categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>

              {selectedCategory && (
                <>
                  <label>Select Doctor:</label>
                  <select value={selectedDoctor} onChange={handleDoctorChange}>
                    <option value="" disabled>
                      Select a doctor
                    </option>
                    {DoctorsData[selectedCategory].map((doctor) => (
                      <option key={doctor} value={doctor}>
                        {doctor}
                      </option>
                    ))}
                  </select>

                  <label>Select Appointment Date:</label>
                  <input type="date" value={appointmentDate} onChange={handleDateChange} required />
                </>
              )}

              <button type="submit">Book an Appointment</button>
            </form>
          </div>
        )}
        {selectedMenuItem === 'Account' && <p>Content for Account</p>}
      </div>
    </div>
  );
}

export default PatientHome;
