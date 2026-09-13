const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 3000;
const BASE_DIR = __dirname;

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.mjs': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.webp': 'image/webp',
  '.woff2': 'font/woff2',
  '.woff': 'font/woff',
  '.ttf': 'font/ttf'
};

function handleRequest(req, res) {
  const urlPath = req.url.split('?')[0];
  let safePath = path.normalize(decodeURIComponent(urlPath)).replace(/^(\.\.[\/\\])+/, '');
  if (safePath === '/' || safePath === '') {
    safePath = '/index.html';
  }

  let filePath = path.join(BASE_DIR, safePath);

  // If path has no extension and is not a directory, try appending .html
  if (!path.extname(filePath)) {
    if (fs.existsSync(filePath + '.html')) {
      filePath = filePath + '.html';
    } else if (fs.existsSync(path.join(filePath, 'index.html'))) {
      filePath = path.join(filePath, 'index.html');
    }
  }

  fs.stat(filePath, (err, stats) => {
    if (err || !stats.isFile()) {
      res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' });
      res.end(`
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <title>404 Not Found | Manpreet Chaudhary</title>
          <style>
            body { background: #f8f9fa; color: #22252a; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; display: flex; align-items: center; justify-content: center; height: 100vh; margin: 0; }
            .box { text-align: center; border: 1px solid rgba(0,0,0,0.08); padding: 40px 60px; border-radius: 16px; background: #ffffff; box-shadow: 0 10px 30px rgba(0,0,0,0.06); }
            h1 { font-size: 3.5rem; margin: 0; color: #2563eb; font-weight: 800; }
            p { color: #57606a; margin-top: 10px; font-size: 1.1rem; }
            a { color: #ffffff; background: #2563eb; text-decoration: none; padding: 10px 22px; border-radius: 9999px; display: inline-block; margin-top: 20px; font-weight: 600; box-shadow: 0 4px 14px rgba(37,99,235,0.25); transition: all 0.2s; }
            a:hover { background: #1d4ed8; transform: translateY(-2px); }
          </style>
        </head>
        <body>
          <div class="box">
            <h1>404</h1>
            <p>Page not found</p>
            <a href="/">Return Home</a>
          </div>
        </body>
        </html>
      `);
      return;
    }

    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';

    res.setHeader('Content-Type', contentType);
    res.setHeader('Access-Control-Allow-Origin', '*');

    const stream = fs.createReadStream(filePath);
    stream.on('error', () => {
      res.writeHead(500, { 'Content-Type': 'text/plain' });
      res.end('Internal Server Error');
    });
    stream.pipe(res);
  });
}

function startServer(port) {
  const server = http.createServer(handleRequest);

  server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      console.log(`Port ${port} is currently in use, trying ${port + 1}...`);
      startServer(port + 1);
    } else {
      console.error('Server error:', err);
    }
  });

  server.listen(port, '0.0.0.0', () => {
    console.log(`\n==================================================`);
    console.log(`🚀 Portfolio server running!`);
    console.log(`👉 Local: http://localhost:${port}`);
    console.log(`==================================================\n`);
  });
}

startServer(Number(PORT));
