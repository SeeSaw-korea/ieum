
import React, { useState, useEffect } from 'react';
import { Routes, Route, useNavigate, useLocation, Navigate } from 'react-router-dom';
import { Category, UserProfile, AppState } from './types';
import Onboarding from './components/Onboarding';
import Home from './components/Home';
import CategoryList from './components/CategoryList';
import MorePage from './components/MorePage';
import CategoryDetail from './components/CategoryDetail';
import ContentDetail from './components/ContentDetail';
import SearchPage from './components/SearchPage';
import { useContentById } from './hooks/useContents';
import FormIndependence from './components/FormIndependence';
import FormSoldier from './components/FormSoldier';
import ProjectLetter1 from './components/ProjectLetter1';
import ProjectLetter2 from './components/ProjectLetter2';
import ProjectTest from './components/ProjectTest';
import ProjectRandomBox from './components/ProjectRandomBox';
import TypeTest from './components/TypeTest';

const App: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [appState, setAppState] = useState<AppState>({
    isFirstLogin: false,
    user: null,
    wishlist: []
  });
  const [notifications, setNotifications] = useState<number>(3);

  // Initialize from local storage if exists
  useEffect(() => {
    const saved = localStorage.getItem('moa_app_state');
    if (saved) {
      setAppState(JSON.parse(saved));
    }
  }, []);

  const handleOnboardingComplete = (profile: UserProfile) => {
    const newState = {
      isFirstLogin: false,
      user: profile,
      wishlist: appState.wishlist
    };
    setAppState(newState);
    localStorage.setItem('moa_app_state', JSON.stringify(newState));
    navigate('/');
  };

  const toggleWishlist = (id: string) => {
    setAppState(prev => {
      const isPresent = prev.wishlist.includes(id);
      const newWishlist = isPresent 
        ? prev.wishlist.filter(itemId => itemId !== id)
        : [...prev.wishlist, id];
      const newState = { ...prev, wishlist: newWishlist };
      localStorage.setItem('moa_app_state', JSON.stringify(newState));
      return newState;
    });
  };

  // Determine active tab based on path
  const getActiveTab = () => {
    if (location.pathname === '/') return 'home';
    if (location.pathname.startsWith('/category')) return 'category';
    if (location.pathname === '/more') return 'more';
    return '';
  };

  const activeTab = getActiveTab();

  // Pages that should not show the main layout (header/nav)
  const isFullScreenPage = 
    location.pathname.startsWith('/search') || 
    location.pathname.startsWith('/content') || 
    location.pathname.startsWith('/form-') ||
    location.pathname === '/random-box' ||
    location.pathname === '/type-test' ||
    location.pathname === '/login' || 
    location.pathname === '/signup';

  if (location.pathname === '/login' || location.pathname === '/signup') {
    return <Onboarding onComplete={handleOnboardingComplete} />;
  }

  return (
    <div className="max-w-md mx-auto min-h-screen bg-seeSawCream relative overflow-x-hidden">
      {!isFullScreenPage && (
        <header className="sticky top-0 z-40 bg-seeSawCream/90 backdrop-blur-md px-5 py-4 flex justify-between items-center border-b border-seeSawLight">
          <div className="h-8 flex items-center cursor-pointer" onClick={() => navigate('/')}>
            <img src={`${import.meta.env.BASE_URL}seesaw-logo.png`} alt="SEE-SAW Logo" className="h-10 w-auto object-contain" />
          </div>
          <div className="flex gap-4 items-center">
            <button
              className="relative"
              onClick={() => alert('해당 기능은 개발중입니다. 불편을 드려 죄송합니다. 고객님의 편의를 위해 속히 수정하겠습니다.')}
            >
              <i className="fa-regular fa-bell text-xl"></i>
              {notifications > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-[10px] flex items-center justify-center rounded-full border-2 border-white">
                  {notifications}
                </span>
              )}
            </button>
          </div>
        </header>
      )}

      <main className={`${!isFullScreenPage ? 'pb-20' : ''} animate-fadeIn`}>
        <Routes>
          <Route path="/" element={<Home appState={appState} toggleWishlist={toggleWishlist} setShowOnboarding={() => navigate('/login')} />} />
          <Route path="/category" element={<CategoryList />} />
          <Route path="/category/:id" element={
            <CategoryDetail 
              onBack={() => navigate(-1)}
              onToggleWishlist={toggleWishlist}
              onItemClick={(item) => navigate(`/content/${item.id}`)}
              wishlist={appState.wishlist}
            />
          } />
          <Route path="/content/:id" element={
            <ContentDetailWrapper 
              toggleWishlist={toggleWishlist} 
              wishlist={appState.wishlist} 
            />
          } />
          <Route path="/search" element={
            <SearchPage 
              onBack={() => navigate(-1)}
              onItemClick={(item) => navigate(`/content/${item.id}`)}
            />
          } />
          <Route path="/form-independence" element={<FormIndependence />} />
          <Route path="/form-soldier" element={<FormSoldier />} />
          <Route path="/random-box" element={<ProjectRandomBox />} />
          <Route path="/type-test" element={<TypeTest />} />
          <Route path="/more" element={<MorePage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      
      {!isFullScreenPage && (
        <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md bg-seeSawCream/95 backdrop-blur-md border-t border-seeSawLight px-8 py-3 flex justify-between items-center z-50">
          <button 
            onClick={() => navigate('/')}
            className={`flex flex-col items-center gap-1 transition-colors ${activeTab === 'home' ? 'text-seeSawAmber' : 'text-seeSawMuted'}`}
          >
            <i className={`fa-solid fa-house text-xl`}></i>
            <span className="text-[10px] font-bold">홈</span>
          </button>
          <button
            onClick={() => navigate('/category')}
            className={`flex flex-col items-center gap-1 transition-colors ${activeTab === 'category' ? 'text-seeSawAmber' : 'text-seeSawMuted'}`}
          >
            <i className={`fa-solid fa-layer-group text-xl`}></i>
            <span className="text-[10px] font-bold">카테고리</span>
          </button>
          <button
            onClick={() => navigate('/more')}
            className={`flex flex-col items-center gap-1 transition-colors ${activeTab === 'more' ? 'text-seeSawAmber' : 'text-seeSawMuted'}`}
          >
            <i className={`fa-solid fa-ellipsis text-xl`}></i>
            <span className="text-[10px] font-bold">더 알아보기</span>
          </button>
        </nav>
      )}
    </div>
  );
};

