const express = require('express');
const path = require('path');
const fs = require('fs');
const uuid = require('uuid');

const PORT = 3001;

const app = express();

app.use(express.static('public')); // Middleware static assets

app.use(express.json()); //Middleware to parse JSONs

// Gets route for notes
app.get('/notes', (req, res) => {
res.sendFile(path.join(__dirname + '/public/notes.html'));
});

app.get('/api/notes', (req, res) => {
    console.log('GET request recieved for /api/notes');
    fs.readFile('./db/db.json', 'utf-8', (err, data) => {
        if (err) {
            console.error(err);
            res.status(500).send('Error reading data from db.json');
            return;
        }
        try {
            // Parse the JSON data
            const notes = JSON.parse(data);
            console.log('Data from db.json: ')
            // Send the parsed JSON as response
            res.json(notes);
        } catch (parseError) {
            console.error(parseError);
            res.status(500).send('Error parsing data from db.json');
        }
    });
});

const readDb = () => {
    const dbPath = path.join(__dirname, 'db', 'db.json');
    const data = fs.readFileSync(dbPath, 'utf-8'); // Makes sure to use the default encoding [in this case UTF-8].
    return JSON.parse(data);
};

const writeDB = (data) => {
    const dbPath = path.join(__dirname, 'db', 'db.json');
    fs.writeFileSync(dbPath, JSON.stringify(data, null, 2), 'utf-8');
};

// Route to save new notes inside 'db.josn' using readDB and writeDB.
app.post('/api/notes', (req, res) => {
    const newNote = req.body;

    newNote.id = uuid.v4(); // Generates a new id for each new note added, usinge the 4th version of uuid.

    const db = readDb();
    db.push(newNote);
    writeDB(db); // Writes updated data back to 'db.json'
    res.status(201).json(newNote);
});

// ---------BONUS--------------
// Deletes notes with the id parameter.
app.delete('/api/notes/:id', (req, res) => {
    const id = req.params.id; // Extracts the note ID from the request parameters.
    const db = readDb(); // Reads data from 'db.json'.
    const updatedDB = db.filter(note => note.id !== id); // Filters out the note with the matching ID.
    writeDB(updatedDB);
    res.sendStatus(204);
});

app.listen(PORT, () => {
  console.log(`Server running on port: ${PORT}`)
});

// Moved this GET * to the last part of the code, just in case none of the above ones are used.
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname + '/public/index.html'));
    });
