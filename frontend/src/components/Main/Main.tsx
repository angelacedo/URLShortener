import TopMenu from 'components/TopMenu/TopMenu';
import URLList from 'components/URLList/URLList';
import React, { FunctionComponent, useState } from 'react';
import { IoMdLink } from "react-icons/io";
import { Bounce, toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { addUrl, DataResponse, QueryResponse } from '../../api/data';
import { matchUrl } from '../../utils/regex';
import './Main.css';



const Main: FunctionComponent = () =>
{
  const [newUrL, setNewUrl] = useState<DataResponse | undefined>(undefined);
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const addUrlForm = async (e: React.FormEvent<HTMLFormElement>) =>
  {
    e.preventDefault();
    setIsButtonDisabled(true);
    const originalUrl: string = (e.currentTarget.elements[0] as HTMLInputElement).value.trim().toLowerCase();
    if (matchUrl(originalUrl))
    {
      const result: QueryResponse | null = await addUrl(originalUrl);
      if (result && result.code === 200 && result.data)
      {
        const newUrl: DataResponse = result.data[0];
        setNewUrl(newUrl);
        toast.success("URL Successfully added");
      }
      else
        toast.error(result?.errorMessage ?? "Unknown error");
    } else
      toast.error("The string provided is not an URL");

    setIsButtonDisabled(false);
  };


  return (
    <div className="Main">
      <TopMenu/>
      <div>
        <h1>Shrink Those Streeeetched Out Links</h1>
        <div>
          <p>Linkify is a quick and user-friendly URL shortener that simplifies your online journey</p>
          <div className='addUrl'>
            <form onSubmit={(e) => addUrlForm(e)}>
              <IoMdLink />
              <input className='input' name='text' type="text" placeholder='Enter the URL to be shorted' />
              <input className='button' type="submit" disabled={isButtonDisabled} value="Shorten URL" />
            </form>
          </div>
        </div>
        <URLList newUrl={newUrL} />
      </div>


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
        className="toast"
        transition={Bounce} />
    </div>
  );

};

export default Main;
