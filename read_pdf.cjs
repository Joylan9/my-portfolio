const { PdfReader } = require('pdfreader');
new PdfReader().parseFileItems('Resume(2004).pdf', (err, item) => {
    if (err) console.error(err);
    else if (!item) console.log('Done.');
    else if (item.text) console.log(item.text);
});
