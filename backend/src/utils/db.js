const mongoose = require("mongoose");
const config = require('../config/env.js');
const URLModel = require('../models/Url.js');

const connect = async () =>
{
    try
    {
        const client = await mongoose.connect(config.MONGODB_URI, {
            serverSelectionTimeoutMS: 5000
        });
        console.log("Successfully connected");
        return client;
    } catch (e)
    {
        console.log("Error during database connection: " + e);
        return null;
    }


};

const disconnect = async (connection) =>
{
    connection.disconnect()
        .then(() =>
        {
            console.log("Successfully disconnected");
        }).catch((e) =>
        {
            console.log("Error closing database connection: " + e);
        });
};

const addUrl = async (urlModel) =>
{
    let response;
    try
    {
        const result = await urlModel.save();
        response = {
            code: 200,
            errorMessage: null,
            data: [result]
        };
    } catch (e)
    {
        response = {
            code: e.code || 500,
            errorMessage: "Error adding registry to database: " + e.message,
            data: null
        };
    }
    return response;

};

const getOriginalUrlFromShortUrl = async (shortUrl) =>
{
    let response;
    try
    {
        const result = await URLModel.findOne({ shortURL: shortUrl });
        if (!result)
            throw new Error("Short URL Not found");
        else
            response = {
                code: 200,
                errorMessage: null,
                data: [result]
            };
    } catch (e)
    {
        response = {
            code: e.message == "Short URL Not found" ? 404 : e.code,
            errorMessage: "Error searching registry to database: " + e.message,
            data: []
        };

    }
    return response;
};



const deleteUrl = async (shortURL) =>
{
    let response;
    try
    {
        const result = await URLModel.deleteOne({ shortURL: shortURL });
        if (result.deletedCount == 0)
            throw new Error("Short URL Not found");
        else
            response = {
                code: 200,
                errorMessage: null,
                data: [result]
            };
    } catch (e)
    {
        response = {
            code: e.message == "Short URL Not found" ? 404 : e.code,
            errorMessage: "Error deleting registry from database: " + e.message,
            data: []
        };
    }
    return response;
};

const getAllUrls = async () =>
{
    let response;
    try
    {
        const result = await URLModel.find({});
        if (!result)
            throw new Error("An error has ocurred");
        else
            response = {
                code: 200,
                errorMessage: null,
                data: result
            };
            console.log(response.code)
            return response;
    } catch (e)
    {
        response = {
            code: (e.message == "An error has ocurred" ? 404 : e.code) ?? 500,
            errorMessage: "Error searching registry to database: " + e.message,
            data: null
        };
        return response;

    }

};

const checkIfShortURLExist = async (shortURL) =>
{
    const result = await URLModel.findOne({ shortURL: shortURL });
    let exists;
    result ? exists = true : exists = false;
    return exists;
};

module.exports = { connect, disconnect, addUrl, getOriginalUrlFromShortUrl, deleteUrl, getAllUrls, checkIfShortURLExist };