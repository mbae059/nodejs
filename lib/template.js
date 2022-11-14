const template = {
  list: (data) => {
    let fileList = "<ol>";
    for (let i = 0; i < data.length; i++) {
      fileList += `<li><a href="/?id=${data[i]}">${data[i]}</a></li>`;
    }
    fileList = fileList + "</ol>";
    return fileList;
  },
  html: (title, fileList, control, body) => {
    return `<!doctype html>
      <html>
      <head>
        <title>WEB2 - ${title}</title>
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
  },
};

module.exports = template;
