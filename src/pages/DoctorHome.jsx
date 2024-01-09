import React, { useState, useEffect } from 'react';

function cap(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

const Appointments = ({ todayApps }) => {
  const [showForm, setShowForm] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);

  const openForm = (appointment) => {
    setSelectedAppointment(appointment);
    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
  };

  const submitForm = async (formData) => {
    try {
      const response = await fetch('http://localhost:5000/record', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({formData, selectedAppointment}),
      });
      if (response.ok) {
        alert('Record submitted successfully');
      } else {
        alert('Failed to submit record');
      }
    } catch (error) {
      console.error('Error submitting record:', error.message);
    }
  };

  return (
    <div>
      <h2>Appointments</h2>
      {todayApps && todayApps.length > 0 ? (
        <table>
          <thead>
            <tr>
              <th>Patient Name</th>
              <th>Date</th>
              <th>DONE</th>
            </tr>
          </thead>
          <tbody>
            {todayApps.map((appointment) => (
              <tr key={appointment.appointmentId}>
                <td>{cap(appointment.patientEmail.split('@')[0])}</td>
                <td>{appointment.appointmentDate.split('T')[0]}</td>
                <td>
                  <div
                    className="done-box"
                    onClick={() => openForm(appointment)}
                  >
                    CLICK
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No appointments available today</p>
      )}

      {showForm && (
        <RecordForm
          appointment={selectedAppointment}
          onClose={closeForm}
          onSubmit={submitForm}
        />
      )}
    </div>
  );
};

const Records = ({ records }) => (
  <div>
    <h2>Records</h2>
    {records && records.length > 0 ? (
      <table>
        <thead>
          <tr>
            <th>Patient Email</th>
            <th>Doctor Email</th>
            <th>Diagnosis</th>
            <th>Medications</th>
          </tr>
        </thead>
        <tbody>
          {records.map((record) => (
            <tr key={record.recordsId}>
              <td>{record.patientEmail}</td>
              <td>{record.doctorEmail}</td>
              <td>{record.diagnosis}</td>
              <td>{record.medications}</td>
            </tr>
          ))}
        </tbody>
      </table>
    ) : (
      <p>No records available</p>
    )}
  </div>
);

const RecordForm = ({ appointment, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    patientEmail: appointment.patientEmail,
    doctorEmail: appointment.doctorEmail,
    diagnosis: '',
    medications: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
    onClose();
  };

  return (
    <div className="record-form">
      <h3>Record Form</h3>
      <form onSubmit={handleSubmit}>
        <label>
          Patient Email:
          <input
            type="text"
            name="patientEmail"
            value={formData.patientEmail}
            onChange={handleChange}
            readOnly
          />
        </label>
        <label>
          Doctor Email:
          <input
            type="text"
            name="doctorEmail"
            value={formData.doctorEmail}
            readOnly
          />
        </label>
        <label>
          Diagnosis:
          <input
            type="text"
            name="diagnosis"
            value={formData.diagnosis}
            onChange={handleChange}
            required
          />
        </label>
        <label>
          Medications:
          <input
            type="text"
            name="medications"
            value={formData.medications}
            onChange={handleChange}
            required
          />
        </label>
        <button type="submit">Submit</button>
      </form>
      <button onClick={onClose}>Cancel</button>
    </div>
  );
};

function DoctorHome() {
  const [activeTab, setActiveTab] = useState('appointments');
  const [appointments, setAppointments] = useState([]);
  const [records, setRecords] = useState([]);

  useEffect(() => {
    // Fetch doctor's appointments and records when the component mounts
    fetchDoctorData();
  }, []); // Empty dependency array ensures that this effect runs only once on mount

  // Function to fetch doctor's appointments and records
  const fetchDoctorData = async () => {
    try {
      // Assuming you have the doctor's ID stored in localStorage
      const doctorEmail = localStorage.getItem('doctorEmail');
      if (!doctorEmail) {
        console.error('Doctor email not found in localStorage');
        return;
      }

      const response = await fetch('http://localhost:5000/doctor-data', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ doctorEmail }),
      });

      const { apps, records } = await response.json();

      // Set the state with the received arrays
      setAppointments(apps);
      setRecords(records);
    } catch (error) {
      console.error('Error fetching doctor\'s data:', error.message);
    }
  };

  // Function to handle tab click
  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  return (
    <div>
      {/* Left Menu */}
      <div>
        <div
          className={`menu-item ${activeTab === 'appointments' ? 'active' : ''}`}
          onClick={() => handleTabClick('appointments')}
        >
          Appointments
        </div>
        <div
          className={`menu-item ${activeTab === 'records' ? 'active' : ''}`}
          onClick={() => handleTabClick('records')}
        >
          Records
        </div>
      </div>

      {/* Main Content */}
      <div>
        {activeTab === 'appointments' && <Appointments todayApps={appointments} />}
        {activeTab === 'records' && <Records records={records} />}
      </div>
    </div>
  );
}

export default DoctorHome;
