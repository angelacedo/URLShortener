import config from '../configs/server';
interface QueryResponse
{
    code: number,
    errorMessage: string;
    data: DataResponse[];
}

interface DataResponse
{
    _id: string;
    originalURL: string,
    shortURL: string,
    date: Date;
    deletedCount: number;
}

const addUrl = async (urlOriginal: string): Promise<QueryResponse> =>
{
    const response = await fetch(config.serverUrl + "addUrl", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        mode: 'cors',
        body: JSON.stringify({ urlOriginal })
    }
    );
    const data: QueryResponse = await response.json();
    console.log(data);
    return data;
};

const getAllUrls = async (abortController: AbortController): Promise<QueryResponse> =>
{
    const response = await fetch(config.serverUrl + "getAllUrls", {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
        mode: 'cors',
        signal: abortController.signal
    }
    );

    const data: QueryResponse = await response.json();
    return data;

};


const deleteUrl = async (shortURL: string): Promise<QueryResponse> =>
{
    const response = await fetch(config.serverUrl + "deleteUrl", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        mode: 'cors',
        body: JSON.stringify({ shortUrl: shortURL })
    }
    );

    var data: QueryResponse = await response.json();
    return data;

};


const getOriginalUrlFromShortUrl = async (shortURL: string): Promise<QueryResponse> =>
{
    const response = await fetch(config.serverUrl + "getOriginalUrlFromShortUrl/" + shortURL, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
        mode: 'cors'
    }
    );

    var data: QueryResponse = await response.json();
    return data;

};

export { DataResponse, QueryResponse, addUrl, deleteUrl, getAllUrls, getOriginalUrlFromShortUrl };
