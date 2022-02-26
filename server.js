const express = require('express');
const Downloader = require("nodejs-file-downloader");
const markdownpdf = require("markdown-pdf");
const fs = require("fs");

const app = express();

const source_url = "https://raw.githubusercontent.com/WisdomWolf/curriculum_vitae/gh-pages/README.md"
const pdf_file = `${__dirname}/resume.pdf`;
const md_file = `${__dirname}/README.md`;

app.get('/', (req, res) => {
    res.send('Success!')
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
        markdownpdf().from(md_file).to(pdf_file, function () {
            res.download(pdf_file);
        });
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