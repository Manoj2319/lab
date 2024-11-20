const express = require('express');
const { Dropbox } = require('dropbox');
const fetch = require('isomorphic-fetch');
const multer = require('multer');
const upload = multer();
const path = require('path');  // Add this line

const app = express();

// Set the view engine to EJS
app.set('view engine', 'ejs');

// Set the public folder for static assets like CSS
app.use(express.static(path.join(__dirname, 'public')));  // Update the path as needed

// Dropbox setup - replace with your Dropbox access token
const dropbox = new Dropbox({
    accessToken: 'sl.B9b94WvzQA-K3YRrqBQiVZwGN-dJ2yjYt0A4JrLwdizusvvp9ZE4zkOJVnXGZR8OBu5P2RMBDHYNiJKYq45hOSlMnQB-AHD6YdqJLQ6qZSjjS39g0IKN1DClP4LePTUUl6wMOyDt_lc50gQvnRyn',  // Replace with your Dropbox access token
    fetch
});

// Root route to serve the index.ejs file
app.get('/', (req, res) => {
    res.render('index');  // Renders the index.ejs file in the views directory
});

// Upload File to Dropbox Route
app.post('/upload-file', upload.single('file'), (req, res) => {
    const fileContent = req.file.buffer;
    dropbox.filesUpload({ path: `/${req.file.originalname}`, contents: fileContent })
        .then(() => res.send('File uploaded to Dropbox'))
        .catch(err => res.status(500).send(err));
});

// Download File from Dropbox Route
app.get('/download-file', (req, res) => {
    const fileName = req.query.fileName;
    dropbox.filesDownload({ path: `/${fileName}` })
        .then(response => {
            res.set({
                'Content-Type': response.result['.tag'] === 'file' ? response.result.name.split('.').pop() : 'application/octet-stream',
                'Content-Disposition': `attachment; filename="${response.result.name}"`
            });
            res.send(response.result.fileBinary);
        })
        .catch(err => res.status(500).send(err));
});

app.listen(3000, () => {
    console.log('Dropbox server is running on port 3000');
});
