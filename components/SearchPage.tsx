
import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useContents } from '../hooks/useContents';
import { ContentItem } from '../types';
import { getImageUrl } from '../lib/imageUrl';

interface SearchPageProps {
  onBack: () => void;
  onItemClick: (item: ContentItem) => void;
}

const SearchPage: React.FC<SearchPageProps> = ({ onBack, onItemClick }) => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const queryParam = searchParams.get('q') || '';
  const { contents, loading, error } = useContents();
  
  const [query, setQuery] = useState(queryParam);
  const [isSearching, setIsSearching] = useState(!!queryParam);
  const [activeAgeTab, setActiveAgeTab] = useState('전체');

  useEffect(() => {
    if (queryParam) {
      setQuery(queryParam);
      setIsSearching(true);
    }
  }, [queryParam]);

  const popularSearches = [
    { rank: 1, term: '시니어 성공 경험', trend: 'up' },
    { rank: 2, term: 'ICA 심리 상담', trend: 'up' },
    { rank: 3, term: '자소서 1:1 첨삭', trend: 'up' },
    { rank: 4, term: '6070 비즈니스 인사이트', trend: 'up' },
    { rank: 5, term: '포트폴리오 컨설팅', trend: 'up' },
    { rank: 6, term: '은퇴 후 커리어', trend: 'up' },
    { rank: 7, term: '커리어 설계 상담', trend: 'up' },
    { rank: 8, term: '시니어 멘토링', trend: 'up' },
    { rank: 9, term: '내면 고민 해결', trend: 'up' },
    { rank: 10, term: '실무 경험 전수', trend: 'up' },
  ];

  const ageTabs = ['전체', '10대', '20대 초반', '20대 중반', '20대 후반', '30대 이상'];

  const searchResults = useMemo(() => {
    if (!query.trim()) return [];
    return contents.filter(item => 
      item.title.toLowerCase().includes(query.toLowerCase()) || 
      item.description.toLowerCase().includes(query.toLowerCase())
    );
  }, [query, contents]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      setIsSearching(true);
      setSearchParams({ q: query });
    }
  };

  return (
    <div className="min-h-screen bg-ieumCream animate-fadeIn flex flex-col">
      {/* Header */}
      <header className="px-4 py-3 flex items-center gap-3 sticky top-0 bg-ieumCream z-50 border-b border-ieumLight">
        <button onClick={() => navigate(-1)} className="p-1">
          <i className="fa-solid fa-chevron-left text-xl"></i>
        </button>
        <form onSubmit={handleSearch} className="flex-1 relative">
          <i className="fa-solid fa-magnifying-glass absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"></i>
          <input 
            type="text" 
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              if (!e.target.value) {
                setIsSearching(false);
                setSearchParams({});
              }
            }}
            placeholder="관심 있는 인사이트나 상담을 검색해보세요"
            className="w-full bg-ieumLight/50 rounded-lg py-2.5 pl-11 pr-4 text-sm outline-none focus:ring-2 focus:ring-ieumAmber/20"
            autoFocus
          />
        </form>
      </header>

      <div className="flex-1 overflow-y-auto">
        {!isSearching ? (
          <div className="animate-fadeIn">
            {/* Popular Searches Section */}
            <section className="px-5 py-6">
              <div className="flex justify-between items-end mb-5">
                <h2 className="text-lg font-bold">인기 검색어</h2>
                <span className="text-[10px] text-gray-400 font-medium">02.22 00:00 기준</span>
              </div>

              {/* Age Tabs */}
              <div className="flex overflow-x-auto gap-2 mb-6 hide-scrollbar">
                {ageTabs.map(tab => (
                  <button 
                    key={tab}
                    onClick={() => setActiveAgeTab(tab)}
                    className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap border transition-all ${
                      activeAgeTab === tab 
                        ? 'bg-gray-700 border-gray-700 text-white' 
                        : 'bg-white border-gray-100 text-gray-400'
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>

              {/* Ranking List */}
              <div className="space-y-5">
                {popularSearches.map((item) => (
                  <div 
                    key={item.rank} 
                    className="flex items-center gap-4 cursor-pointer group"
                    onClick={() => {
                      setQuery(item.term);
                      setIsSearching(true);
                    }}
                  >
                    <span className="w-4 text-sm font-black text-gray-900">{item.rank}</span>
                    <span className="flex-1 text-sm font-medium text-gray-700 group-hover:text-ieumAmber transition-colors">{item.term}</span>
                    <i className={`fa-solid fa-caret-${item.trend} text-[10px] ${item.trend === 'up' ? 'text-red-400' : 'text-blue-300'}`}></i>
                  </div>
                ))}
              </div>
            </section>
          </div>
        ) : (
          <div className="animate-fadeIn px-5 py-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-base font-bold">검색 결과 <span className="text-ieumAmber">{searchResults.length}</span></h2>
              <div className="flex items-center gap-1 text-xs text-gray-400 font-medium">
                추천순 <i className="fa-solid fa-chevron-down text-[8px]"></i>
              </div>
            </div>

            {searchResults.length > 0 ? (
              <div className="grid grid-cols-2 gap-x-3 gap-y-8">
                {searchResults.map(item => (
                  <div 
                    key={item.id} 
                    className="flex flex-col group cursor-pointer"
                    onClick={() => onItemClick(item)}
                  >
                    <div className="relative aspect-[3/4] rounded-xl overflow-hidden mb-3">
                      <img src={getImageUrl(item.imageUrl)} alt={item.title} className="w-full h-full object-cover transition-transform group-hover:scale-105" referrerPolicy="no-referrer" />
                      <div className="absolute bottom-2 left-2 bg-ieumAmber text-white text-[9px] font-bold px-1.5 py-0.5 rounded">
                        오늘공고
                      </div>
                    </div>
                    <div className="space-y-1">
                      <p className="text-[10px] text-gray-400 font-medium">{item.category}</p>
                      <h3 className="text-xs font-medium text-gray-800 line-clamp-2 leading-relaxed h-8">
                        {item.title}
                      </h3>
                      <div className="flex items-center gap-1.5">
                        <span className="text-sm font-bold text-red-500">{item.deadline || '오늘마감'}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-20 text-gray-400">
                <i className="fa-solid fa-magnifying-glass text-4xl mb-4 opacity-20"></i>
                <p className="text-sm font-medium">검색 결과가 없습니다.</p>
                <p className="text-xs mt-1">다른 검색어를 입력해보세요.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchPage;
