const express = require('express');
const Downloader = require("nodejs-file-downloader");
var markdownpdf = require("markdown-pdf");
var fs = require("fs");

const app = express();

app.get('/', (req, res) => {
  res.send('Successful response.');
});

async function download() {
    
}


app.get('/download', async(req, res) => {
    const downloader = new Downloader({
        url: "https://raw.githubusercontent.com/WisdomWolf/curriculum_vitae/gh-pages/README.md", //If the file name already exists, a new file with the name 200MB1.zip is created.
        directory: "./downloads", //This folder will be created, if it doesn't exist.
        cloneFiles: false, //This will cause the downloader to re-write an existing file.
    });
    try {
        await downloader.download(); //Downloader.download() returns a promise.
        console.log('Markdown download complete')
        fs.createReadStream("./downloads/README.md")
            .pipe(markdownpdf())
            .pipe(fs.createWriteStream("./resume.pdf"));
        console.log('PDF Conversion Complete')
        const file = `${__dirname}/resume.pdf`;
        res.download(file);
        console.log('File download should be happening')
    } catch (error) {
        //IMPORTANT: Handle a possible error. An error is thrown in case of network errors, or status codes of 400 and above.
        //Note that if the maxAttempts is set to higher than 1, the error is thrown only if all attempts fail.
        console.log("Download failed", error);
    }
    // res.send('File downloaded successfully')
});

app.get('/convert', function(req, res) {
    fs.createReadStream("./downloads/README.md")
        .pipe(markdownpdf())
        .pipe(fs.createWriteStream("./resume.pdf"));
    res.send('Converion complete')
 });

 app.get('/direct-download', function(req, res) {
    const file = `${__dirname}/resume.pdf`;
    res.download(file);
 });

app.listen(3000, () => console.log('Example app is listening on port 3000.'));