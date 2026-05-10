
import React, { useState, useEffect, useRef } from 'react';
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
import ProjectMinwon from './components/ProjectMinwon';
import AboutPage from './components/AboutPage';

/* ── 드롭다운 메뉴 정의 ── */
const NAV_ITEMS = [
  { label: '홈', path: '/' },
  {
    label: 'About Us',
    children: [
      { label: '인사말', path: '/about/greeting' },
      { label: 'IEUM 소개', path: '/about/intro' },
      { label: '연혁', path: '/about/history' },
      { label: '조직도', path: '/about/organization' },
    ],
  },
  {
    label: '프로그램',
    children: [
      { label: '프로젝트', path: `/category/${Category.PROJECTS}` },
      { label: '세미나', path: `/category/${Category.SEMINARS}` },
      { label: '캠페인', path: `/category/${Category.CAMPAIGNS}` },
    ],
  },
  {
    label: '소식',
    children: [
      { label: '인터뷰', path: `/category/${Category.INTERVIEWS}` },
      { label: '에세이/칼럼', path: `/category/${Category.ESSAYS}` },
      { label: '인사이트', path: `/category/${Category.INSIGHTS}` },
    ],
  },
];

/* ── 데스크탑 드롭다운 아이템 ── */
const DropdownItem: React.FC<{
  item: typeof NAV_ITEMS[number];
  currentPath: string;
  onNavigate: (path: string) => void;
}> = ({ item, currentPath, onNavigate }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const isActive = item.path
    ? currentPath === item.path
    : item.children?.some(c => currentPath.startsWith(c.path));

  const handleMouseEnter = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setOpen(true);
  };
  const handleMouseLeave = () => {
    timerRef.current = setTimeout(() => setOpen(false), 120);
  };

  if (!item.children) {
    return (
      <button
        onClick={() => onNavigate(item.path!)}
        className={`text-sm font-semibold transition-colors px-1 ${isActive ? 'text-ieumOrange' : 'text-ieumDark hover:text-ieumOrange'}`}
      >
        {item.label}
      </button>
    );
  }

  return (
    <div ref={ref} className="relative" onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
      <button className={`text-sm font-semibold transition-colors flex items-center gap-1 px-1 ${isActive ? 'text-ieumOrange' : 'text-ieumDark hover:text-ieumOrange'}`}>
        {item.label}
        <i className={`fa-solid fa-chevron-down text-[10px] transition-transform ${open ? 'rotate-180' : ''}`}></i>
      </button>
      {open && (
        <div className="absolute top-full left-0 mt-2 bg-white border border-ieumBorder rounded-xl shadow-lg py-1.5 min-w-[140px] z-50">
          {item.children.map(child => (
            <button
              key={child.path}
              onClick={() => { onNavigate(child.path); setOpen(false); }}
              className={`w-full text-left px-4 py-2.5 text-sm transition-colors ${
                currentPath === child.path || currentPath.startsWith(child.path)
                  ? 'text-ieumOrange font-bold bg-ieumOrange/5'
                  : 'text-ieumDark hover:bg-ieumCream hover:text-ieumOrange font-medium'
              }`}
            >
              {child.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

/* ── 앱 본체 ── */
const App: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [appState, setAppState] = useState<AppState>({
    isFirstLogin: false,
    user: null,
    wishlist: []
  });
  const [notifications] = useState<number>(3);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileOpenGroup, setMobileOpenGroup] = useState<string | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem('moa_app_state');
    if (saved) setAppState(JSON.parse(saved));
  }, []);

  useEffect(() => {
    setMobileMenuOpen(false);
    setMobileOpenGroup(null);
  }, [location.pathname]);

  const handleOnboardingComplete = (profile: UserProfile) => {
    const newState = { isFirstLogin: false, user: profile, wishlist: appState.wishlist };
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

  const getActiveTab = () => {
    if (location.pathname === '/') return 'home';
    if (location.pathname.startsWith('/category')) return 'category';
    if (location.pathname.startsWith('/about')) return 'about';
    if (location.pathname === '/more') return 'more';
    return '';
  };
  const activeTab = getActiveTab();

  const isFullScreenPage =
    location.pathname.startsWith('/search') ||
    location.pathname.startsWith('/content') ||
    location.pathname.startsWith('/form-') ||
    location.pathname === '/random-box' ||
    location.pathname === '/type-test' ||
    location.pathname.startsWith('/project-minwon') ||
    location.pathname === '/login' ||
    location.pathname === '/signup';

  if (location.pathname === '/login' || location.pathname === '/signup') {
    return <Onboarding onComplete={handleOnboardingComplete} />;
  }

  return (
    <div className="min-h-screen bg-ieumCream">
      {!isFullScreenPage && (
        <header className="sticky top-0 z-50 bg-white border-b border-ieumBorder shadow-sm">
          <div className="max-w-5xl mx-auto px-5 h-16 flex items-center justify-between">

            {/* 로고 */}
            <div className="flex items-center cursor-pointer" onClick={() => navigate('/')}>
              <img src={`${import.meta.env.BASE_URL}ieum-logo.png`} alt="IEUM Logo" className="h-10 w-auto object-contain" />
            </div>

            {/* 데스크탑 드롭다운 네비 */}
            <nav className="hidden md:flex items-center gap-7">
              {NAV_ITEMS.map(item => (
                <DropdownItem
                  key={item.label}
                  item={item}
                  currentPath={location.pathname}
                  onNavigate={navigate}
                />
              ))}
            </nav>

            {/* 데스크탑 우측 버튼 */}
            <div className="hidden md:flex items-center gap-3">
              <button
                onClick={() => navigate('/search')}
                className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-ieumCream transition-colors"
              >
                <i className="fa-solid fa-magnifying-glass text-ieumDark text-sm"></i>
              </button>
              <button
                onClick={() => navigate(`/category/${Category.PROJECTS}`)}
                className="bg-ieumOrange text-white text-sm font-bold px-4 py-2 rounded-lg hover:bg-ieumGold transition-colors"
              >
                활동 참여하기
              </button>
            </div>

            {/* 모바일 우측 */}
            <div className="flex md:hidden items-center gap-2">
              <button onClick={() => navigate('/search')} className="w-9 h-9 flex items-center justify-center">
                <i className="fa-solid fa-magnifying-glass text-ieumDark text-base"></i>
              </button>
              <button className="relative w-9 h-9 flex items-center justify-center" onClick={() => alert('해당 기능은 개발중입니다.')}>
                <i className="fa-regular fa-bell text-ieumDark text-base"></i>
                {notifications > 0 && (
                  <span className="absolute top-1 right-1 w-3 h-3 bg-ieumOrange text-white text-[8px] flex items-center justify-center rounded-full">{notifications}</span>
                )}
              </button>
              <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="w-9 h-9 flex items-center justify-center">
                <i className={`fa-solid ${mobileMenuOpen ? 'fa-xmark' : 'fa-bars'} text-ieumDark text-base`}></i>
              </button>
            </div>
          </div>

          {/* 모바일 드롭다운 메뉴 */}
          {mobileMenuOpen && (
            <div className="md:hidden bg-white border-t border-ieumBorder">
              {NAV_ITEMS.map(item => (
                <div key={item.label}>
                  {!item.children ? (
                    <button
                      onClick={() => navigate(item.path!)}
                      className="w-full text-left px-5 py-3.5 text-sm font-semibold text-ieumDark border-b border-ieumBorder/50"
                    >
                      {item.label}
                    </button>
                  ) : (
                    <div>
                      <button
                        onClick={() => setMobileOpenGroup(mobileOpenGroup === item.label ? null : item.label)}
                        className="w-full text-left px-5 py-3.5 text-sm font-semibold text-ieumDark border-b border-ieumBorder/50 flex justify-between items-center"
                      >
                        {item.label}
                        <i className={`fa-solid fa-chevron-down text-[10px] text-ieumMuted transition-transform ${mobileOpenGroup === item.label ? 'rotate-180' : ''}`}></i>
                      </button>
                      {mobileOpenGroup === item.label && (
                        <div className="bg-ieumCream border-b border-ieumBorder">
                          {item.children.map(child => (
                            <button
                              key={child.path}
                              onClick={() => navigate(child.path)}
                              className="w-full text-left px-8 py-3 text-sm text-ieumMuted hover:text-ieumOrange font-medium border-b border-ieumBorder/30 last:border-0"
                            >
                              {child.label}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
              <div className="px-5 py-4">
                <button
                  onClick={() => navigate(`/category/${Category.PROJECTS}`)}
                  className="w-full bg-ieumOrange text-white text-sm font-bold py-3 rounded-xl"
                >
                  활동 참여하기
                </button>
              </div>
            </div>
          )}
        </header>
      )}

      <main className={`${!isFullScreenPage ? 'md:pb-0 pb-20' : ''} animate-fadeIn`}>
        <Routes>
          <Route path="/" element={<Home appState={appState} toggleWishlist={toggleWishlist} setShowOnboarding={() => navigate('/login')} />} />
          <Route path="/about/:section" element={<AboutPage />} />
          <Route path="/about" element={<Navigate to="/about/intro" replace />} />
          <Route path="/category" element={<CategoryList />} />
          <Route path="/category/*" element={
            <CategoryDetail
              onBack={() => navigate(-1)}
              onToggleWishlist={toggleWishlist}
              onItemClick={(item) => navigate(`/content/${item.id}`)}
              wishlist={appState.wishlist}
            />
          } />
          <Route path="/content/:id" element={<ContentDetailWrapper toggleWishlist={toggleWishlist} wishlist={appState.wishlist} />} />
          <Route path="/search" element={<SearchPage onBack={() => navigate(-1)} onItemClick={(item) => navigate(`/content/${item.id}`)} />} />
          <Route path="/form-independence" element={<FormIndependence />} />
          <Route path="/form-soldier" element={<FormSoldier />} />
          <Route path="/random-box" element={<ProjectRandomBox />} />
          <Route path="/type-test" element={<TypeTest />} />
          <Route path="/project-minwon" element={<ProjectMinwonWrapper />} />
          <Route path="/more" element={<MorePage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      {/* 모바일 바텀 네비 */}
      {!isFullScreenPage && (
        <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-ieumBorder pt-3 pb-5 flex justify-around items-center z-50 shadow-[0_-4px_16px_rgba(0,0,0,0.06)]">
          <button onClick={() => navigate('/')} className={`flex flex-col items-center gap-1 min-w-[52px] transition-colors ${activeTab === 'home' ? 'text-ieumOrange' : 'text-ieumMuted'}`}>
            <i className="fa-solid fa-house text-xl"></i>
            <span className="text-[10px] font-semibold">홈</span>
          </button>
          <button onClick={() => navigate('/about/intro')} className={`flex flex-col items-center gap-1 min-w-[52px] transition-colors ${activeTab === 'about' ? 'text-ieumOrange' : 'text-ieumMuted'}`}>
            <i className="fa-solid fa-circle-info text-xl"></i>
            <span className="text-[10px] font-semibold">소개</span>
          </button>
          <button onClick={() => navigate('/category')} className={`flex flex-col items-center gap-1 min-w-[52px] transition-colors ${activeTab === 'category' ? 'text-ieumOrange' : 'text-ieumMuted'}`}>
            <i className="fa-solid fa-layer-group text-xl"></i>
            <span className="text-[10px] font-semibold">프로그램</span>
          </button>
          <button onClick={() => navigate('/more')} className={`flex flex-col items-center gap-1 min-w-[52px] transition-colors ${activeTab === 'more' ? 'text-ieumOrange' : 'text-ieumMuted'}`}>
            <i className="fa-solid fa-grip text-xl"></i>
            <span className="text-[10px] font-semibold">더보기</span>
          </button>
        </nav>
      )}
    </div>
  );
};

import { useParams } from 'react-router-dom';

const ContentDetailWrapper: React.FC<{ toggleWishlist: (id: string) => void; wishlist: string[] }> = ({ toggleWishlist, wishlist }) => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { content: item, loading, error } = useContentById(id || '');

  if (loading) return (
    <div className="min-h-screen bg-ieumCream flex items-center justify-center">
      <div className="text-center">
        <i className="fa-solid fa-spinner fa-spin text-3xl text-ieumOrange mb-3"></i>
        <p className="text-ieumMuted font-medium">콘텐츠를 불러오는 중...</p>
      </div>
    </div>
  );

  if (error || !item) return (
    <div className="min-h-screen bg-ieumCream flex items-center justify-center">
      <div className="text-center">
        <i className="fa-solid fa-exclamation-triangle text-3xl text-red-400 mb-3"></i>
        <p className="text-ieumMuted font-medium">콘텐츠를 찾을 수 없습니다.</p>
        <button onClick={() => navigate('/')} className="mt-4 px-6 py-2 bg-ieumOrange text-white rounded-lg hover:bg-ieumGold transition-colors">
          홈으로 돌아가기
        </button>
      </div>
    </div>
  );

  if (id === 's_proj1') return <ProjectLetter1 onBack={() => navigate(-1)} />;
  if (id === 's_proj2') return <ProjectLetter2 onBack={() => navigate(-1)} />;
  if (id === 's_proj3') return <ProjectTest onBack={() => navigate(-1)} />;
  if (id === 's_proj4') return <ProjectMinwon onBack={() => navigate(-1)} />;

  return (
    <ContentDetail
      item={item}
      onBack={() => navigate(-1)}
      onToggleWishlist={toggleWishlist}
      isWishlisted={wishlist.includes(item.id)}
    />
  );
};

const ProjectMinwonWrapper: React.FC = () => {
  const navigate = useNavigate();
  return <ProjectMinwon onBack={() => navigate(-1)} />;
};

export default App;
