require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const app = express();
app.use(cors());
app.use(express.json());

// Demo in-memory users for initial setup
const demoUsers = [
  { id: 1, username: 'yigal', password: '0106', role: 'admin' },
  { id: 2, username: 'emil', password: '0408', role: 'admin' },
  { id: 3, username: 'natali', password: '1111', role: 'user' }
];

// Health
app.get('/api/health', (req, res) => res.json({ ok: true }));

// Simple login endpoint (demo)
// In production replace with DB lookup and bcrypt compare
app.post('/api/auth/login', async (req, res) => {
  const { username, password } = req.body;
  const user = demoUsers.find(u => u.username === username);
  if (!user) return res.status(401).json({ error: 'Invalid credentials' });

  // demo plain-text check; replace with bcrypt in production
  if (password !== user.password) return res.status(401).json({ error: 'Invalid credentials' });

  const token = jwt.sign({ id: user.id, username: user.username, role: user.role }, process.env.JWT_SECRET || 'dev-secret', { expiresIn: '8h' });
  res.json({ token, username: user.username, role: user.role });
});

// Example protected route
app.get('/api/me', (req, res) => {
  const auth = req.headers.authorization || '';
  const token = auth.replace('Bearer ', '');
  if (!token) return res.status(401).json({ error: 'Missing token' });
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET || 'dev-secret');
    res.json({ user: payload });
  } catch (err) {
    res.status(401).json({ error: 'Invalid token' });
  }
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log('Backend running on', PORT));
