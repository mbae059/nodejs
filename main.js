const http = require("http");
const fs = require("fs");
const url = require("url");
const qs = require("querystring");
const portNumber = 8000;
function templateList(data) {
  let fileList = "<ol>";
  for (let i = 0; i < data.length; i++) {
    fileList += `<li><a href="/?id=${data[i]}">${data[i]}</a></li>`;
  }
  fileList = fileList + "</ol>";
  return fileList;
}

function templateHTML(title, fileList, control, body) {
  return `<!doctype html>
  <html>
  <head>
    <title>WEB - ${title}</title>
    <meta charset="utf-8">
  </head>
  <body>
    <h1><a href="/">WEB</a></h1>
    ${fileList}
    ${control}
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
        const description = "Hello, Nodejs";
        const fileList = templateList(data);
        const template = templateHTML(
          title,
          fileList,
          '<a href="/create">create</a>',
          `<h2>${title}</h2>${description}`
        );
        response.writeHead(200);
        response.end(template);
      });
    } else if (queryData.id) {
      //queryString
      fs.readFile(`content/${queryData.id}`, "utf8", (err, description) => {
        if (err) throw err;
        fs.readdir("content", "utf-8", (err, data) => {
          if (err) throw err;
          let title = queryData.id;
          const fileList = templateList(data);
          let template = templateHTML(
            title,
            fileList,
            `<a href="/create">create</a> 
            <a href="/update?id=${title}">update</a>
            <form action="delete_process" method="post">
              <input type="hidden" name="id" value="${title}">
              <input type="submit" value="delete">
            </form>
            `,
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
      const fileList = templateList(data);
      const template = templateHTML(
        title,
        fileList,
        "",
        `<form action="/create_process" method="post">
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
      body += data;
      console.log(data);
    });
    request.on("end", () => {
      const post = qs.parse(body);
      const title = post.title;
      const description = post.description;
      fs.writeFile(`content/${title}`, description, "utf8", (err) => {
        if (err) throw err;
        response.writeHead(302, { Location: `/?id=${title}` });
        response.end();
      });
    });
  } else if (queryPathName === "/update") {
    fs.readFile(`content/${queryData.id}`, "utf8", (err, description) => {
      if (err) throw err;
      fs.readdir("content", "utf-8", (err, data) => {
        if (err) throw err;
        const title = queryData.id;
        const fileList = templateList(data);
        let template = templateHTML(
          title,
          fileList,
          `<a href="/create">create</a> <a href="/update?id=${title}">update</a>`,
          `
          <form action="/update_process" method="post">
            <input type = "hidden" name="id" value = "${title}">
            <p><input type = "text" name ="title" placeholder="title" value="${title}"></p>
            <p>
              <textarea name = "description" placeholder="description">${description}</textarea>
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
    });
  } else if (queryPathName === "/update_process") {
    let body = "";
    request.on("data", (data) => {
      body += data;
      console.log(data);
    });
    request.on("end", () => {
      const post = qs.parse(body);
      const id = post.id;
      const title = post.title;
      const description = post.description;

      fs.rename(`content/${id}`, `content/${title}`, (err) => {
        if (err) throw err;
        fs.writeFile(`content/${title}`, description, "utf8", (err) => {
          if (err) throw err;
          response.writeHead(302, { Location: `/?id=${title}` });
          response.end();
        });
      });
    });
  } else if (queryPathName === "/delete_process") {
    let body = "";
    request.on("data", (data) => {
      body += data;
      console.log(data);
    });
    request.on("end", () => {
      const post = qs.parse(body);
      const id = post.id;

      fs.unlink(`content/${id}`, (err) => {
        if (err) throw err;
        console.log(`${id} is deleted`);
        response.writeHead(302, { Location: `/` });
        response.end();
      });
    });
  } else {
    response.writeHead(404);
    response.end("NOT FOUND");
  }
});
app.listen(portNumber);
