import React, { FC, useEffect, useState } from 'react';
import { FaTrash } from "react-icons/fa";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { DataResponse, deleteUrl, getAllUrls, QueryResponse } from '../../api/data';
import './URLList.css';


interface URLListProps
{
  newUrl?: DataResponse;
}

const URLList: FC<URLListProps> = ({ newUrl }) =>
{
  const [urls, setUrls] = useState<DataResponse[]>([]);
  const [isFetched, setisFetched] = useState(false);
  const abortController = new AbortController();


  useEffect(() =>
  {
    const fetchUrls = async () =>
    {
      const response: QueryResponse = await getAllUrls(abortController);
      if (response && response.code === 200)
      {
        setUrls(response.data);
      }
    };
    if (!isFetched)
    {
      fetchUrls();
      setisFetched(true);
    }
    return () => abortController.abort();
  }, []);

  useEffect(() =>
  {
    if (newUrl)
      setUrls((prevUrls) => [...prevUrls, newUrl]);
  }, [newUrl]);

  const onDelete = async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) =>
  {
    e.preventDefault();
    const shortURL: string | null = (e.currentTarget.parentElement?.parentElement?.children[2].querySelector('a') as HTMLAnchorElement).href;
    console.log(shortURL)
    const index: number | null = Number((e.currentTarget.parentElement?.parentElement?.children[0] as HTMLButtonElement).textContent);
    if (shortURL && index)
    {
      const result: QueryResponse = await deleteUrl(shortURL);
      if (result && result.code == 200 && (result.data[0] as DataResponse).deletedCount > 0)
      {
        setUrls(prevUrls => prevUrls.filter(url => url.shortURL !== shortURL));
        toast.warning("The URL " + shortURL + " has been deleted successfully");
      } else
      {
        toast.error("Error deleting " + shortURL);
      }
    }

  };
  return (

    <table className='table'>
      <thead>
        <tr>
          <th>ID</th>
          <th>Original URL</th>
          <th>Short URL</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {urls ? (
          urls.map((reg, index) =>
          {
            //const date = new Date(reg.date);
            return (
              <tr key={`row-${index + 1}`} id={`row-${index + 1}`}>
                <td>{index + 1}</td>
                <td>{reg.originalURL}</td>
                <td><a href={reg.shortURL}>Ir</a></td>
                <td>
                  <button onClick={(e) => onDelete(e)}><FaTrash color='#ffff' /></button>
                </td>
              </tr>
            );
          })) : (
          <tr>
            <td>No data available</td>
          </tr>
        )}
      </tbody>

    </table>
  );
};

export default URLList;
