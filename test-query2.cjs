const http = require('http');

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

req.write(JSON.stringify({ query: 'Outline the step-by-step roadmap to qualify for and unlock up to 100% subsidized Azure End-customer Investment Funds (ECIF) for ANZ enterprises.' }));
req.end();
