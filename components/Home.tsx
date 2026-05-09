
import React, { useState } from 'react';
import { Category, AppState, ContentItem } from '../types';
import { useContents } from '../hooks/useContents';
import Card from './Card';
import { useNavigate } from 'react-router-dom';

interface HomeProps {
  appState: AppState;
  toggleWishlist: (id: string) => void;
  setShowOnboarding: (show: boolean) => void;
}

const Home: React.FC<HomeProps> = ({ appState, toggleWishlist, setShowOnboarding }) => {
  const navigate = useNavigate();
  const { contents, loading, error } = useContents();
  const [statsTab, setStatsTab] = useState<'all' | 'project' | 'seminar' | 'campaign' | 'interview' | 'live'>('all');

  const userInterests = appState.user?.interests || [];

  if (loading) {
    return (
      <div className="animate-fadeIn flex items-center justify-center h-64">
        <div className="text-center">
          <i className="fa-solid fa-spinner fa-spin text-2xl text-ieumAmber mb-2"></i>
          <p className="text-gray-500">콘텐츠를 불러오는 중...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="animate-fadeIn flex items-center justify-center h-64">
        <div className="text-center">
          <i className="fa-solid fa-exclamation-triangle text-2xl text-red-500 mb-2"></i>
          <p className="text-gray-500">콘텐츠를 불러오는데 실패했습니다.</p>
        </div>
      </div>
    );
  }

  const statsData = {
    all: [
      { icon: 'fa-users', label: '참여 청년', value: '2,841', unit: '명' },
      { icon: 'fa-heart', label: '연결된 마음', value: '12,450', unit: '건' },
      { icon: 'fa-layer-group', label: '진행 프로젝트', value: '123', unit: '개' },
      { icon: 'fa-bullhorn', label: '캠페인 영향력', value: '15.8만', unit: '회' },
      { icon: 'fa-handshake', label: '협력 네트워크', value: '48', unit: '개' },
    ],
    project: [
      { icon: 'fa-users', label: '참여 청년', value: '452', unit: '명' },
      { icon: 'fa-heart', label: '연결된 마음', value: '890', unit: '건' },
      { icon: 'fa-layer-group', label: '진행 프로젝트', value: '24', unit: '개' },
      { icon: 'fa-bullhorn', label: '캠페인 영향력', value: '3.2만', unit: '회' },
      { icon: 'fa-handshake', label: '협력 네트워크', value: '12', unit: '개' },
    ],
    seminar: [
      { icon: 'fa-users', label: '참여 청년', value: '925', unit: '명' },
      { icon: 'fa-heart', label: '연결된 마음', value: '1,320', unit: '건' },
      { icon: 'fa-layer-group', label: '진행 프로젝트', value: '38', unit: '개' },
      { icon: 'fa-bullhorn', label: '캠페인 영향력', value: '1.5만', unit: '회' },
      { icon: 'fa-handshake', label: '협력 네트워크', value: '18', unit: '개' },
    ],
    campaign: [
      { icon: 'fa-users', label: '참여 청년', value: '1,145', unit: '명' },
      { icon: 'fa-heart', label: '연결된 마음', value: '9,850', unit: '건' },
      { icon: 'fa-layer-group', label: '진행 프로젝트', value: '15', unit: '개' },
      { icon: 'fa-bullhorn', label: '캠페인 영향력', value: '10.4만', unit: '회' },
      { icon: 'fa-handshake', label: '협력 네트워크', value: '8', unit: '개' },
    ],
    interview: [
      { icon: 'fa-users', label: '참여 청년', value: '319', unit: '명' },
      { icon: 'fa-heart', label: '연결된 마음', value: '390', unit: '건' },
      { icon: 'fa-layer-group', label: '진행 프로젝트', value: '46', unit: '개' },
      { icon: 'fa-bullhorn', label: '캠페인 영향력', value: '0.7만', unit: '회' },
      { icon: 'fa-handshake', label: '협력 네트워크', value: '10', unit: '개' },
    ],
    live: [
      { icon: 'fa-envelope-open-text', label: '손편지 프로젝트\n참여자', value: '128', unit: '명' },
      { icon: 'fa-trophy', label: '청년 공모전\n참가 팀', value: '34', unit: '팀' },
    ],
  };

  const statsTabs = [
    { key: 'all', label: '전체' },
    { key: 'live', label: '진행중' },
    { key: 'project', label: '프로젝트' },
    { key: 'seminar', label: '세미나' },
    { key: 'campaign', label: '캠페인' },
    { key: 'interview', label: '인터뷰' },
  ] as const;

  const homeCategories = [
    { label: '프로젝트', icon: 'fa-puzzle-piece', color: 'text-blue-500', category: Category.PROJECTS },
    { label: '세미나', icon: 'fa-users-rays', color: 'text-purple-500', category: Category.SEMINARS },
    { label: '인사이트', icon: 'fa-lightbulb', color: 'text-yellow-500', category: Category.INSIGHTS },
    { label: '캠페인', icon: 'fa-bullhorn', color: 'text-green-500', category: Category.CAMPAIGNS },
    { label: '인터뷰', icon: 'fa-microphone', color: 'text-orange-500', category: Category.INTERVIEWS },
  ];

  return (
    <div className="animate-fadeIn">
      {/* Home Category Icon Grid */}
      <section className="px-5 py-6">
        <div className="flex gap-8">
          {homeCategories.map((cat, idx) => (
            <button 
              key={idx} 
              onClick={() => {
                if (cat.category) {
                  navigate(`/category/${cat.category}`);
                } else {
                  navigate('/category');
                }
              }}
              className="flex flex-col items-center gap-2 group active:scale-95 transition-transform"
            >
              <div className="w-14 h-14 rounded-2xl bg-ieumLight/60 flex items-center justify-center text-xl transition-colors group-hover:bg-ieumAmber/15">
                <i className={`fa-solid ${cat.icon} ${cat.color}`}></i>
              </div>
              <span className="text-[11px] font-bold text-ieumDark whitespace-nowrap">{cat.label}</span>
            </button>
          ))}
        </div>
      </section>

      {/* 배너 */}
      <section className="px-5 mb-6">
        <div className="w-full bg-gradient-to-r from-ieumAmber to-ieumGold rounded-2xl p-5 text-left text-white shadow-lg shadow-ieumAmber/20 overflow-hidden relative">
          <div className="relative z-10">
            <h3 className="text-lg font-bold mb-1">불안에서 출발해 사회와 연결되는 참여 구조 ✨</h3>
            <p className="text-xs text-white/80">질문하고 행동하며, 균형과 연결을 만들어갑니다.</p>
          </div>
          <i className="fa-solid fa-wand-magic-sparkles absolute -right-4 -bottom-4 text-8xl text-white/10 rotate-12"></i>
        </div>
      </section>

      {/* 숫자로 보는 이음 */}
      <section className="px-5 mb-8">
        <div className="mb-4">
          <h3 className="text-lg font-bold text-gray-900">숫자로 보는 이음</h3>
          <p className="text-xs text-gray-500 mt-0.5">불안에서 출발해 사회와 연결되는 청년들의 기록입니다.</p>
        </div>
        {/* 탭 */}
        <div className="flex gap-2 overflow-x-auto hide-scrollbar pb-2 mb-4">
          {statsTabs.map(tab => (
            <button
              key={tab.key}
              onClick={() => setStatsTab(tab.key)}
              className={`flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-bold transition-colors ${
                statsTab === tab.key
                  ? 'bg-ieumAmber text-white shadow-sm'
                  : 'bg-gray-100 text-gray-500'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
        {/* 통계 카드 */}
        <div className={`grid gap-3 ${statsTab === 'live' ? 'grid-cols-2' : 'grid-cols-2 sm:grid-cols-3'}`}>
          {statsData[statsTab].map((stat, idx) => (
            <div key={idx} className="bg-white rounded-2xl px-4 py-4 shadow-sm border border-gray-100 flex flex-col gap-2">
              <div className="w-8 h-8 rounded-xl bg-ieumAmber/10 flex items-center justify-center">
                <i className={`fa-solid ${stat.icon} text-ieumAmber text-sm`}></i>
              </div>
              <div>
                <p className="text-[11px] text-gray-400 font-medium whitespace-pre-line leading-tight">{stat.label}</p>
                <p className="text-xl font-black text-gray-900 mt-0.5">
                  {stat.value}<span className="text-sm font-bold text-gray-500 ml-0.5">{stat.unit}</span>
                </p>
              </div>
            </div>
          ))}
        </div>
        {statsTab === 'live' && (
          <p className="text-[10px] text-gray-400 text-center mt-3">* 현재 진행 중인 프로젝트 실시간 현황입니다.</p>
        )}
      </section>

      {/* Category Sections */}
      <div className="px-5 space-y-10 mt-6">
        {/* 1. Project Section */}
        <section>
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-bold">청년 기획 프로젝트</h3>
            <button onClick={() => navigate(`/category/${Category.PROJECTS}`)} className="text-xs text-gray-400 font-medium">전체보기 <i className="fa-solid fa-chevron-right ml-1"></i></button>
          </div>
          <div className="flex overflow-x-auto gap-3 pb-2 hide-scrollbar">
            {contents.filter(i => i.category === Category.PROJECTS).map(item => (
              <Card 
                key={item.id} 
                item={item} 
                isWishlisted={appState.wishlist.includes(item.id)}
                onToggleWishlist={toggleWishlist}
                onClick={() => navigate(`/content/${item.id}`)}
                variant="small"
              />
            ))}
          </div>
        </section>

        {/* 2. Seminar Section */}
        <section>
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-bold">새로운 관점을 여는 세미나</h3>
            <button onClick={() => navigate(`/category/${Category.SEMINARS}`)} className="text-xs text-gray-400 font-medium">전체보기 <i className="fa-solid fa-chevron-right ml-1"></i></button>
          </div>
          <div className="flex overflow-x-auto gap-3 pb-2 hide-scrollbar">
            {contents.filter(i => i.category === Category.SEMINARS).map(item => (
              <Card 
                key={item.id} 
                item={item} 
                isWishlisted={appState.wishlist.includes(item.id)}
                onToggleWishlist={toggleWishlist}
                onClick={() => navigate(`/content/${item.id}`)}
                variant="small"
              />
            ))}
          </div>
        </section>

        {/* 3. Insight Section */}
        <section>
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-bold">매월 청년 사회 인사이트</h3>
            <button onClick={() => navigate(`/category/${Category.INSIGHTS}`)} className="text-xs text-gray-400 font-medium">전체보기 <i className="fa-solid fa-chevron-right ml-1"></i></button>
          </div>
          <div className="flex overflow-x-auto gap-3 pb-2 hide-scrollbar">
            {contents.filter(i => i.category === Category.INSIGHTS).map(item => (
              <Card
                key={item.id}
                item={item}
                isWishlisted={appState.wishlist.includes(item.id)}
                onToggleWishlist={toggleWishlist}
                onClick={() => navigate(`/content/${item.id}`)}
                variant="small"
              />
            ))}
          </div>
        </section>

        {/* 4. Campaign Section */}
        <section className="bg-ieumLight/40 -mx-5 px-5 py-8">
          <div className="mb-4">
            <div className="flex items-center gap-2 mb-1">
              <span className="bg-ieumAmber text-white text-[10px] font-bold px-2 py-0.5 rounded-full">실천</span>
              <h3 className="text-lg font-bold">일상 속 작은 실천, 캠페인</h3>
            </div>
            <p className="text-xs text-gray-500 leading-relaxed">
              낯선 사회 이슈를 익숙한 언어로 풀고,<br />
              모두가 일상에서 함께할 수 있는 작지만 확실한 방식의 행동으로 번역합니다.
            </p>
          </div>
          <div className="flex overflow-x-auto gap-3 pb-2 hide-scrollbar">
            {contents.filter(i => i.category === Category.CAMPAIGNS).map(item => (
              <Card 
                key={item.id} 
                item={item} 
                isWishlisted={appState.wishlist.includes(item.id)}
                onToggleWishlist={toggleWishlist}
                onClick={() => navigate(`/content/${item.id}`)}
                variant="small"
              />
            ))}
          </div>
        </section>

        {/* 4. Interview Section */}
        <section className="bg-amber-50/50 -mx-5 px-5 py-8 mb-10">
          <div className="mb-4">
            <div className="flex items-center gap-2 mb-1">
              <span className="bg-ieumGold/80 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">아카이브</span>
              <h3 className="text-lg font-bold">우리의 평범한 이야기, 인터뷰</h3>
            </div>
            <p className="text-xs text-gray-500 leading-relaxed">
              잘 보이지 않던 누군가의 삶의 이야기를 함께 듣고 나누며 일상을 지탱하는 공감의 반경을 넓힙니다.
            </p>
          </div>
          <div className="flex overflow-x-auto gap-3 pb-2 hide-scrollbar">
            {contents.filter(i => i.category === Category.INTERVIEWS).map(item => (
              <Card 
                key={item.id} 
                item={item} 
                isWishlisted={appState.wishlist.includes(item.id)}
                onToggleWishlist={toggleWishlist}
                onClick={() => navigate(`/content/${item.id}`)}
                variant="small"
              />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default Home;
