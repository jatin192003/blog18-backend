require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const https = require('https');
const http = require('http');

const postRoutes = require('./routes/postRoutes');

const app = express();

app.use(cors());
app.use(express.json());

// Function to ping the server
const pingServer = (url) => {
  const httpModule = url.startsWith('https') ? https : http;
  httpModule.get(url, (res) => {
    console.log(`[${new Date().toISOString()}] Server pinged, status: ${res.statusCode}`);
  }).on('error', (err) => {
    console.error('Ping error:', err.message);
  });
};

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK' });
});

app.use('/api', postRoutes);

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log('MongoDB Connected');
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log('Server running at port', PORT);
    
    // Start the self-pinging mechanism
    const RENDER_URL = process.env.RENDER_URL || `http://localhost:${PORT}`;
    setInterval(() => {
      pingServer(`${RENDER_URL}/health`);
    }, 13 * 60 * 1000); // Ping every 10 minutes
  });
}).catch(err => console.log(err));
