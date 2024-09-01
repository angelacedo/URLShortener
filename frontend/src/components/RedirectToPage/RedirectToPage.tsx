import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { DataResponse, getOriginalUrlFromShortUrl, QueryResponse } from '../../api/data';
import './RedirectToPage.css';

const RedirectToPage = () =>
{
  const { shortUrl } = useParams();

  useEffect(() =>
  {
    const getOriginalURL = async () =>
    {
      if (shortUrl)
      {
        const response: QueryResponse = await getOriginalUrlFromShortUrl(shortUrl);
        console.log(response)
        if (response && response.code === 200)
        {
          const data: DataResponse = response.data[0];
          console.log(data)
          window.location.href = data.originalURL;
        }

      }

    };
    getOriginalURL();
  }, []);
  return (
    <div>
      <p>Loading...</p>
    </div>
  );
};

export default RedirectToPage;
