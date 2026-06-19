const http = require('http');

const req = http.request('http://localhost:3000/api/scrape-ai-business', {
  method: 'GET'
}, (res) => {
  let body = '';
  res.on('data', d => body += d);
  res.on('end', () => {
    console.log('Status:', res.statusCode);
  });
});

req.end();
