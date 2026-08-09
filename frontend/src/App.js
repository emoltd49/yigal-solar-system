import React, { useState } from 'react';
import axios from 'axios';

function App() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [msg, setMsg] = useState('');

  const login = async () => {
    try {
      const res = await axios.post((process.env.REACT_APP_API_URL || '') + '/api/auth/login', { username, password });
      setMsg('Logged in as ' + res.data.username + ' role ' + res.data.role);
      localStorage.setItem('token', res.data.token);
    } catch (err) {
      setMsg('Login failed');
    }
  };

  return (
    <div style={{padding:20}}>
      <h2>Yigal Solar System - Demo Login</h2>
      <div style={{maxWidth:400}}>
        <input placeholder="username" value={username} onChange={e=>setUsername(e.target.value)} style={{width:'100%',padding:8,marginBottom:8}} />
        <input placeholder="password" value={password} onChange={e=>setPassword(e.target.value)} style={{width:'100%',padding:8,marginBottom:8}} />
        <button onClick={login} style={{padding:8}}>Login</button>
        <p>{msg}</p>
        <p>Demo users: yigal/0106, emil/0408, natali/1111</p>
      </div>
    </div>
  );
}

export default App;
