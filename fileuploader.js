const http = require("http");
const fs = require("fs");
const PORT = process.env.port || 8080;

let progress;

const server = http.createServer( (request, response) =>{
    
    let file = fs.createWriteStream("output.txt");
    let fileSize = request.headers["content-length"];
    let alreadyUploaded = 0;

    request.on("readable", () =>{
        let part = null;

        while ( null !== ( part = request.read() ) ){
            alreadyUploaded += part.length;
            progress = ( alreadyUploaded / fileSize ) * 100;

            response.write(`Progress: ${progress}%\n`);
        }
    });

    request.pipe(file);

    request.on("end", () => response.end("Uploaded!") );

});

async function start() {

    try {
        await server.listen(PORT);
    } catch (e) {
        console.log("An error occured " + e);
        process.exit();
    }

    console.log(`Server listening at: http://localhost:${PORT}`);

};

start();