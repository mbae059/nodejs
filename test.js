const http = require("http");
const fs = require("fs");
const url = require("url");
const app = http.createServer(function (request, response) {
  const requestUrl = request.url;
  const queryData = url.parse(requestUrl, true).query;
  const queryPathName = url.parse(requestUrl, true).pathname;

  let title = queryData.id;

  if (queryPathName === "/") {
    if (queryData.id === undefined) {
      fs.readdir("content", "utf-8", (err, data) => {
        title = "Welcome";
        description = "Hello, Nodejs";
        let fileList = "<ol>";
        for (let i = 0; i < data.length; i++) {
          fileList += `<li><a href="/?id=${data[i]}">${data[i]}</a></li>`;
        }
        fileList = fileList + "</ol>";
        let template = `
      <!doctype html>
        <html>
        <head>
          <title>WEB1 - ${title}</title>
          <meta charset="utf-8">
        </head>
        <body>
          <h1><a href="/">WEB</a></h1>
          ${fileList}
          <h2>${title}</h2>
          <p>${description}</p>
        </body>
        </html> 
      `;
        response.writeHead(200);
        response.end(template);
      });
    } else {
      fs.readFile(`content/${queryData.id}`, "utf8", (err, description) => {
        if (err) throw err;
        fs.readdir("content", "utf-8", (err, data) => {
          if (err) throw err;
          let fileList = "<ol>";
          for (let i = 0; i < data.length; i++) {
            fileList += `<li><a href="/?id=${data[i]}">${data[i]}</a></li>\n`;
          }
          fileList += "</ol>";

          let template = `
        <!doctype html>
          <html>
          <head>
            <title>WEB1 - ${title}</title>
            <meta charset="utf-8">
          </head>
          <body>
            <h1><a href="/">WEB</a></h1>
            ${fileList}
            <h2>${title}</h2>
            <p>${description}</p>
          </body>
          </html> 
        `;
          response.writeHead(200);
          response.end(template);
        });
      });
    }
  } else {
    response.writeHead(404);
    response.end("NOT FOUND");
  }
});
app.listen(8000);
