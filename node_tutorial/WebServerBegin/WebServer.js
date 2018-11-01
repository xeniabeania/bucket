'use strict';
const http = require('http');
const url = require('url');
const fs = require('fs');
const path = require('path');
let mimes = {
    '.htm': 'text/html',
    '.css': 'text/css',
    '.js': 'text/javascript',
    '.gif': 'image/gif',
    '.jpg': 'image/jpg',
    '.png': 'image/png'
}

function webserver(req, res) {
    // if the route requested s '/', then load index.htm or else
    // load the requested file(s)

    let baseURI = url.parse(req.url);
    let filepath = baseURI.pathname === '/' ? '/index.htm' : baseURI.pathname;
    console.log(baseURI);
    console.log(filepath);

    //check if the requested file is accessible or not
    fs.access(filepath, fs.F_OK, error => {
        if(!error) {
            // read and and server the file over response
            fs.readFile(filepath, (error, content) => {
                if(!error) {
                    console.log('serving: ', filepath);
                    // resolve the content type
                    let contentType = mimes[path.extname(filepath)]; // mimes['.css'] === 'text/css'
                    // server the file from the buffer 
                    res.writeHead(200, {'Content-type': contentType});
                    res.end(content, 'utf-8');           
                } else {
                    //server a 500
                    res.writeHead(500);
                    res.end('The Server could not read the file requested.');
                }
            });
        } else {
            // server 404
            res.writeHead(404);
            res.end('Content not found!');
        }
    });
    
}

http.createServer(webserver).listen(3000, () => {
    console.log('Webserver running on port 3000');
});
