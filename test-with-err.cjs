const http = require('http');

console.log('Testing with mock key...');
const req = http.request('http://localhost:3000/api/query', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  }
}, (res) => {
  let body = '';
  res.on('data', d => body += d);
  res.on('end', () => {
    console.log('Status:', res.statusCode);
    console.log('Body:', body);
  });
});

req.write(JSON.stringify({ query: 'Hello' }));
req.end();
