const express = require('express');
const cors = require('cors');
const { createProxyMiddleware } = require('http-proxy-middleware');
const bodyParser = require('body-parser');
const ffmpeg = require('fluent-ffmpeg');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = 3001;

// Enhanced CORS configuration
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(bodyParser.json());

// Serve static files
// Serve static files from the "public" folder
app.use(express.static(path.join(__dirname, 'public')));

// Serve index.html for root route
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Proxy for Owncast HLS stream
app.use('/proxy-hls', createProxyMiddleware({
  target: 'http://<ip-pc>:8080',
  changeOrigin: true,
  pathRewrite: {
    '^/proxy-hls': ''
  },
  onProxyReq: (proxyReq, req, res) => {
    proxyReq.setHeader('Access-Control-Allow-Origin', '*');
  }
}));

// Clip endpoint
app.post('/create-clip', (req, res) => {
  const { streamUrl, startTime, duration, fileName } = req.body;
  
  if (!streamUrl || !startTime || !duration || !fileName) {
    return res.status(400).json({ error: 'Missing required parameters' });
  }

  // Sanitize filename
  const safeFileName = fileName.replace(/[^a-z0-9]/gi, '_').toLowerCase();
  const outputPath = path.join(__dirname, 'public', 'clips', `${safeFileName}.mp4`);

  // Create clips directory if it doesn't exist
  if (!fs.existsSync(path.join(__dirname, 'public', 'clips'))) {
    fs.mkdirSync(path.join(__dirname, 'public', 'clips'));
  }

  console.log(`Creating clip from ${streamUrl} (${startTime}s for ${duration}s)`);
  
  ffmpeg(streamUrl)
    .setStartTime(startTime)
    .setDuration(duration)
    .output(outputPath)
    .on('start', (commandLine) => {
      console.log('Spawned FFmpeg with command:', commandLine);
    })
    .on('progress', (progress) => {
      console.log(`Processing: ${progress.timemark}`);
    })
    .on('end', () => {
      console.log('Clip created successfully');
      res.json({ 
        success: true,
        clipUrl: `/clips/${safeFileName}.mp4`
      });
    })
    .on('error', (err) => {
      console.error('Error creating clip:', err);
      res.status(500).json({ 
        error: 'Error creating clip',
        details: err.message 
      });
    })
    .run();
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log(`Configure Ngrok with: ngrok http ${PORT}`);
});
