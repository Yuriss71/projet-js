const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const app = express();
const port = 3000;

app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static('uploads'));

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });

if (!fs.existsSync('uploads')) {
    fs.mkdirSync('uploads');
}

app.get('/', (req, res) => {
    const files = fs.readdirSync('uploads');
    res.render('index', { videos: files });
});

app.post('/upload', upload.single('videoFile'), (req, res) => {
    res.redirect('/');
});

app.get('/videos', (req, res) => {
    const files = fs.readdirSync('uploads');
    res.render('videos', { videos: files });
});

app.get('/player/:filename', (req, res) => {
    res.render('player', { filename: req.params.filename });
});

app.listen(port, () => {
    console.log(`Serveur démarré sur http://localhost:${port}`);
}); 