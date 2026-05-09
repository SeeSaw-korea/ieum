
import React from 'react';

interface LoginPromptProps {
  onLoginClick: () => void;
}

const LoginPrompt: React.FC<LoginPromptProps> = ({ onLoginClick }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] px-8 animate-fadeIn">
      {/* Logo & Title */}
      <div className="text-center mb-10">
        <div className="flex justify-center mb-2">
          <img src={`${import.meta.env.BASE_URL}ieum-logo.png`} alt="IEUM Logo" className="h-12 w-auto object-contain" />
        </div>
        <h2 className="text-2xl font-bold text-darkText leading-tight">
          IEUM는 <br />
          청년 삼 질문과 <span className="text-ieumAmber">연결</span>
        </h2>
      </div>

      {/* Illustration Placeholder */}
      <div className="relative w-64 h-64 mb-12 flex items-center justify-center">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-ieumLight rounded-full blur-3xl opacity-50"></div>
        
        {/* Stylized Boxes mimicking the image */}
        <div className="relative z-10">
          <div className="w-32 h-20 bg-ieumLight/60 rounded-lg shadow-sm border border-ieumAmber/20 flex items-center justify-center transform -rotate-6 translate-x-4 -translate-y-4">
            <img src={`${import.meta.env.BASE_URL}ieum-logo.png`} alt="IEUM Logo" className="h-6 w-auto object-contain opacity-80" />
          </div>
          <div className="w-32 h-20 bg-white rounded-lg shadow-md border border-ieumLight flex items-center justify-center absolute top-4 left-0">
            <img src={`${import.meta.env.BASE_URL}ieum-logo.png`} alt="IEUM Logo" className="h-6 w-auto object-contain" />
          </div>
          <div className="absolute -top-6 -left-4 bg-red-400 text-white text-[10px] font-bold px-3 py-1 rounded-full shadow-lg transform -rotate-12">
            MATCHING
          </div>
          
          {/* Decorative elements */}
          <div className="absolute top-0 -right-8 w-4 h-4 bg-green-200 rounded-sm rotate-45"></div>
          <div className="absolute bottom-4 -left-8 w-3 h-3 bg-pink-200 rounded-full"></div>
          <div className="absolute bottom-0 right-0 w-5 h-5 bg-blue-200/50 rounded-sm rotate-12"></div>
        </div>
      </div>

      {/* Main Login Button (Kakao Style) */}
      <button 
        onClick={onLoginClick}
        className="w-full bg-[#FEE500] hover:bg-[#FEE500]/90 text-black font-bold py-4 rounded-xl flex items-center justify-center gap-3 mb-8 transition-all active:scale-95 shadow-sm"
      >
        <i className="fa-solid fa-comment text-xl"></i>
        <span>카카오로 3초 만에 시작하기</span>
      </button>

      {/* Social Login Icons */}
      <div className="flex gap-6 mb-10">
        <button className="w-12 h-12 bg-[#03C75A] text-white rounded-full flex items-center justify-center text-xl shadow-sm hover:opacity-90 transition-opacity">
          <span className="font-black">N</span>
        </button>
        <button className="w-12 h-12 bg-black text-white rounded-full flex items-center justify-center text-xl shadow-sm hover:opacity-90 transition-opacity">
          <i className="fa-brands fa-apple"></i>
        </button>
        <button className="w-12 h-12 bg-[#1877F2] text-white rounded-full flex items-center justify-center text-xl shadow-sm hover:opacity-90 transition-opacity">
          <i className="fa-brands fa-facebook-f"></i>
        </button>
        <button className="w-12 h-12 bg-[#6B7280] text-white rounded-full flex items-center justify-center text-xl shadow-sm hover:opacity-90 transition-opacity">
          <i className="fa-regular fa-envelope"></i>
        </button>
      </div>

      {/* Footer Link */}
      <button 
        onClick={onLoginClick}
        className="text-gray-400 text-sm font-medium underline underline-offset-4 hover:text-gray-600 transition-colors"
      >
        이메일로 로그인하기
      </button>
    </div>
  );
};

export default LoginPrompt;
