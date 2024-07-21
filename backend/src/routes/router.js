const router = require('express').Router();
const urlController = require('../controllers/urlController.js');

router.post('/addurl', urlController.addUrl);
router.get('/getOriginalUrlFromShortUrl/:shortUrl', urlController.getOriginalUrlFromShortUrl);
router.post('/deleteUrl', urlController.deleteUrl);
router.get('/getAllUrls', urlController.getAllUrls);

module.exports = router;