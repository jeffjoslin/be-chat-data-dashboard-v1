const express = require('express');
const app = express();
const port = 4000;

app.get('/', (req, res) => {
  res.send('<h1>Debug Server Working!</h1><p>If you can see this, networking is OK</p>');
});

const server = app.listen(port, '0.0.0.0', () => {
  console.log(`Debug server running at:`);
  console.log(`- http://localhost:${port}`);
  console.log(`- http://127.0.0.1:${port}`);
  console.log(`- http://0.0.0.0:${port}`);
});

server.on('error', (err) => {
  console.error('Server error:', err);
});

// Keep server alive
process.on('SIGINT', () => {
  console.log('Received SIGINT, shutting down gracefully');
  server.close(() => {
    process.exit(0);
  });
});