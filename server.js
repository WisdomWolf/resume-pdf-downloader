const express = require('express');
const Downloader = require("nodejs-file-downloader");
const { mdToPdf } = require('md-to-pdf');
const fs = require("fs");

const app = express();

const source_url = "https://raw.githubusercontent.com/WisdomWolf/curriculum_vitae/gh-pages/README.md"
const pdf_file = `/tmp/resume.pdf`;
const md_file = `/tmp/README.md`;

app.get('/', (req, res) => {
    res.send('Go to /download')
});

app.get('/download', async(req, res) => {
    let url;
    if (req.query.url) {
        url = req.query.url;
        console.log('received url: ' + url);
    } else {
        url = source_url;
    }
    console.log('url: ' + url);
    const downloader = new Downloader({
        url: url,
        directory: `${__dirname}`,
        cloneFiles: false, //This will cause the downloader to re-write an existing file.
    });
    try {
        await downloader.download();
        console.log('Markdown download complete')
        await mdToPdf({ path: md_file}, { dest: pdf_file });
        res.download(pdf_file);
    } catch (error) {
        console.log("Download failed", error);
    }
    console.log('Conversion completed successfully')
});

app.get('*', (req, res) => {
    res.send('Fallback Reached')
});
let port = process.env.PORT;
if (port == null || port == "") {
  port = 3000;
}
app.listen(port, () => console.log('App is listening on port ' + port));