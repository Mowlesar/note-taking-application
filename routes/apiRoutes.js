const express = require('express');
const { v4: uuidv4 } = require('uuid');
const router = express.Router();

const fs = require('fs');
const { join } = require('path');

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

router.delete('/api/notes/:id', (req, res) => {
  const noteId = req.params.id;
  fs.readFile('db/db.json', 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Internal server error' });
    }
    let notes = JSON.parse(data);
    const noteIndex = notes.findIndex((note) => note.id === noteId);

    if (noteIndex === -1) {
      return res.status(404).json({ error: 'Note note found' });
    }

    notes.splice(noteIndex, 1);
    fs.writeFile('db/db.json', JSON.stringify(notes), (err) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: 'Internal server error' });
      }
      res.json({ message: 'Note deleted successfully' });
    });
  });
});

module.exports = router;