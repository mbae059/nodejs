const http = require("http");
const fs = require("fs");
const url = require("url");
const app = http.createServer(function (request, response) {
  const requestUrl = request.url;
  console.log(requestUrl);
  const queryData = url.parse(requestUrl, true).query;
  let title = queryData.id;
  if (requestUrl == "/") {
    title = "Homepage";
  }
  if (requestUrl == "/favicon.ico") {
    response.writeHead(404);
    response.end();
    return;
  }
  response.writeHead(200);
  fs.readFile(`content/${queryData.id}`, "utf8", (err, description) => {
    if (err) throw err;
    let template = `
    <!doctype html>
      <html>
      <head>
        <title>WEB1 - ${title}</title>
        <meta charset="utf-8">
      </head>
      <body>
        <h1><a href="/">WEB</a></h1>
        <ol>
          <li><a href="/?id=HTML">HTML</a></li>
          <li><a href="/?id=CSS">CSS</a></li>
          <li><a href="/?id=JavaScript">JavaScript</a></li>
        </ol>
        <h2>${title}</h2>
        <p>${description}</p>
      </body>
      </html> 
    `;
    response.end(template);
  });
});
app.listen(8000);
