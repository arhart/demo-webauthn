'use strict';
// This is a minimal server since file:/// isn't working, possibly due to not having a domain

const fs = require('fs/promises');
const http = require('http');
//const url = require('url'); // no need; URL is global

/* Firefox 91.0.2
 * considers each of file:///..., http://127.0.0.1:8080/index.html, and
 * http://localhost:8080/index.html isSecureContext, but navigator.credentials.create( { publicKey } ) results in:
 * file:///... DOMException: The request is not allowed by the user agent or the platform in the current context, possibly because the user denied permission.
 * http://127.0.0.1:8080/index.html DOMException: The operation is insecure.
 * http://localhost:8080/index.html permits the call
 */
const port = 8080;
const knownFiles = new Map([
  ['index.html', 'text/html'],
  ['script.js', 'text/javascript'],
  ['main.css', 'text/css'],
]);

const server = http.createServer();
server.on('request', async (req, resp) => {
  //console.log('headers', req.headers);
  //console.log('method', req.method);
  //console.log('url', req.url);
  const urlObj = new URL(req.url, `http://${req.headers.host}`);
  //console.log('urlObj', urlObj);
  const { pathname } = urlObj;
  const maybeFilename = pathname?.slice?.(1);
  console.log('maybeFilename', maybeFilename);
  const contentType = knownFiles.get( maybeFilename );
  if ( knownFiles.has( maybeFilename ) ) {
    resp.setHeader('Content-type', contentType );
    resp.statusCode = 200;
    const fileContents = await fs.readFile( maybeFilename );
    resp.write( fileContents );
    resp.end();
  } else {
    resp.setHeader('Content-type', 'text/html' );
    resp.statusCode = 403;
    resp.write( '<html><body>look, a body!</body></html>' );
    resp.end();
  }
});
server.listen({port});
