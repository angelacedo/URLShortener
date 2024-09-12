import { flexRender, getCoreRowModel, getFilteredRowModel, getPaginationRowModel, Table, useReactTable } from '@tanstack/react-table';
import React, { FC, useEffect, useMemo, useState } from 'react';
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import { ClipLoader } from 'react-spinners';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { DataResponse, getAllUrls, QueryResponse } from '../../api/data';

import { IoCopy, IoCopyOutline, IoSearch } from 'react-icons/io5';
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
  const [globalFilter, setGlobalFilter] = useState('');
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 5 });

  useEffect(() =>
  {
    const fetchUrls = async () =>
    {

      const response: QueryResponse = await getAllUrls();
      if (response && response.code === 200)
        setUrls(response.data);
      setIsFetched(true);
    };
    fetchUrls();
  }, []);

  useEffect(() => newUrl ? setUrls((prevUrls) => [...prevUrls, newUrl]) : () => { }, [newUrl]);

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
        accessorFn: (row: { shortURL: string; }) => row.shortURL,
        id: "shortURL",
        header: "ShortURL",
        cell: (info: { row: { index: number; }; getValue: () => string; }) =>
        {
          const shortURL = info.getValue();
          const index = info.row.index;

          return (
            <div>
              {isIconClicked === index ? (
                <IoCopy />
              ) : (
                <IoCopyOutline onClick={() => onCopy(index, shortURL)} />
              )}
              <p>{shortURL}</p>
            </div>
          );
        },
      },
      {
        accessorFn: (row: { originalURL: string; }) => row.originalURL,
        id: "originalURL",
        header: "OriginalURL",
        cell: (info: { getValue: () => string; }) => info.getValue()
      },
      {
        accessorFn: (row: { clickCount: number; }) => row.clickCount,
        id: "clickCount",
        header: "Count",
        cell: (info: { getValue: () => number; }) => info.getValue()
      },
      {
        accessorFn: (row: { date: Date; }) => new Date(row.date).toLocaleDateString() + " " + new Date(row.date).toLocaleTimeString(),
        id: "date",
        header: "Creation Date",
        cell: (info: { getValue: () => any; }) => info.getValue()
      },
    ],
    [isIconClicked],
  );

  const data: DataResponse[] = useMemo<DataResponse[]>(
    () => urls, [urls]
  );

  const table: Table<DataResponse> = useReactTable<DataResponse>({
    data,
    columns,
    state: {
      globalFilter,
      pagination
    },
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  });
  return (
    <div className='tableContainer'>
      <div>
        <IoSearch />
        <input
          value={globalFilter}
          onChange={(e) => setGlobalFilter(e.target.value.toLocaleLowerCase())}
          placeholder="Buscar..."
          className='searchRows'
        />
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
        <button type="button" disabled={!table.getCanPreviousPage()} onClick={() => table.previousPage()} ><FaArrowLeft /></button>
        {data.length > 0 ? (() =>
        {
          console.log(table.getState().pagination.pageIndex)
          const pages: JSX.Element[] = [];
          const pagesButtonsToShow = [0, 1, table.getPageCount() - 2, table.getPageCount() - 1];
          if (table.getPageCount() > 4)
          {
            pages.push(<button type="button" onClick={() => table.setPageIndex(0)} style={{ backgroundColor: table.getState().pagination.pageIndex === 0 ? 'var(--background-color-button)' : 'var(--primary-color)' }}>{1}</button>);

            pages.push(<button type="button" onClick={() => table.setPageIndex(1)} style={{ backgroundColor: table.getState().pagination.pageIndex === 1 ? 'var(--background-color-button)' : 'var(--primary-color)' }}>{2}</button>);
            if (!pagesButtonsToShow.includes(table.getState().pagination.pageIndex))
            {
              pages.push(<button type="button" onClick={() => table.setPageIndex(table.getState().pagination.pageIndex)} style={{ backgroundColor: 'var(--background-color-button)' }}>{table.getState().pagination.pageIndex + 1}</button>);
            }
            pages.push(<p>...</p>);

            pages.push(<button type="button" onClick={() => table.setPageIndex(table.getPageCount() - 2)} style={{ backgroundColor: table.getState().pagination.pageIndex === table.getPageCount() - 2 ? 'var(--background-color-button)' : 'var(--primary-color)' }}>{table.getPageCount() - 1}</button>);

            pages.push(<button type="button" onClick={() => table.setPageIndex(table.getPageCount() - 1)} style={{ backgroundColor: table.getState().pagination.pageIndex === table.getPageCount() - 1 ? 'var(--background-color-button)' : 'var(--primary-color)' }}>{table.getPageCount()}</button>);
          } else
          {
            for (let i = 0; i < table.getPageCount(); i++)
            {
              pages.push(<button type="button" onClick={() => table.setPageIndex(i)} style={{ backgroundColor: table.getState().pagination.pageIndex === i ? 'var(--background-color-button)' : 'var(--primary-color)' }}>{i + 1}</button>);
            }
          }
          return pages;
        })() : (() => { return []; })()
        }
        <button type="button" onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}> <FaArrowRight /></button>
      </div>
    </div >

  );
};

export default URLList;
