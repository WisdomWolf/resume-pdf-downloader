const express = require('express');
const path = require('path');
const serverless = require('serverless-http');
const Downloader = require("nodejs-file-downloader");
const { mdToPdf } = require('md-to-pdf');
const fs = require("fs");

const app = express();
const router = express.Router();

const source_url = "https://raw.githubusercontent.com/WisdomWolf/curriculum_vitae/gh-pages/README.md"
const pdf_file = `/tmp/resume.pdf`;
const md_file = `/tmp/README.md`;

router.get('/', (req, res) => {
    res.send('Success!')
});

router.get('/download', async(req, res) => {
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
        directory: `/tmp`,
        cloneFiles: false, //This will cause the downloader to re-write an existing file.
    });
    try {
        await downloader.download();
        console.log('Markdown download complete')
        // markdownpdf().from(md_file).to(pdf_file, function () {
        //     res.download(pdf_file);
        // });
        await mdToPdf({ path: md_file}, { dest: pdf_file });
        res.download(pdf_file);
    } catch (error) {
        console.log("Download failed", error);
    }
    console.log('Conversion completed successfully')
});

app.use('/.netlify/functions/server', router);
app.use('/', (req, res) => res.sendFile(path.join(__dirname, '../index.html')));


module.exports = app;
module.exports.handler = serverless(app);