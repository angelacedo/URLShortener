import { flexRender, getCoreRowModel, Table, useReactTable } from '@tanstack/react-table';
import React, { FC, useEffect, useMemo, useState } from 'react';
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import { ClipLoader } from 'react-spinners';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { DataResponse, getAllUrls, QueryResponse } from '../../api/data';

import { IoCopy, IoCopyOutline } from 'react-icons/io5';
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
  let [color] = useState("var(--primary-color)");
  const [lastPage, setLastPage] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const ROWS_PER_PAGE = 3;

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
    fetchUrls();

    return () => abortController.abort();
  }, []);

  useEffect(() => newUrl ? setUrls((prevUrls) => [...prevUrls, newUrl]) : () => { }, [newUrl]);

  useEffect(() => setLastPage(Math.ceil(urls.length / ROWS_PER_PAGE)), [urls]);

  /* const onDelete = async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) =>
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

  }; */

  const onCopy = (index: number, url: string) =>
  {
    setIconClicked(index);
    navigator.clipboard.writeText(url).then(() =>
    {
      toast.success("URL copiada al portapapeles");
      setTimeout(() => setIconClicked(null), 1500);
    }).catch(() =>
    {
      toast.error("Error al copiar la URL");
      setIconClicked(null);
    });
  };

  const columns = useMemo(
    () => [
      {
        accessorFn: (row: { shortURL: string; }, index: number) => ({ shortURL: row.shortURL, index }),
        id: "post.shortURL",
        header: "ShortURL",
        cell: (info: { getValue: () => { shortURL: string, index: number; }; }) =>
        {

          return (
            <div>
              {isIconClicked === info.getValue().index ? <IoCopy /> : <IoCopyOutline onClick={() => onCopy(info.getValue().index, info.getValue().shortURL)} />}
              <p>{info.getValue().shortURL}</p>
            </div>
          );
        }
      },
      {
        accessorFn: (row: { originalURL: string; }) => row.originalURL,
        id: "post.originalURL",
        header: "OriginalURL",
        cell: (info: { getValue: () => string; }) => info.getValue(),
      },
      {
        accessorFn: (row: { clickCount: number; }) => row.clickCount,
        id: "post.clickCount",
        header: "Count",
        cell: (info: { getValue: () => number; }) => info.getValue(),
      },
      {
        accessorFn: (row: { date: Date; }) => new Date(row.date).toLocaleDateString() + " " + new Date(row.date).toLocaleTimeString(),
        id: "post.date",
        header: "Creation Date",
        cell: (info: { getValue: () => any; }) => info.getValue(),
      },
    ],
    [isIconClicked],
  );

  const data: DataResponse[] = useMemo<DataResponse[]>(
    () => urls.slice((currentPage - 1) * ROWS_PER_PAGE, ((currentPage - 1) * ROWS_PER_PAGE) + ROWS_PER_PAGE), [urls, currentPage]
  );

  const table: Table<DataResponse> = useReactTable<DataResponse>({
    data,
    columns,
    manualPagination: true,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className='tableContainer'>
      <div>
        <select
          name="page-number"
          onChange={(e: React.ChangeEvent<HTMLSelectElement>) => { setCurrentPage(Number(e.target.value)); }}
          value={currentPage}>
          {data.length > 0 ? (() =>
          {
            const pages: JSX.Element[] = [];
            let i: number = 1;
            while (i <= lastPage)
            {
              pages.push(<option key={`page-${i}`}>{i}</option>);
              i++;
            }
            return pages;

          })() : (() => { return <option key="page-0">1</option>; })()}
        </select>
      </div>
      <table className='table'>
        <thead>
          {table.getHeaderGroups().map(headerGroup => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map(header => (
                <th key={header.id} colSpan={header.colSpan}>
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {isFetched && urls.length > 0
            ? table.getRowModel().rows.map((row) => (
              <tr key={row.id}>
                {row.getVisibleCells().map((cell, index) =>
                {
                  return (
                    <td key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        {
                          ...cell.getContext(),
                          index,
                        },

                      )}
                    </td>
                  );
                })}
              </tr>
            ))
            : isFetched && urls.length === 0
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
      <div className="controlButtons">
        <button type="button" onClick={() => setCurrentPage(currentPage > 1 ? currentPage - 1 : currentPage)}><FaArrowLeft /></button>
        <button type="button" onClick={() => setCurrentPage(currentPage < lastPage ? currentPage + 1 : currentPage)}> <FaArrowRight /></button>
      </div>
    </div >

  );
};

export default URLList;
