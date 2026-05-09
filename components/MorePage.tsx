import React from 'react';

const KAKAO_CHANNEL_ID = '_dxlLCX';

const MorePage: React.FC = () => {
  return (
    <div className="px-5 py-8 space-y-4 animate-fadeIn">
      <h2 className="text-xl font-black text-gray-900 mb-6">더 알아보기</h2>

      {/* 카카오톡 채널 추가 배너 */}
      <button
        onClick={() => window.open(`https://pf.kakao.com/${KAKAO_CHANNEL_ID}/friend`, '_blank')}
        className="w-full rounded-2xl overflow-hidden flex items-center gap-4 px-5 py-5 shadow-sm active:scale-[0.98] transition-all"
        style={{ backgroundColor: '#FEE500' }}
      >
        <div className="w-12 h-12 flex-shrink-0 flex items-center justify-center">
          <svg viewBox="0 0 24 24" className="w-11 h-11" fill="#3C1E1E">
            <path d="M12 3C6.477 3 2 6.477 2 10.8c0 2.7 1.47 5.09 3.75 6.57l-.96 3.56 4.15-2.74C10.26 18.38 11.12 18.5 12 18.5c5.523 0 10-3.477 10-7.7S17.523 3 12 3z"/>
          </svg>
        </div>
        <div className="text-left flex-1">
          <p className="text-base font-black text-[#3C1E1E]">카카오톡 채널 추가하기</p>
          <p className="text-xs text-[#3C1E1E]/65 font-medium mt-0.5">채널 추가하고 소식을 가장 먼저 받아보세요</p>
        </div>
        <i className="fa-solid fa-chevron-right text-[#3C1E1E]/40 text-sm flex-shrink-0"></i>
      </button>

      {/* 이음 홈페이지 배너 */}
      <button
        onClick={() => window.open('https://ieum-society.org', '_blank')}
        className="w-full rounded-2xl overflow-hidden flex items-center gap-4 px-5 py-5 shadow-sm bg-white border border-gray-100 active:scale-[0.98] transition-all"
      >
        <div className="w-12 h-12 flex-shrink-0 bg-ieumAmber/10 rounded-xl flex items-center justify-center">
          <i className="fa-solid fa-earth-asia text-ieumAmber text-xl"></i>
        </div>
        <div className="text-left flex-1">
          <p className="text-base font-black text-gray-900">이음 홈페이지 바로가기</p>
          <p className="text-xs text-gray-400 font-medium mt-0.5">ieum-society.org</p>
        </div>
        <i className="fa-solid fa-chevron-right text-gray-300 text-sm flex-shrink-0"></i>
      </button>
    </div>
  );
};

export default MorePage;
