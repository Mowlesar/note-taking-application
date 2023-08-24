const express = require('express');
const { v4: uuidv4 } = require('uuid');
const router = express.Router();

const fs = require('fs');

router.get('/api/notes', (req, res) => {
  fs.readFile('db/db.json', 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Internal server error' });
    }
    const notes = JSON.parse(data);
    res.setHeader('Cache-Control', 'no-store');
    console.log(notes)
    res.json(notes);
  });
});

router.post('/api/notes', (req, res) => {
  const newNote = req.body;

  let notes = [];

  fs.readFile('db/db.json', 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Internal server error' });
    }
    notes = JSON.parse(data);
    newNote.id = uuidv4();
    notes.push(newNote);

    fs.writeFile('db/db.json', JSON.stringify(notes), (err) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: 'Internal server error' });
      }
      res.json(newNote);
    });
  });
});


module.exports = router;