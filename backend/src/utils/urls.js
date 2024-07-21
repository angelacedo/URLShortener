const db = require('../utils/db.js');

const urlGenerator = async () =>
{
    let shortURL, exist = true;
    while (exist)
    {
        shortURL = Date.now().toString(36);
        console.log(shortURL)
        exist = await db.checkIfShortURLExist(shortURL);
    }
    return shortURL;


};

module.exports = { urlGenerator };