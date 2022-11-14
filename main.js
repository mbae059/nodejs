const http = require("http");
const fs = require("fs");
const url = require("url");
const qs = require("querystring");

const template = require("./lib/template");
const link = require("./lib/link");
const portNumber = 8000;
// const Display = require("./lib/display");

const app = http.createServer(function (request, response) {
  const requestUrl = request.url;
  const queryData = url.parse(requestUrl, true).query;
  const queryPathName = url.parse(requestUrl, true).pathname;
  if (queryPathName === "/") {
    if (queryData.id === undefined) {
      fs.readdir("content", "utf-8", (err, data) => {
        // let DisplayHome = new Display();
        if (err) throw err;
        const title = "Welcome";
        const description = "Hello, Nodejs";
        const fileList = template.list(data);
        const html = template.html(
          title,
          fileList,
          link.createContent(),
          `<h2>${title}</h2>${description}`
        );
        response.writeHead(200);
        response.end(html);
      });
    } else if (queryData.id) {
      //queryString
      fs.readFile(`content/${queryData.id}`, "utf8", (err, description) => {
        if (err) throw err;
        fs.readdir("content", "utf-8", (err, data) => {
          if (err) throw err;
          let title = queryData.id;
          const fileList = template.list(data);
          let html = template.html(
            title,
            fileList,
            `${link.createContent()}
            ${link.updateContent(title)}
            ${link.deleteContent(title)}
            `,
            `<h2>${title}</h2>${description}`
          );

          response.writeHead(200);
          response.end(html);
        });
      });
    }
  } else if (queryPathName === "/create") {
    fs.readdir("content", "utf-8", (err, data) => {
      if (err) throw err;
      const title = "create";
      const fileList = template.list(data);
      const html = template.html(
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
      response.end(html);
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
        const fileList = template.list(data);
        let html = template.html(
          title,
          fileList,
          `
          ${link.createContent()}  
          ${link.updateContent(title)}
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
        response.end(html);
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
