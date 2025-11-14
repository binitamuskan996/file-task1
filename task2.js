const http = require('http');
const fs = require('fs');

const server = http.createServer((req, res) => {
    const url = req.url;
    const method = req.method;
    
    if(url === '/' && method === 'GET') {
        fs.readFile('message.txt', 'utf8', (err, data) => {
            let messagesHTML = '';
            
            if(!err && data) {
                const messages = data.split('\n').filter(msg => msg.trim() !== '');
                messagesHTML = messages.map(msg => {
                    return `<p>${decodeURIComponent(msg)}</p>`;
                }).join('');
            }
            
            res.setHeader('Content-Type', 'text/html');
            res.end(`
                <!DOCTYPE html>
                <html>
                <head>
                    <title>Chat App</title>
                </head>
                <body>
                    <h2>Messages:</h2>
                    <div id="messages">
                        ${messagesHTML}
                    </div>
                    <hr>
                    <form action="/message" method="POST">
                        <input type="text" name="message" placeholder="Enter your message" required>
                        <button type="submit">Send</button>
                    </form>
                </body>
                </html>
            `);
        });
    }
    else if(url === '/message' && method === 'POST') {
        let body = [];
        
        req.on('data', (chunk) => {
            body.push(chunk);
        });
        
        req.on('end', () => {
            const buffer = Buffer.concat(body);
            const message = buffer.toString().split('=')[1];
            
            fs.readFile('message.txt', 'utf8', (err, data) => {
                const newMessage = (data || '') + message + '\n';
                
                fs.writeFile('message.txt', newMessage, (err) => {
                    res.statusCode = 302;
                    res.setHeader('Location', '/');
                    res.end();
                });
            });
        });
    }
    else {
        res.statusCode = 404;
        res.setHeader('Content-Type', 'text/html');
        res.end('<h1>Page Not Found</h1>');
    }
});

server.listen(3000, () => {
    console.log('Server is running on port 3000');
});