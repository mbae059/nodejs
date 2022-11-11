const testFolder = "./tests/";
const fs = require("fs");

let files;
fs.readdir(testFolder, (err, files) => {
  for (i in files) {
    console.log(files[i]);
  }
});

for (let i = 0; i < files.length; i++) {
  console.log(files[i]);
}
