const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

// Enable CORS and JSON body parsing
app.cors = cors();
app.use(cors());
app.use(express.json());

// Serve static files from 'public'
app.use(express.static(path.join(__dirname, 'public')));

// Configure Multer for audio uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, 'uploads');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir);
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    // Generate unique filename to avoid overwrites
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage,
  limits: { fileSize: 100 * 1024 * 1024 }, // 100MB limit
  fileFilter: (req, file, cb) => {
    const allowedExtensions = ['.mp3', '.wav', '.ogg', '.flac', '.m4a', '.aac'];
    const ext = path.extname(file.originalname).toLowerCase();
    if (allowedExtensions.includes(ext)) {
      cb(null, true);
    } else {
      cb(new Error('Only audio files are allowed (.mp3, .wav, .ogg, .flac, .m4a, .aac)'));
    }
  }
});

// API: Upload Local Music
app.post('/api/upload', (req, res) => {
  upload.single('audio')(req, res, (err) => {
    if (err) {
      return res.status(400).json({ success: false, error: err.message });
    }
    if (!req.file) {
      return res.status(400).json({ success: false, error: 'No file uploaded' });
    }
    
    res.json({
      success: true,
      filename: req.file.filename,
      originalName: req.file.originalname,
      duration: 0 // Duration will be extracted on the frontend
    });
  });
});

// API: List Local Music
app.get('/api/music', (req, res) => {
  const uploadDir = path.join(__dirname, 'uploads');
  if (!fs.existsSync(uploadDir)) {
    return res.json([]);
  }

  fs.readdir(uploadDir, (err, files) => {
    if (err) {
      return res.status(500).json({ success: false, error: 'Failed to read uploads directory' });
    }
    
    const musicFiles = files.map(filename => {
      const stats = fs.statSync(path.join(uploadDir, filename));
      return {
        filename: filename,
        originalName: filename.substring(filename.indexOf('-') + 1), // Removing the unique timestamp if we assume simple structure, but let's just return filename as originalName for now since we don't store a DB mapping
        url: `/uploads/${filename}`,
        size: stats.size
      };
    });
    
    res.json(musicFiles);
  });
});

// API: Delete Local Music
app.delete('/api/music/:filename', (req, res) => {
  const filename = req.params.filename;
  const filePath = path.join(__dirname, 'uploads', filename);
  
  if (fs.existsSync(filePath)) {
    fs.unlink(filePath, (err) => {
      if (err) {
        return res.status(500).json({ success: false, error: 'Failed to delete file' });
      }
      res.json({ success: true });
    });
  } else {
    res.status(404).json({ success: false, error: 'File not found' });
  }
});

// Serve uploaded files statically
app.use('/uploads', express.static(path.join(__dirname, 'uploads'), {
  setHeaders: (res, path, stat) => {
    if (path.endsWith('.mp3')) res.set('Content-Type', 'audio/mpeg');
    else if (path.endsWith('.wav')) res.set('Content-Type', 'audio/wav');
    else if (path.endsWith('.ogg')) res.set('Content-Type', 'audio/ogg');
    else if (path.endsWith('.flac')) res.set('Content-Type', 'audio/flac');
    else if (path.endsWith('.m4a')) res.set('Content-Type', 'audio/mp4');
    else if (path.endsWith('.aac')) res.set('Content-Type', 'audio/aac');
  }
}));

app.listen(PORT, () => {
  console.log(`🕉️ Dev Sangeet server running on http://localhost:${PORT}`);
});
