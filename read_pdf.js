import fs from 'fs';
import pdf from 'pdf-parse/lib/pdf-parse.js';

let dataBuffer = fs.readFileSync('Resume(2004).pdf');

pdf(dataBuffer).then(function (data) {
    console.log(data.text);
}).catch(function (err) {
    console.error(err);
});
