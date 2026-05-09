import React, { useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Category, ContentItem } from '../types';
import { useContentsByCategory } from '../hooks/useContents';
import { getImageUrl } from '../lib/imageUrl';

interface CategoryDetailProps {
  onBack: () => void;
  onToggleWishlist: (id: string) => void;
  onItemClick: (item: ContentItem) => void;
  wishlist: string[];
}

const CategoryDetail: React.FC<CategoryDetailProps> = ({ 
  onBack, 
  onToggleWishlist, 
  onItemClick,
  wishlist 
}) => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const category = id as Category;
  const { contents, loading, error } = useContentsByCategory(category);
  
  const [activeSubCategory, setActiveSubCategory] = useState('전체');
  // Filters state
  const [statusFilter, setStatusFilter] = useState<'전체' | '진행중'>('전체');
  const [sortOrder, setSortOrder] = useState<'최신순' | '인기순'>('최신순');

  const filteredItems = useMemo(() => {
    let items = contents;
    
    // 1. Filter by sub-category
    if (activeSubCategory !== '전체') {
      items = items.filter((item) => 
        item.title.includes(activeSubCategory) || 
        item.description.includes(activeSubCategory) ||
        item.tag?.includes(activeSubCategory)
      );
    }

    // 2. Filter by status
    if (statusFilter === '진행중') {
      items = items.filter(item => item.deadline === '진행중' || !item.deadline); 
      // Assuming no deadline means always active, or adjust logic
    }

    // 3. Sort — API already returns created_at DESC, preserve that for 최신순
    if (sortOrder === '인기순') {
      items = [...items].sort((a, b) => b.title.length - a.title.length);
    }
    
    return items;
  }, [contents, activeSubCategory, statusFilter, sortOrder]);

  const subCategories: Record<string, string[]> = {
    [Category.PROJECTS]: ['전체', '사회이슈', '네트워킹', '지역상생', '환경', '기획'],
    [Category.SEMINARS]: ['전체', '마음건강', '커리어', '라이프스타일', '비즈니스', '예술'],
    [Category.CAMPAIGNS]: ['전체', '챌린지', '홍보', '소모임', '환경보호', '인권'],
    [Category.INTERVIEWS]: ['전체', '프리랜서', '창업가', '로컬', '활동가', '예술가'],
    [Category.ESSAYS]: ['전체', '일상', '칼럼', '리뷰', '인사이트', '회고'],
  };

  const currentSubs = subCategories[category] || ['전체'];

  if (!category) return null;

  if (loading) {
    return (
      <div className="min-h-screen bg-ieumCream flex items-center justify-center">
        <div className="text-center">
          <i className="fa-solid fa-spinner fa-spin text-3xl text-ieumAmber mb-3"></i>
          <p className="text-gray-600 font-medium">{category} 콘텐츠를 불러오는 중...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-ieumCream flex items-center justify-center">
        <div className="text-center">
          <i className="fa-solid fa-exclamation-triangle text-3xl text-red-500 mb-3"></i>
          <p className="text-gray-600 font-medium">콘텐츠를 불러오는데 실패했습니다.</p>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-4 px-6 py-2 bg-ieumAmber text-white rounded-lg hover:bg-[#f49342] transition-colors"
          >
            다시 시도
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-ieumCream animate-fadeIn">
      {/* Header (Sleek Glassmorphism) */}
      <header className="sticky top-0 z-50 bg-ieumCream/80 backdrop-blur-md border-b border-ieumLight px-5 py-4 flex items-center justify-between transition-all">
        <div className="flex items-center gap-4">
          <button onClick={onBack} className="p-1 text-gray-700 hover:text-ieumAmber transition-colors">
            <i className="fa-solid fa-arrow-left text-xl"></i>
          </button>
          <h1 className="text-xl font-extrabold text-gray-900 tracking-tight">{category}</h1>
        </div>
        <div className="flex items-center gap-5 text-gray-700">
          <button onClick={() => navigate('/')} className="hover:text-ieumAmber transition-colors"><i className="fa-solid fa-house text-lg"></i></button>
          <button onClick={() => navigate('/search')} className="hover:text-ieumAmber transition-colors"><i className="fa-solid fa-magnifying-glass text-lg"></i></button>
        </div>
      </header>

      {/* Sub-category Pills */}
      <div className="px-5 py-4 bg-ieumCream">
        <div className="flex overflow-x-auto gap-2 pb-2 hide-scrollbar">
          {currentSubs.map((sub, idx) => (
            <button 
              key={idx} 
              onClick={() => setActiveSubCategory(sub)}
              className={`px-4 py-2 rounded-full text-[13px] font-bold whitespace-nowrap transition-all shadow-sm ${
                activeSubCategory === sub 
                  ? 'bg-gradient-to-r from-ieumAmber to-[#f49342] text-white shadow-ieumAmber/30' 
                  : 'bg-white text-gray-600 border border-gray-100 hover:bg-gray-50'
              }`}
            >
              {sub}
            </button>
          ))}
        </div>
      </div>

      {/* Functional Action Filters */}
      <div className="flex items-center justify-between px-5 pb-5 pt-2 sticky top-[69px] z-40 bg-ieumCream/90 backdrop-blur-sm">
        <div className="flex items-center gap-2">
          {/* Status Filter Toggle */}
          <button 
            onClick={() => setStatusFilter(prev => prev === '전체' ? '진행중' : '전체')}
            className={`px-3 py-1.5 rounded-lg border text-xs font-bold whitespace-nowrap flex items-center gap-1.5 transition-colors shadow-sm ${
              statusFilter === '진행중' ? 'border-gray-900 bg-gray-900 text-white' : 'border-gray-200 bg-white text-gray-700 hover:bg-gray-50'
            }`}
          >
            <i className="fa-solid fa-bolt text-[10px] text-yellow-500"></i>
            진행중만 보기
          </button>
        </div>

        {/* Sort Filter Options */}
        <div className="flex items-center bg-gray-100 rounded-lg p-1">
          {['최신순', '인기순'].map((sort) => (
            <button 
              key={sort}
              onClick={() => setSortOrder(sort as '최신순' | '인기순')}
              className={`px-3 py-1 rounded-md text-xs font-bold transition-all ${
                sortOrder === sort ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {sort}
            </button>
          ))}
        </div>
      </div>

      {/* Premium Main Grid */}
      <div className="px-5 pb-12 pt-2">
        <div className="flex justify-between items-end mb-5">
          <div>
            <h2 className="text-xl font-bold text-gray-900 tracking-tight">당신을 위한 <span className="text-ieumAmber">{category}</span></h2>
            <p className="text-xs text-gray-500 mt-1 font-medium">IEUM가 엄선한 이야기를 만나보세요</p>
          </div>
          <span className="text-xs font-bold text-gray-400 bg-gray-100 px-2 py-1 rounded-md">{filteredItems.length}개의 결과</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {filteredItems.map(item => (
            <div 
              key={item.id} 
              className="flex flex-col group cursor-pointer bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-transparent hover:border-ieumAmber/20 transform hover:-translate-y-1"
              onClick={() => onItemClick(item)}
            >
              {/* Image Section */}
              <div className="relative aspect-[16/9] overflow-hidden bg-gray-100">
                <img 
                  src={getImageUrl(item.imageUrl)}
                  alt={item.title} 
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" 
                  referrerPolicy="no-referrer" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                
                {/* Wishlist Button */}
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    onToggleWishlist(item.id);
                  }}
                  className="absolute top-3 right-3 w-9 h-9 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white border border-white/30 hover:bg-white/40 transition-colors z-10"
                >
                  <i className={`${wishlist.includes(item.id) ? 'fa-solid text-red-500' : 'fa-regular'} fa-heart`}></i>
                </button>

                {/* Tags */}
                <div className="absolute top-3 left-3 flex gap-1.5">
                  <span className="bg-white/90 backdrop-blur-sm text-gray-900 text-[10px] font-bold px-2 py-1 rounded-md shadow-sm">
                    {item.category}
                  </span>
                  {item.tag && (
                    <span className="bg-black/80 backdrop-blur-sm text-ieumAmber text-[10px] font-bold px-2 py-1 rounded-md shadow-sm">
                      {item.tag}
                    </span>
                  )}
                </div>
              </div>

              {/* Content Section */}
              <div className="p-4 flex flex-col justify-between flex-1">
                <div>
                  <h3 className="text-[15px] font-bold text-gray-900 line-clamp-2 leading-snug mb-1.5 group-hover:text-ieumAmber transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-[12px] text-gray-500 line-clamp-2 leading-relaxed break-keep">
                    {item.description}
                  </p>
                </div>
                
                <div className="mt-4 flex items-center justify-between border-t border-gray-100 pt-3">
                  <div className="flex items-center gap-1.5">
                    {item.deadline === '진행중' ? (
                      <span className="flex items-center gap-1 text-[11px] font-bold text-green-500">
                        <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
                        진행중
                      </span>
                    ) : (
                      <span className="text-[11px] font-bold text-red-500 bg-red-50 px-1.5 py-0.5 rounded text-red-600">
                        {item.deadline || '상시진행'}
                      </span>
                    )}
                  </div>
                  <div className="text-[11px] text-gray-400 font-medium flex items-center gap-1">
                    자세히 보기 <i className="fa-solid fa-arrow-right text-[10px] group-hover:translate-x-1 transition-transform"></i>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {/* Empty State */}
        {filteredItems.length === 0 && (
          <div className="py-20 text-center flex flex-col items-center border border-dashed border-gray-200 rounded-2xl bg-gray-50 mt-4">
            <div className="w-16 h-16 bg-white shadow-sm rounded-full flex items-center justify-center mb-4">
              <i className="fa-regular fa-folder-open text-2xl text-gray-400"></i>
            </div>
            <p className="text-sm font-bold text-gray-600">해당 필터에 맞는 콘텐츠가 없습니다.</p>
            <p className="text-xs font-medium text-gray-400 mt-1">다른 조건으로 검색해보세요.</p>
            <button 
              onClick={() => {
                 setActiveSubCategory('전체');
                 setStatusFilter('전체');
              }}
              className="mt-5 px-5 py-2.5 bg-ieumAmber text-white text-xs font-bold rounded-xl shadow-md hover:bg-[#f49342] transition-colors"
            >
              전체 보기로 돌아가기
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CategoryDetail;
