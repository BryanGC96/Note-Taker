const express = require('express');

const PORT = 3001;

const app = express();

app.get('/notes', (req, res) => {
res.sendFile(__dirname + 'Develop\public\notes.html');
});

app.listen(PORT, () => {
  console.log(`Server runNing on port: ${PORT}`)
});
