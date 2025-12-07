import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { analytics } from './firebase'; // Import Firebase
import { logEvent } from "firebase/analytics"; // Import logEvent

const API_URL = 'http://localhost:5000/api';

function App() {
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')));
  
  // Login State
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);
  const [name, setName] = useState('');

  // Dashboard State
  const [appointments, setAppointments] = useState([]);
  const [newSlot, setNewSlot] = useState('');
  const [availability, setAvailability] = useState([]);

  const login = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${API_URL}/auth/login`, { email, password });
      if (res.data.user.role !== 'pro') {
        alert('Access restricted to Professionals');
        return;
      }
      setToken(res.data.token);
      setUser(res.data.user);
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));

      // Log Login Event to Firebase
      logEvent(analytics, 'login', { 
        method: 'email',
        role: 'pro'
      });

    } catch (err) {
      alert('Login failed');
    }
  };

  const register = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API_URL}/auth/register`, { name, email, password, role: 'pro' });
      alert('Registration successful! Please login.');
      setIsRegistering(false);
    } catch (err) {
      alert('Registration failed: ' + (err.response?.data?.message || err.message));
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.clear();
  };

  const fetchAppointments = async () => {
    try {
      const res = await axios.get(`${API_URL}/appointments/${user.id}?role=pro`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setAppointments(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchAvailability = async () => {
    try {
      const res = await axios.get(`${API_URL}/professionals/${user.id}`);
      setAvailability(res.data.availability || []);
    } catch (err) {
      console.error("Failed to fetch availability", err);
    }
  };

  const addSlot = async () => {
    try {
      const dateObj = new Date(newSlot);
      const res = await axios.post(`${API_URL}/professionals/availability`, 
        { userId: user.id, date: dateObj.toISOString() },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert('Slot added');
      setAvailability(res.data);
      setNewSlot('');
    } catch (err) {
      alert('Failed to add slot');
    }
  };

  const removeSlot = async (date) => {
    if (!window.confirm('Are you sure you want to remove this slot?')) return;
    try {
      const res = await axios.delete(`${API_URL}/professionals/availability`, {
        headers: { Authorization: `Bearer ${token}` },
        data: { userId: user.id, date: date }
      });
      alert('Slot removed');
      setAvailability(res.data);
    } catch (err) {
      alert('Failed to remove slot');
    }
  };

  useEffect(() => {
    if (token && user) {
      fetchAppointments();
      fetchAvailability();
    }
  }, [token, user]);

  if (!token) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: '#f0f2f5' }}>
        <div style={{ padding: 40, backgroundColor: 'white', borderRadius: 8, boxShadow: '0 2px 4px rgba(0,0,0,0.1)', width: 300 }}>
          <h1 style={{ textAlign: 'center', color: '#1a73e8', marginBottom: 20 }}>{isRegistering ? 'Pro Register' : 'Pro Login'}</h1>
          <form onSubmit={isRegistering ? register : login} style={{ display: 'flex', flexDirection: 'column', gap: 15 }}>
            {isRegistering && (
              <input 
                type="text" 
                placeholder="Full Name" 
                value={name} 
                onChange={e => setName(e.target.value)} 
                required 
                style={{ padding: 10, borderRadius: 4, border: '1px solid #ddd' }}
              />
            )}
            <input 
              type="email" 
              placeholder="Email" 
              value={email} 
              onChange={e => setEmail(e.target.value)} 
              required 
              style={{ padding: 10, borderRadius: 4, border: '1px solid #ddd' }}
            />
            <input 
              type="password" 
              placeholder="Password" 
              value={password} 
              onChange={e => setPassword(e.target.value)} 
              required 
              style={{ padding: 10, borderRadius: 4, border: '1px solid #ddd' }}
            />
            <button type="submit" style={{ padding: 10, backgroundColor: '#1a73e8', color: 'white', border: 'none', borderRadius: 4, cursor: 'pointer', fontWeight: 'bold' }}>
              {isRegistering ? 'Register' : 'Login'}
            </button>
          </form>
          <p style={{ textAlign: 'center', marginTop: 15, fontSize: 14 }}>
            {isRegistering ? 'Already have an account? ' : "Don't have an account? "}
            <span 
              onClick={() => setIsRegistering(!isRegistering)} 
              style={{ color: '#1a73e8', cursor: 'pointer', fontWeight: 'bold' }}
            >
              {isRegistering ? 'Login' : 'Register'}
            </span>
          </p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ fontFamily: 'Arial, sans-serif', backgroundColor: '#f5f7fa', minHeight: '100vh' }}>
      <nav style={{ backgroundColor: '#fff', padding: '15px 30px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1 style={{ margin: 0, color: '#1a73e8', fontSize: 24 }}>Mini Docto Pro</h1>
        <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
          <span style={{ color: '#5f6368' }}> {user.name} (Score: {user.score})</span>
          <button onClick={logout} style={{ padding: '8px 16px', border: '1px solid #dadce0', backgroundColor: 'white', borderRadius: 4, cursor: 'pointer' }}>Logout</button>
        </div>
      </nav>

      <div style={{ maxWidth: 1000, margin: '30px auto', padding: '0 20px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 30 }}>
        
        {/* Availability Section */}
        <div style={{ backgroundColor: 'white', padding: 25, borderRadius: 8, boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
          <h2 style={{ marginTop: 0, color: '#202124', borderBottom: '1px solid #eee', paddingBottom: 15 }}>Manage Availability</h2>
          
          <div style={{ display: 'flex', gap: 10, marginBottom: 20 }}>
            <input 
              type="datetime-local" 
              value={newSlot} 
              onChange={e => setNewSlot(e.target.value)} 
              style={{ flex: 1, padding: 10, borderRadius: 4, border: '1px solid #ddd' }}
            />
            <button onClick={addSlot} style={{ padding: '10px 20px', backgroundColor: '#34a853', color: 'white', border: 'none', borderRadius: 4, cursor: 'pointer' }}>Add Slot</button>
          </div>

          <div style={{ marginTop: 20 }}>
             <h3 style={{ fontSize: 16, color: '#5f6368' }}>Your Slots</h3>
             {availability.length === 0 ? (
                <p style={{ color: '#888' }}>No slots available.</p>
             ) : (
                <ul style={{ listStyle: 'none', padding: 0 }}>
                  {availability.map((slot, index) => (
                    <li key={index} 
                        onClick={() => removeSlot(slot)}
                        title="Click to remove"
                        style={{ 
                          padding: '10px', 
                          borderBottom: '1px solid #eee', 
                          cursor: 'pointer',
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          backgroundColor: '#fff',
                          transition: 'background-color 0.2s'
                        }}
                        onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#f9f9f9'}
                        onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#fff'}
                    >
                      <span>{new Date(slot).toLocaleString()}</span>
                      <span style={{ color: '#ea4335', fontSize: 12, border: '1px solid #ea4335', padding: '2px 6px', borderRadius: 4 }}>Remove</span>
                    </li>
                  ))}
                </ul>
             )}
          </div>
        </div>

        {/* Appointments Section */}
        <div style={{ backgroundColor: 'white', padding: 25, borderRadius: 8, boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
          <h2 style={{ marginTop: 0, color: '#202124', borderBottom: '1px solid #eee', paddingBottom: 15 }}>Upcoming Appointments</h2>
          
          {appointments.length === 0 ? (
            <p style={{ color: '#5f6368', textAlign: 'center', marginTop: 30 }}>No appointments yet.</p>
          ) : (
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              {appointments.map(appt => (
                <li key={appt._id} style={{ padding: '15px 0', borderBottom: '1px solid #f1f3f4', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div style={{ fontWeight: 'bold', color: '#202124' }}>{new Date(appt.date).toLocaleString()}</div>
                    <div style={{ color: '#5f6368', fontSize: 14 }}>Patient: {appt.patient.name}</div>
                  </div>
                  <span style={{ padding: '4px 8px', backgroundColor: '#e6f4ea', color: '#137333', borderRadius: 12, fontSize: 12, fontWeight: 'bold' }}>Confirmed</span>
                </li>
              ))}
            </ul>
          )}
        </div>

      </div>
    </div>
  );
}

export default App;
