const http = require("http");
const fs = require("fs");
const url = require("url");
const qs = require("querystring");
const { formatWithOptions } = require("util");
const { title } = require("process");
const portNumber = 8000;
function templateList(data) {
  let fileList = "<ol>";
  for (let i = 0; i < data.length; i++) {
    fileList += `<li><a href="/?id=${data[i]}">${data[i]}</a></li>`;
  }
  fileList = fileList + "</ol>";
  return fileList;
}

function templateHTML(title, fileList, body) {
  return `<!doctype html>
  <html>
  <head>
    <title>WEB - ${title}</title>
    <meta charset="utf-8">
  </head>
  <body>
    <h1><a href="/">WEB</a></h1>
    ${fileList}
    <a href="/create">create</a>
    ${body}
  </body>
  </html> 
`;
}
const app = http.createServer(function (request, response) {
  const requestUrl = request.url;
  const queryData = url.parse(requestUrl, true).query;
  const queryPathName = url.parse(requestUrl, true).pathname;
  if (queryPathName === "/") {
    if (queryData.id === undefined) {
      fs.readdir("content", "utf-8", (err, data) => {
        if (err) throw err;
        const title = "Welcome";
        description = "Hello, Nodejs";
        let fileList = templateList(data);
        let template = templateHTML(
          title,
          fileList,
          `<h2>${title}</h2>${description}`
        );
        response.writeHead(200);
        response.end(template);
      });
    } else {
      //queryString
      fs.readFile(`content/${queryData.id}`, "utf8", (err, description) => {
        if (err) throw err;
        fs.readdir("content", "utf-8", (err, data) => {
          if (err) throw err;
          let title = queryData.id;
          fileList = templateList(data);
          let template = templateHTML(
            title,
            fileList,
            `<h2>${title}</h2>${description}`
          );

          response.writeHead(200);
          response.end(template);
        });
      });
    }
  } else if (queryPathName === "/create") {
    fs.readdir("content", "utf-8", (err, data) => {
      if (err) throw err;
      const title = "create";
      let fileList = templateList(data);
      let template = templateHTML(
        title,
        fileList,
        `<form action="http://localhost:${portNumber}/create_process" method="post">
        <p><input type = "text" name ="title" placeholder="title"></p>
        <p>
          <textarea name = "description" placeholder="description"></textarea>
        </p>
        <p>
          <input type="submit">
        </p>
        </form>
        `
      );
      response.writeHead(200);
      response.end(template);
    });
  } else if (queryPathName === "/create_process") {
    let body = "";
    request.on("data", (data) => {
      //get title and description via textarea
      body += data;
    });

    response.on("finish", () => {
      const parseBody = qs.parse(body);
      const titleReceivedByPost = parseBody.title;
      const descriptionReceivedByPost = parseBody.description;
      console.log(titleReceivedByPost);
      fs.writeFile(
        `content/${titleReceivedByPost}`,
        descriptionReceivedByPost,
        "utf8",
        (err) => {
          if (err) throw err;
          console.log("This file has been saved!");
          response.writeHead(302, { Location: `/?id=${titleReceivedByPost}` });
          response.end();
        }
      );
    });
  } else {
    response.writeHead(404);
    response.end("NOT FOUND");
  }
});
app.listen(portNumber);
