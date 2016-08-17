'use strict'
const fs = require('fs')
const express = require('express')
const bodyParser = require('body-parser')
const handlebars = require('handlebars')
const pdf = require('html-pdf')

const port = 3007
let pdfOptions = { 'format': 'A4', 'border': '1cm' }

let templateFile = './templates/pdf-layout.handlebars'
let templateString = fs.readFileSync(templateFile, 'utf8')
let templateReport = handlebars.compile(templateString)

let app = express()
// Serve the form and other static assets.
app.use(express.static('static'))
// Make sure POSTs have a body.
app.use(bodyParser.urlencoded({ extended: true }))

app.get('/', (req, res) => {
  res.send('hi')
})
app.get('/pdf', (req, res) => {
  res.send('do a POST please')
})
app.post('/pdf', (req, res) => {
  // Expected parameters are report-title and report-content.
  let title = req.body['report-title']
  let content = req.body['report-content']
  let reportInfo = { content: content, title: title }
  let report = templateReport(reportInfo)
  pdf.create(report, pdfOptions).toStream((err, result) => {
    if (err) return console.log(err)
    let body = []; // Store all the chunks of binary data.
    result.on('data', (data) => {
      body.push(data); // Build up an array of Buffers.
    });

    result.on('end', () => {
      res.set('Content-Type', 'application/pdf')
      res.set('X-Filename', 'some.pdf')
      res.end(Buffer.concat(body), 'binary')
    })
  })
})

app.listen(port);
console.log(`Listening on port ${port}`);
