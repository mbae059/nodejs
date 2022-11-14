const fs = require("fs");

class Display {
  #title;
  #description;
  #fileList;
  #html;

  constructor() {
    this.#title = "";
    this.#description = "";
    this.#fileList = "";
    this.#html = "";
  }
  set setTitle(title) {
    this.#title = title;
  }
  get getTitle() {
    return this.#title;
  }
  set setDescription(description) {
    this.#description = description;
  }
  get getDescription() {
    return this.#description;
  }
  set setFileList(fileList) {
    this.#fileList = fileList;
  }
  get getFileList() {
    return this.#fileList;
  }
  set setHtml(html) {
    this.#html = html;
  }
  get getHtml() {
    return this.#html;
  }
}
//     fs.readdir("content", "utf-8", (err, data) => {
//   if (err) throw err;
//   const title = "Welcome";
//   const description = "Hello, Nodejs";
//   const fileList = template.list(data);
//   const html = template.html(
//     title,
//     fileList,
//     link.createContent(),
//     `<h2>${title}</h2>${description}`
//   );
//   response.writeHead(200);
//   response.end(html);
// });

module.exports = Display;
