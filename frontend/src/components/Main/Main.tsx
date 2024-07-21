import URLList from 'components/URLList/URLList';
import React, { FunctionComponent, useState } from 'react';
import { Bounce, toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { addUrl, DataResponse, QueryResponse } from '../../api/data';
import { matchUrl } from '../../utils/regex';
import './Main.css';



const Main: FunctionComponent = () =>
{
  const [newUrL, setNewUrl] = useState<DataResponse | undefined>(undefined);

  const addUrlForm = async (e: React.FormEvent<HTMLFormElement>) =>
  {
    e.preventDefault();
    const originalUrl: string = (e.currentTarget.elements[0] as HTMLInputElement).value;
    if (matchUrl(originalUrl))
    {
      const result: QueryResponse | null = await addUrl(originalUrl);
      if (result && result.code == 200 && result.data)
      {
        const newUrl: DataResponse = result.data[0];
        setNewUrl(newUrl);
        toast.success("URL Successfully added");
      }
      else
        toast.error(result?.errorMessage ?? "Unknown error");
    } else
      toast.error("The string provided is not an URL");

  };


  return (
    <div className="Main">
      <h1>URL Shortener</h1>
      <div className='addUrl'>
        <form onSubmit={(e) => addUrlForm(e)}>
          <input className='input' type="text" placeholder='http(s)://mywebsite.com/page' />
          <input className='button' type="submit" value="Generate Short URL" />
        </form>
      </div>

      <URLList newUrl={newUrL}/>


      <ToastContainer
        position="top-right"
        autoClose={2000}
        hideProgressBar={false}
        newestOnTop={true}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable={false}
        pauseOnHover
        theme="light"
        transition={Bounce} />
    </div>
  );

};

export default Main;
