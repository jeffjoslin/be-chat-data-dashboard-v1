const http = require('http');

const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/html' });
  res.end('<h1>Test Server is Working!</h1>');
});

server.listen(9000, () => {
  console.log('Test server running on http://localhost:9000');
});

setTimeout(() => {
  console.log('Server is still running after 5 seconds');
}, 5000);