// Helper component to handle ContentDetail with params
import { useParams } from 'react-router-dom';
const ContentDetailWrapper: React.FC<{ toggleWishlist: (id: string) => void, wishlist: string[] }> = ({ toggleWishlist, wishlist }) => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { content: item, loading, error } = useContentById(id || '');

  if (loading) {
    return (
      <div className="min-h-screen bg-seeSawCream flex items-center justify-center">
        <div className="text-center">
          <i className="fa-solid fa-spinner fa-spin text-3xl text-seeSawAmber mb-3"></i>
          <p className="text-gray-600 font-medium">콘텐츠를 불러오는 중...</p>
        </div>
      </div>
    );
  }

  if (error || !item) {
    return (
      <div className="min-h-screen bg-seeSawCream flex items-center justify-center">
        <div className="text-center">
          <i className="fa-solid fa-exclamation-triangle text-3xl text-red-500 mb-3"></i>
          <p className="text-gray-600 font-medium">콘텐츠를 찾을 수 없습니다.</p>
          <button 
            onClick={() => navigate('/')} 
            className="mt-4 px-6 py-2 bg-seeSawAmber text-white rounded-lg hover:bg-[#f49342] transition-colors"
          >
            홈으로 돌아가기
          </button>
        </div>
      </div>
    );
  }

  if (id === 's_proj1') return <ProjectLetter1 onBack={() => navigate(-1)} />;
  if (id === 's_proj2') return <ProjectLetter2 onBack={() => navigate(-1)} />;
  if (id === 's_proj3') return <ProjectTest onBack={() => navigate(-1)} />;

  return (
    <ContentDetail 
      item={item}
      onBack={() => navigate(-1)}
      onToggleWishlist={toggleWishlist}
      isWishlisted={wishlist.includes(item.id)}
    />
  );
};

export default App;
