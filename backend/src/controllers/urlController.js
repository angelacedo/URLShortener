const db = require('../utils/db.js');
const regex = require('../utils/regex.js');
const urls = require('../utils/urls.js');
const config = require('../config/env.js');
const URLModel = require('../models/Url.js');

const addUrl = async (req, res) =>
{
    const urlOriginal = req.body.urlOriginal;

    if (urlOriginal != null && regex.matchUrl(urlOriginal))
    {
        const connection = await db.connect();
        if (connection)
        {
            const shortUrl = await urls.urlGenerator();
            const urlModel = new URLModel({
                originalURL: urlOriginal,
                shortURL: config.clientUrl + shortUrl,
                clickCount: 0
            });
            const result = await db.addUrl(urlModel);
            await db.disconnect(connection);
            return res.status(result.code).send(result);
        } else
        {
            return res.status(500).send({
                code: 500,
                errorMessage: "Error: An error has ocurred while connecting to database",
                data: null
            });
        }


    } else
    {
        console.log(urlOriginal);
        return res.status(500).send({
            code: 500,
            errorMessage: "Error: Invalid URL",
            data: null
        });
    }
};

const deleteUrl = async (req, res) =>
{
    const shortUrl = req.body.shortUrl;
    console.log(shortUrl);
    if (shortUrl)
    {
        const connection = await db.connect();
        if (connection)
        {
            const result = await db.deleteUrl(shortUrl);
            db.disconnect(connection);
            return res.status(result.code).send(result);
        } else
        {
            return res.status(500).send({
                code: 500,
                errorMessage: "Error: An error has ocurred while connecting to database",
                data: null
            });
        }

    } else
    {
        return res.status(500).send({
            code: 500,
            errorMessage: "Error: Invalid Short URL",
            data: null
        });
    }

};

const getAllUrls = async (req, res) =>
{

    try
    {
        const connection = await db.connect();
        if (connection)
        {
            const result = await db.getAllUrls();
            db.disconnect(connection);
            return res.status(result.code).send(result);
        } else
        {
            return res.status(500).send({
                code: 500,
                errorMessage: "Error: An error has ocurred while connecting to database",
                data: null
            });
        }

    } catch (e)
    {
        console.log(e);
        return res.status(500).send({
            code: 500,
            errorMessage: "Error: " + e.message,
            data: null
        });
    }


};

const getOriginalUrlFromShortUrl = async (req, res) =>
{
    const shortUrl = req.params.shortUrl;
    console.log(config.clientUrl + shortUrl)
    try
    {
        if (shortUrl)
        {
            const connection = await db.connect();
            if (connection)
            {
                const result = await db.getOriginalUrlFromShortUrl(config.clientUrl + shortUrl);
                console.log(result)
                db.disconnect(connection);
                return res.status(result.code).send(result);
            } else
            {
                return res.status(500).send({
                    code: 500,
                    errorMessage: "Error: An error has ocurred while connecting to database",
                    data: null
                });
            }
        } else
        {
            return res.status(500).send({
                code: 500,
                errorMessage: "Error: Invalid ShortUrl",
                data: null
            });
        }


    } catch (e)
    {
        return res.status(500).send({
            code: 500,
            errorMessage: "Error: " + e.message,
            data: null
        });
    }


};
module.exports = { addUrl, deleteUrl, getAllUrls, getOriginalUrlFromShortUrl };