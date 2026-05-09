
import React from 'react';
import { AppState, ContentItem } from '../types';
import { useContents } from '../hooks/useContents';
import { getImageUrl } from '../lib/imageUrl';
import LoginPrompt from './LoginPrompt';
import { useNavigate } from 'react-router-dom';

const KAKAO_CHANNEL_ID = '_dxlLCX';

interface MyPageProps {
  appState: AppState;
  toggleWishlist: (id: string) => void;
  onLogout: () => void;
  notifications: number;
}

const MyPage: React.FC<MyPageProps> = ({ appState, toggleWishlist, onLogout, notifications }) => {
  const navigate = useNavigate();
  const { contents } = useContents();

  const handleKakaoChannelAdd = () => {
    window.open(`https://pf.kakao.com/${KAKAO_CHANNEL_ID}/friend`, '_blank');
  };

  if (!appState.user) {
    return <LoginPrompt onLoginClick={() => navigate('/login')} />;
  }

  return (
    <div className="px-5 space-y-8 py-4">
      {/* Profile */}
      <div className="flex items-center gap-4">
        <div className="w-16 h-16 bg-ieumAmber/10 rounded-full flex items-center justify-center overflow-hidden border-2 border-ieumAmber/20">
          <i className="fa-solid fa-user text-3xl text-ieumAmber"></i>
        </div>
        <div>
          <h2 className="text-lg font-bold">청년 매칭 유저</h2>
          <p className="text-sm text-gray-500">{appState.user.age}세 · {appState.user.region} 거주 · {appState.user.mbti || 'MBTI 미입력'}</p>
        </div>
        <button 
          onClick={() => navigate('/login')}
          className="ml-auto text-xs font-bold text-ieumAmber bg-ieumAmber/5 px-3 py-1.5 rounded-full border border-ieumAmber/20"
        >
          정보 수정
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 bg-gray-50 rounded-2xl p-5 divide-x divide-gray-200">
        <div className="flex flex-col items-center">
          <span className="text-xs text-gray-500 mb-1">매칭 완료</span>
          <span className="text-lg font-bold">24</span>
        </div>
        <div className="flex flex-col items-center">
          <span className="text-xs text-gray-500 mb-1">찜한 목록</span>
          <span className="text-lg font-bold text-ieumAmber">{appState.wishlist.length}</span>
        </div>
        <div className="flex flex-col items-center">
          <span className="text-xs text-gray-500 mb-1">지원금 알림</span>
          <span className="text-lg font-bold">3</span>
        </div>
      </div>

      {/* My Wishlist */}
      <section>
        <h3 className="text-lg font-bold mb-4">찜한 콘텐츠</h3>
        {appState.wishlist.length === 0 ? (
          <div className="text-center py-10 text-gray-400 bg-gray-50 rounded-2xl">
            <p className="mb-2"><i className="fa-regular fa-heart text-2xl"></i></p>
            <p className="text-sm font-medium">찜한 콘텐츠가 없어요.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4">
            {contents.filter(i => appState.wishlist.includes(i.id)).map(item => (
              <div 
                key={item.id} 
                className="relative aspect-[3/4] bg-gray-100 rounded-xl overflow-hidden group cursor-pointer"
                onClick={() => navigate(`/content/${item.id}`)}
              >
                <img src={getImageUrl(item.imageUrl)} alt={item.title} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex flex-col justify-end p-3">
                  <p className="text-white text-[10px] font-bold">{item.category}</p>
                  <h4 className="text-white text-xs font-bold line-clamp-2">{item.title}</h4>
                </div>
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleWishlist(item.id);
                  }}
                  className="absolute top-2 right-2 w-7 h-7 bg-white rounded-full flex items-center justify-center shadow-md"
                >
                  <i className="fa-solid fa-heart text-ieumAmber text-sm"></i>
                </button>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* 카카오 채널 추가 배너 */}
      <section>
        <button
          onClick={handleKakaoChannelAdd}
          className="w-full rounded-2xl overflow-hidden flex items-center gap-4 px-5 py-4 shadow-sm active:scale-[0.98] transition-all"
          style={{ backgroundColor: '#FEE500' }}
        >
          <div className="w-11 h-11 flex-shrink-0 flex items-center justify-center">
            <svg viewBox="0 0 24 24" className="w-10 h-10" fill="#3C1E1E">
              <path d="M12 3C6.477 3 2 6.477 2 10.8c0 2.7 1.47 5.09 3.75 6.57l-.96 3.56 4.15-2.74C10.26 18.38 11.12 18.5 12 18.5c5.523 0 10-3.477 10-7.7S17.523 3 12 3z"/>
            </svg>
          </div>
          <div className="text-left flex-1">
            <p className="text-sm font-black text-[#3C1E1E]">이음 카카오톡 채널 추가</p>
            <p className="text-xs text-[#3C1E1E]/70 font-medium mt-0.5">채널 추가하고 소식을 가장 먼저 받아보세요</p>
          </div>
          <div className="flex-shrink-0 bg-[#3C1E1E]/10 rounded-full px-3 py-1">
            <span className="text-[11px] font-black text-[#3C1E1E]">추가하기</span>
          </div>
        </button>
      </section>

      {/* Settings Menu */}
      <section className="space-y-1">
        {[
          { 
            icon: 'fa-bell', 
            label: '알림 설정', 
            count: notifications,
            onClick: () => alert('해당 기능은 개발중입니다. 불편을 드려 죄송합니다. 고객님의 편의를 위해 속히 수정하겠습니다.')
          },
          { 
            icon: 'fa-lock', 
            label: '계정 및 보안',
            onClick: () => alert('해당 기능은 개발중입니다. 불편을 드려 죄송합니다. 고객님의 편의를 위해 속히 수정하겠습니다.')
          },
          { icon: 'fa-circle-question', label: '고객 센터' },
          { icon: 'fa-bullhorn', label: '공지사항' },
          { icon: 'fa-right-from-bracket', label: '로그아웃', color: 'text-red-500', onClick: onLogout }
        ].map((menu, idx) => (
          <button 
            key={idx} 
            onClick={menu.onClick}
            className="w-full flex items-center py-4 px-2 hover:bg-gray-50 transition-colors border-b border-gray-50 last:border-none"
          >
            <div className={`w-8 flex items-center justify-center ${menu.color || 'text-gray-400'}`}>
              <i className={`fa-solid ${menu.icon}`}></i>
            </div>
            <span className={`flex-1 text-left text-sm font-medium ${menu.color || 'text-darkText'}`}>{menu.label}</span>
            {menu.count && (
              <span className="bg-red-500 text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center mr-2">{menu.count}</span>
            )}
            <i className="fa-solid fa-chevron-right text-gray-300 text-xs"></i>
          </button>
        ))}
      </section>
    </div>
  );
};

export default MyPage;
