const express = require('express');
const PORT = process.env.PORT || 3001;
const app = express();
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid')

app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(express.static('public'))


app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '/public/index.html'))
})

app.get('/notes', (req, res) => {
  res.sendFile(path.join(__dirname, '/public/notes.html'))
})

app.get('/api/notes', (req, res) => {
  fs.readFile('db/db.json', 'utf-8', (err, data) => {
    err ? console.log(err) : res.json(JSON.parse(data))
  })
})

app.post('/api/notes', (req, res) => {
  var newNote = {
    title: req.body.title,
    text: req.body.text,
    id: uuidv4()
  }
  fs.readFile('db/db.json', (err, data) => {
    var currentNotes = JSON.parse(data)
    currentNotes.push(newNote)
    fs.writeFile('db/db.json', JSON.stringify(currentNotes), (err) => {
      err ? console.log(err) : console.log('note saved');
    })
    res.sendFile(path.join(__dirname, '/public/notes.html'))
  })
})

app.delete('/api/notes/:id', (req, res) => {
  var clicked = req.params.id
  fs.readFile('db/db.json', (err, data) => {
    var data = JSON.parse(data)
    var filtered = data.filter(note => note.id !== clicked)
    fs.writeFile('db/db.json', JSON.stringify(filtered), (err) => {
      err ? console.log(err) : console.log('note deleted');
    })
    res.sendFile(path.join(__dirname, '/public/notes.html'))
  })
})

app.listen(PORT, () => {
  console.log(`API server now on port http://localhost:${PORT}`);
});