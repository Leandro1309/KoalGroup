import React, { useState } from 'react';
import { SupervisorPanel } from './Administrador/components/SupervisorPanel';
import { AdministratorPanel } from './Administrador/components/AdministratorPanel';

const Login = ({ onLogin }) => (
  <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh'}}>
    <h2 style={{marginBottom: 16, fontWeight: 'bold'}}>Selecciona tu rol</h2>
    <button onClick={() => onLogin('supervisor')} style={{marginBottom: 8, padding: '8px 16px', background: '#2563eb', color: 'white', borderRadius: 4}}>Supervisor</button>
    <button onClick={() => onLogin('administrator')} style={{padding: '8px 16px', background: '#16a34a', color: 'white', borderRadius: 4}}>Administrador</button>
  </div>
);

export default function App() {
  const [role, setRole] = useState(null);

  if (!role) {
    return <Login onLogin={setRole} />;
  }
  if (role === 'supervisor') {
    return <SupervisorPanel />;
  }
  if (role === 'administrator') {
    return <AdministratorPanel />;
  }
  return null;
} 
