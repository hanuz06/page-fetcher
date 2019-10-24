let userInput = process.argv.slice(2);
const request = require('request');
const fs = require('fs');
const readline = require('readline');
let re = /^((https?|ftp|smtp):\/\/)?(www.)?[a-z0-9]+(\.[a-z]{2,}){1,3}(#?\/?[a-zA-Z0-9#]+)*\/?(\?[a-zA-Z0-9-_]+=[a-zA-Z0-9-%]+&?)?$/;


let fetcher = data => {

  //Checking if the local file path is valid
  if ('./index.html' !== data[1]) {
    let rightPath = [];
    let inputPath = [];
    rightPath = './index.html'.split('');
    inputPath = data[1].split('');
    for (let char in rightPath) {
      if (rightPath[char] !== inputPath[char] || './index.html'.length !== data[1].length) {
        console.log('Please check local file path first');
        return;
      }
    }
  }

  // Validating URL address
  if (!RegExp(re.test(data[0]))) {
    console.log('Please check URL');
    return;
  }

  request(data[0], (error, response, body) => {

    //console.log('error:', error); // Print the error if one occurred
    //console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
    //console.log('body:', body); // Print the HTML for the Google homepage.
    //console.log(response)
    if (error !== null) {
      console.log('Please check URL');
      console.log(error.code);
      return;
    }

    let bytes = response.headers['content-length'];
    let isFileExists = false;


    // Checking if the file exists
    if (fs.existsSync('./index.html')) {
      isFileExists = true;
    } else {
      isFileExists;
    }

    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });

    if (isFileExists) {
      rl.question('The file already exists. Do you want to overwrite it? ', (answer) => {
        // TODO: Log the answer in a database
        if (answer.toLowerCase() === 'yes' || answer.toLowerCase() === 'y') {
          fs.writeFile(data[1], body, 'utf8', err => {
            if (err) throw err;
            console.log(`Overwritten and saved ${bytes} bytes to ./index.html`);
            rl.close();
          });
        } else {
          console.log('Bye Bye');
          rl.close();
        }
      });
    } else {
      fs.writeFile(data[1], body, 'utf8', err => {
        if (err) throw err;
        console.log(`Downloaded and saved ${bytes} bytes to ./index.html`);
        rl.close();
      });
    }

  });
};

fetcher(userInput);

// node fetcher.js http://www.example.com/ ./index.html
// Downloaded and saved 3261 bytes to ./index.html