const express = require('express');
const Downloader = require("nodejs-file-downloader");
var markdownpdf = require("markdown-pdf");
var fs = require("fs");

const app = express();

app.get('/', (req, res) => {
  res.send('Successful response.');
});

app.get('/downloader', async(req, res) => {
    const downloader = new Downloader({
        url: "https://raw.githubusercontent.com/WisdomWolf/curriculum_vitae/gh-pages/README.md", //If the file name already exists, a new file with the name 200MB1.zip is created.
        directory: "./", //This folder will be created, if it doesn't exist.
        cloneFiles: false, //This will cause the downloader to re-write an existing file.
    });
    try {
        downloader.download(); //Downloader.download() returns a promise.
        console.log('Markdown download complete')
    } catch (error) {
        //IMPORTANT: Handle a possible error. An error is thrown in case of network errors, or status codes of 400 and above.
        //Note that if the maxAttempts is set to higher than 1, the error is thrown only if all attempts fail.
        console.log("Download failed", error);
    }
    res.send('Download success')
});


app.get('/download', async(req, res) => {
    const downloader = new Downloader({
        url: "https://raw.githubusercontent.com/WisdomWolf/curriculum_vitae/gh-pages/README.md", //If the file name already exists, a new file with the name 200MB1.zip is created.
        directory: ".", //This folder will be created, if it doesn't exist.
        cloneFiles: false, //This will cause the downloader to re-write an existing file.
    });
    try {
        await downloader.download(); //Downloader.download() returns a promise.
        console.log('Markdown download complete')
        console.log('starting markdown conversion')
        markdownpdf().from("./README.md").to("./resume.pdf", function () {
            const file = `${__dirname}/resume.pdf`;
            res.download(file);
        });
    } catch (error) {
        //IMPORTANT: Handle a possible error. An error is thrown in case of network errors, or status codes of 400 and above.
        //Note that if the maxAttempts is set to higher than 1, the error is thrown only if all attempts fail.
        console.log("Download failed", error);
    }
    // res.send('File downloaded successfully')
});

app.get('/convert', async(req, res) => {
    console.log('starting markdown conversion')
    markdownpdf().from("./README.md").to("./resume.pdf", function () {
        const file = `${__dirname}/resume.pdf`;
        res.download(file);
    });
    console.log('conversion complete')
 });

 app.get('/direct-download', function(req, res) {
    const file = `${__dirname}/resume.pdf`;
    res.download(file);
 });

app.listen(3000, () => console.log('Example app is listening on port 3000.'));