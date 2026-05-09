import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const FormIndependence: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const script = document.createElement('script');
    script.src = "https://server.fillout.com/embed/v1/";
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return (
    <div className="min-h-screen bg-ieumCream flex flex-col animate-fadeIn pb-20">
      <header className="sticky top-0 bg-ieumCream px-4 py-3 flex items-center shadow-sm">
        <button onClick={() => navigate(-1)} className="p-2">
          <i className="fa-solid fa-chevron-left text-lg text-gray-700"></i>
        </button>
        <h1 className="text-sm font-bold ml-2">참여 신청서</h1>
      </header>
      <div className="flex-1 w-full relative">
        <div 
          style={{ width: '100%', height: '100%' }} 
          data-fillout-id="mEe7ZS9TwBus" 
          data-fillout-embed-type="standard" 
          data-fillout-inherit-parameters 
          data-fillout-dynamic-resize 
          data-fillout-domain="form.trilab.co.kr"
        ></div>
      </div>
    </div>
  );
};

export default FormIndependence;
