import React, { FC, useEffect, useState } from 'react';
import { IoCopy, IoCopyOutline } from "react-icons/io5";
import { ClipLoader } from 'react-spinners';
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
  const [isFetched, setIsFetched] = useState(false);
  const [isIconClicked, setIconClicked] = useState<number | null>(null);
  let [color, setColor] = useState("var(--primary-color)");
  useEffect(() =>
  {
    const abortController = new AbortController();
    const fetchUrls = async () =>
    {

      const response: QueryResponse = await getAllUrls(abortController);
      if (response && response.code === 200)
        setUrls(response.data);
      setIsFetched(true);
    };
    console.log(isFetched);
    fetchUrls();
    console.log(isFetched);

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
    console.log(shortURL);
    const index: number | null = Number((e.currentTarget.parentElement?.parentElement?.children[0] as HTMLButtonElement).textContent);
    if (shortURL && index)
    {
      const result: QueryResponse = await deleteUrl(shortURL);
      if (result && result.code === 200 && (result.data[0] as DataResponse).deletedCount > 0)
      {
        setUrls(prevUrls => prevUrls.filter(url => url.shortURL !== shortURL));
        toast.success("HeaderCelle URL " + shortURL + " has been deleted successfully");
      } else
      {
        toast.error("Error deleting " + shortURL);
      }
    }

  };

  const onCopy = (index: number, url: string) =>
  {
    setIconClicked(index);
    navigator.clipboard.writeText(url);
    setTimeout(() => { setIconClicked(null); }, 1500);
  };

  return (
    <table className='table'>
      <thead>
        <tr>
          <th>ShortURL</th>
          <th>OriginalURL</th>
          <th>Count</th>
          <th>Creation Date</th>
        </tr>

      </thead>
      <tbody>
        {isFetched && urls.length > 0
          ? urls.map((reg, index) => (
            <tr>
              <td>
                <div>
                  {isIconClicked == index ? <IoCopy /> : <IoCopyOutline onClick={() => onCopy(index, reg.shortURL)} />}
                  <p>{reg.shortURL}</p>
                </div>
              </td>
              <td>{reg.originalURL}</td>
              <td>{reg.clickCount}</td>
              <td>{new Date(reg.date).toLocaleDateString() + " " +
                new Date(reg.date).toLocaleTimeString()}</td>
            </tr>
          ))
          : isFetched && urls.length == 0
            ? (
              <tr>
                <td colSpan={4}>
                  <p>No registries found</p>
                </td>
              </tr>
            ) : !isFetched ? (
              <tr>
                <td colSpan={4}>
                  <p><ClipLoader
                    color={color}
                    loading={!isFetched}
                    size={10} />
                  </p>
                </td>
              </tr>
            ) : null}
      </tbody>
    </table>
  );
};

export default URLList;
