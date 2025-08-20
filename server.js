const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());
app.use('/ads', express.static(path.join(__dirname, 'ads')));

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'ads/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + '-' + file.originalname);
  }
});

const upload = multer({ storage });

const getFileType = (filename) => {
  const ext = path.extname(filename).toLowerCase();
  if (['.jpg', '.jpeg', '.png', '.gif', '.svg'].includes(ext)) {
    return 'image';
  } else if (['.html', '.htm'].includes(ext)) {
    return 'html';
  } else if (['.jsx', '.js'].includes(ext)) {
    return 'react';
  }
  return 'unknown';
};

app.get('/api/ads', (req, res) => {
  const adsDir = path.join(__dirname, 'ads');
  
  if (!fs.existsSync(adsDir)) {
    fs.mkdirSync(adsDir);
    return res.json([]);
  }

  const files = fs.readdirSync(adsDir);
  const ads = files
    .filter(file => !file.startsWith('.'))
    .map((file, index) => ({
      id: index + 1,
      name: file.replace(/^\d+-\d+-/, ''),
      filename: file,
      type: getFileType(file),
      uploadDate: fs.statSync(path.join(adsDir, file)).mtime
    }));

  res.json(ads);
});

app.post('/api/upload', upload.array('ads'), (req, res) => {
  if (!req.files || req.files.length === 0) {
    return res.status(400).json({ error: 'No files uploaded' });
  }
  
  res.json({ 
    message: 'Files uploaded successfully',
    files: req.files.map(f => f.filename)
  });
});

app.delete('/api/ads/:filename', (req, res) => {
  const filePath = path.join(__dirname, 'ads', req.params.filename);
  
  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
    res.json({ message: 'File deleted successfully' });
  } else {
    res.status(404).json({ error: 'File not found' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});