const fs=require('fs');
const requestHandler=(req,res)=>{
    const url = req.url;
    const method = req.method;
    
    if(req.url == '/') {
        res.setHeader("Content-Type", "text/html");
        
        res.end(
            `
            <form action="/message" method="POST">
                <label>Name:</label>
                <input type="text" name="username"></input>
                <button type="submit">Add</button>
            </form>
            `
        );
    }
    else {
        if(req.url == '/message') {
            
            res.setHeader('Content-type','text/html');
            
            let body = [];
            req.on('data', (chunks) => {
                console.log(chunks)
                body.push(chunks);
            })
            
            // req.on('end', () => {
            //     let combinedBuffer = Buffer.concat(dataChunks);
            //     console.log(combinedBuffer.toString())
            //     let value = combinedBuffer.toString().split("=");
            //     console.log(value)
            // })
            req.on("end", () => {
                let buffer = Buffer.concat(body);
                
                console.log(buffer);
                
                let formData = buffer.toString();
                console.log(formData);
                
                const formValues = formData.split('=')[1];
                
                fs.writeFile('formValues.txt', formValues, (err) => {
                    
                    res.statusCode = 302; //redirected
                    res.setHeader('Location', '/');
                    res.end();
                });
            });
        }
        else {
            if(req.url == '/read') {
                //read from the file
                
                fs.readFile('formValues.txt', (err, data) => {
                    console.log(data.toString());
                    
                    res.end(`
                        <h1>${data.toString()}</h1>
                    `);
                });
            }
        }
    }
}
const anotherFunction=()=>{
    console.log('This is another function');
}
//module.exports={requestHandler,anotherFunction}
//module.exports={handler:requestHandler,testFunction:anotherFunction};
exports.handler=requestHandler;
exports.testFunction=anotherFunction;