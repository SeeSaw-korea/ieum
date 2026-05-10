
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

const CATEGORY_META: Record<string, {
  icon: string;
  type: 'program' | 'news';
  tagline: string;
  desc: string;
  color: string;
  accentColor: string;
  pills: string[];
}> = {
  [Category.PROJECTS]: {
    icon: 'fa-puzzle-piece',
    type: 'program',
    tagline: '청년이 만드는 변화',
    desc: '청년이 직접 기획하고 실행하는 사회참여 프로젝트. 아이디어에서 실행까지, 이음이 함께합니다.',
    color: 'bg-ieumNavy',
    accentColor: 'text-blue-300',
    pills: ['전체', '사회이슈', '네트워킹', '지역상생', '환경', '기획'],
  },
  [Category.SEMINARS]: {
    icon: 'fa-users-rays',
    type: 'program',
    tagline: '새로운 관점의 발견',
    desc: '사회·경제·문화 이슈를 깊이 탐구하는 세미나. 전문가와 청년이 만나 함께 배우는 지식 나눔의 자리입니다.',
    color: 'bg-ieumNavyLight',
    accentColor: 'text-purple-300',
    pills: ['전체', '마음건강', '커리어', '라이프스타일', '비즈니스', '예술'],
  },
  [Category.CAMPAIGNS]: {
    icon: 'fa-bullhorn',
    type: 'program',
    tagline: '일상이 바뀌는 순간',
    desc: '낯선 사회 이슈를 익숙한 언어로 풀고, 누구나 일상에서 함께할 수 있는 작지만 확실한 실천을 만듭니다.',
    color: 'bg-ieumOrange',
    accentColor: 'text-yellow-200',
    pills: ['전체', '챌린지', '홍보', '소모임', '환경보호', '인권'],
  },
  [Category.INTERVIEWS]: {
    icon: 'fa-microphone',
    type: 'news',
    tagline: '평범함 속의 비범함',
    desc: '우리 주변 평범한 청년들의 비범한 삶의 이야기. 다양한 삶의 방식을 기록하고 나눕니다.',
    color: 'bg-ieumNavy',
    accentColor: 'text-green-300',
    pills: ['전체', '프리랜서', '창업가', '로컬', '활동가', '예술가'],
  },
  [Category.ESSAYS]: {
    icon: 'fa-pen-nib',
    type: 'news',
    tagline: '청년의 시선으로 쓰다',
    desc: '청년의 눈으로 바라본 사회 이야기. 깊이 있는 글쓰기로 세상을 새롭게 봅니다.',
    color: 'bg-ieumNavyLight',
    accentColor: 'text-pink-300',
    pills: ['전체', '일상', '칼럼', '리뷰', '인사이트', '회고'],
  },
  [Category.INSIGHTS]: {
    icon: 'fa-lightbulb',
    type: 'news',
    tagline: '데이터로 읽는 청년',
    desc: '매월 발행하는 청년 사회 분석 리포트. 데이터와 현장의 목소리를 담아 청년 사회를 이해합니다.',
    color: 'bg-ieumOrange',
    accentColor: 'text-yellow-200',
    pills: ['전체'],
  },
};

/* 카테고리 이름에 맞는 아이콘 색상 뱃지 */
const TAG_COLORS: Record<string, string> = {
  [Category.PROJECTS]:   'bg-blue-50 text-blue-700 border-blue-100',
  [Category.SEMINARS]:   'bg-purple-50 text-purple-700 border-purple-100',
  [Category.CAMPAIGNS]:  'bg-orange-50 text-orange-700 border-orange-100',
  [Category.INTERVIEWS]: 'bg-green-50 text-green-700 border-green-100',
  [Category.ESSAYS]:     'bg-pink-50 text-pink-700 border-pink-100',
  [Category.INSIGHTS]:   'bg-amber-50 text-amber-700 border-amber-100',
};

const CategoryDetail: React.FC<CategoryDetailProps> = ({
  onBack, onToggleWishlist, onItemClick, wishlist
}) => {
  /* splat 파라미터로 '에세이/칼럼' 같은 슬래시 포함 카테고리도 정상 처리 */
  const params = useParams();
  const rawId = params['*'] ?? '';
  const navigate = useNavigate();
  const category = rawId as Category;

  const { contents, loading, error } = useContentsByCategory(category);
  const [activeSubCategory, setActiveSubCategory] = useState('전체');
  const [statusFilter, setStatusFilter] = useState<'전체' | '진행중'>('전체');
  const [sortOrder, setSortOrder] = useState<'최신순' | '인기순'>('최신순');

  const meta = CATEGORY_META[category] ?? {
    icon: 'fa-layer-group', type: 'program' as const,
    tagline: '', desc: '', color: 'bg-ieumNavy', accentColor: 'text-white',
    pills: ['전체'],
  };
  const tagColor = TAG_COLORS[category] ?? 'bg-gray-50 text-gray-700 border-gray-100';

  const filteredItems = useMemo(() => {
    let items = contents;
    if (activeSubCategory !== '전체') {
      items = items.filter(i =>
        i.title.includes(activeSubCategory) ||
        i.description.includes(activeSubCategory) ||
        i.tag?.includes(activeSubCategory)
      );
    }
    if (statusFilter === '진행중') {
      items = items.filter(i => i.deadline === '진행중' || !i.deadline);
    }
    if (sortOrder === '인기순') {
      items = [...items].sort((a, b) => b.title.length - a.title.length);
    }
    return items;
  }, [contents, activeSubCategory, statusFilter, sortOrder]);

  if (!category) return null;

  if (loading) return (
    <div className="min-h-screen bg-ieumCream flex items-center justify-center">
      <div className="text-center">
        <i className="fa-solid fa-spinner fa-spin text-3xl text-ieumOrange mb-3"></i>
        <p className="text-ieumMuted font-medium">{category} 불러오는 중...</p>
      </div>
    </div>
  );

  if (error) return (
    <div className="min-h-screen bg-ieumCream flex items-center justify-center">
      <div className="text-center">
        <i className="fa-solid fa-exclamation-triangle text-3xl text-red-400 mb-3"></i>
        <p className="text-ieumMuted font-medium">콘텐츠를 불러오는데 실패했습니다.</p>
        <button onClick={() => window.location.reload()} className="mt-4 px-6 py-2 bg-ieumOrange text-white rounded-lg">다시 시도</button>
      </div>
    </div>
  );

  const isProgram = meta.type === 'program';

  return (
    <div className="min-h-screen bg-[#F4F4F6] animate-fadeIn">

      {/* ── 히어로 ── */}
      <div className={`${meta.color} relative overflow-hidden`}>
        <div className="absolute inset-0 pointer-events-none select-none">
          <div className="absolute -top-20 -right-20 w-72 h-72 rounded-full bg-white opacity-[0.04]"></div>
          <div className="absolute bottom-0 -left-10 w-52 h-52 rounded-full bg-white opacity-[0.04]"></div>
        </div>
        <div className="max-w-5xl mx-auto px-5 py-12 md:py-16 relative z-10">
          <div className="flex items-center gap-2 text-white/40 text-xs font-semibold mb-6">
            <button onClick={() => navigate('/')} className="hover:text-white transition-colors">홈</button>
            <i className="fa-solid fa-chevron-right text-[8px]"></i>
            <span className="text-white/60">{isProgram ? '프로그램' : '소식'}</span>
            <i className="fa-solid fa-chevron-right text-[8px]"></i>
            <span className="text-white">{category}</span>
          </div>
          <div className="md:flex md:items-end md:justify-between gap-8">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-white/15 rounded-2xl flex items-center justify-center">
                  <i className={`fa-solid ${meta.icon} text-white text-xl`}></i>
                </div>
                <span className="bg-white/20 text-white text-xs font-bold px-3 py-1 rounded-full">
                  {isProgram ? 'Program' : 'News'}
                </span>
              </div>
              <p className={`text-xs font-bold uppercase tracking-widest mb-1 ${meta.accentColor}`}>{meta.tagline}</p>
              <h1 className="text-white text-3xl md:text-4xl font-black mb-3">{category}</h1>
              <p className="text-white/60 text-sm leading-relaxed max-w-lg">{meta.desc}</p>
            </div>
            <div className="mt-6 md:mt-0 flex-shrink-0 flex gap-5 md:gap-8">
              <div className="text-center">
                <p className="text-white/40 text-[10px] font-semibold uppercase">콘텐츠</p>
                <p className="text-white text-3xl font-black mt-0.5">{contents.length}<span className="text-white/40 text-sm ml-0.5">개</span></p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── 필터 바 ── */}
      <div className="bg-white border-b border-gray-200 sticky top-16 z-40 shadow-sm">
        <div className="max-w-5xl mx-auto px-5 py-3 flex items-center gap-3">
          <div className="flex overflow-x-auto gap-2 pb-0.5 hide-scrollbar flex-1">
            {meta.pills.map((sub, idx) => (
              <button
                key={idx}
                onClick={() => setActiveSubCategory(sub)}
                className={`flex-shrink-0 px-3.5 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all border ${
                  activeSubCategory === sub
                    ? 'bg-ieumNavy text-white border-ieumNavy shadow-sm'
                    : 'bg-white text-ieumMuted border-gray-200 hover:border-ieumNavy hover:text-ieumNavy'
                }`}
              >
                {sub}
              </button>
            ))}
          </div>
          <div className="flex-shrink-0 flex items-center gap-2">
            <button
              onClick={() => setStatusFilter(p => p === '전체' ? '진행중' : '전체')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-bold transition-colors ${
                statusFilter === '진행중' ? 'bg-ieumNavy border-ieumNavy text-white' : 'bg-white border-gray-200 text-ieumMuted'
              }`}
            >
              <span className={`w-1.5 h-1.5 rounded-full ${statusFilter === '진행중' ? 'bg-green-400' : 'bg-gray-300'}`}></span>
              진행중
            </button>
            <div className="flex bg-gray-100 rounded-lg border border-gray-200 p-0.5">
              {(['최신순', '인기순'] as const).map(s => (
                <button key={s} onClick={() => setSortOrder(s)}
                  className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all ${sortOrder === s ? 'bg-white text-ieumDark shadow-sm' : 'text-ieumMuted'}`}>
                  {s}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── 카드 그리드 ── */}
      <div className="max-w-5xl mx-auto px-5 py-8 pb-20">
        <p className="text-xs text-ieumMuted font-semibold mb-6">{filteredItems.length}개의 콘텐츠</p>

        {filteredItems.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-5">
            {filteredItems.map(item => (
              <ContentCard
                key={item.id}
                item={item}
                isWishlisted={wishlist.includes(item.id)}
                onToggleWishlist={onToggleWishlist}
                onClick={() => onItemClick(item)}
                tagColorClass={tagColor}
              />
            ))}
          </div>
        ) : (
          <div className="py-24 text-center flex flex-col items-center border border-dashed border-gray-200 rounded-3xl bg-white">
            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
              <i className="fa-regular fa-folder-open text-2xl text-gray-300"></i>
            </div>
            <p className="text-sm font-bold text-ieumDark">해당 필터에 맞는 콘텐츠가 없습니다.</p>
            <p className="text-xs text-ieumMuted mt-1 mb-5">다른 조건으로 검색해보세요.</p>
            <button onClick={() => { setActiveSubCategory('전체'); setStatusFilter('전체'); }}
              className="px-5 py-2.5 bg-ieumOrange text-white text-xs font-bold rounded-xl">
              전체 보기
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

/* ── Dribbble 스타일 카드 컴포넌트 ── */
const ContentCard: React.FC<{
  item: ContentItem;
  isWishlisted: boolean;
  onToggleWishlist: (id: string) => void;
  onClick: () => void;
  tagColorClass: string;
}> = ({ item, isWishlisted, onToggleWishlist, onClick, tagColorClass }) => {
  const [imgError, setImgError] = useState(false);

  return (
    <div
      onClick={onClick}
      className="group cursor-pointer bg-white rounded-2xl overflow-hidden border border-gray-100 hover:border-gray-200 hover:shadow-2xl transition-all duration-300 hover:-translate-y-1.5 flex flex-col"
    >
      {/* 이미지 영역 */}
      <div className="relative aspect-[4/3] overflow-hidden bg-gray-50">
        {!imgError ? (
          <img
            src={getImageUrl(item.imageUrl)}
            alt={item.title}
            onError={() => setImgError(true)}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            referrerPolicy="no-referrer"
          />
        ) : (
          /* 이미지 오류 시 플레이스홀더 */
          <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
            <i className="fa-solid fa-image text-gray-300 text-3xl mb-2"></i>
            <p className="text-gray-400 text-[10px] font-medium">이미지 준비중</p>
          </div>
        )}

        {/* 찜 버튼 — 항상 표시 */}
        <button
          onClick={e => { e.stopPropagation(); onToggleWishlist(item.id); }}
          className={`absolute top-2.5 right-2.5 w-8 h-8 rounded-full flex items-center justify-center transition-all ${
            isWishlisted
              ? 'bg-white shadow-md text-red-500'
              : 'bg-black/20 backdrop-blur-sm text-white opacity-0 group-hover:opacity-100'
          }`}
        >
          <i className={`fa-${isWishlisted ? 'solid' : 'regular'} fa-heart text-sm`}></i>
        </button>

        {/* 태그 뱃지 */}
        {item.tag && (
          <div className="absolute bottom-2.5 left-2.5">
            <span className="bg-white/90 backdrop-blur-sm text-gray-700 text-[10px] font-bold px-2 py-0.5 rounded-md shadow-sm">
              {item.tag}
            </span>
          </div>
        )}
      </div>

      {/* 텍스트 영역 */}
      <div className="p-4 flex flex-col flex-1">
        {/* 카테고리 뱃지 */}
        <span className={`self-start text-[10px] font-bold px-2 py-0.5 rounded-full border mb-2 ${tagColorClass}`}>
          {item.category}
        </span>

        {/* 제목 */}
        <h3 className="text-sm font-bold text-gray-900 line-clamp-2 leading-snug group-hover:text-ieumOrange transition-colors flex-1">
          {item.title}
        </h3>

        {/* 하단 — 마감일 + 화살표 */}
        <div className="mt-3 flex items-center justify-between">
          {item.deadline === '진행중' ? (
            <span className="flex items-center gap-1 text-[11px] font-bold text-emerald-500">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>진행중
            </span>
          ) : item.deadline ? (
            <span className="text-[11px] font-semibold text-ieumOrange">{item.deadline}</span>
          ) : (
            <span className="text-[11px] text-gray-300 font-medium">상시진행</span>
          )}
          <i className="fa-solid fa-arrow-right text-[10px] text-gray-300 group-hover:text-ieumOrange group-hover:translate-x-1 transition-all"></i>
        </div>
      </div>
    </div>
  );
};

export default CategoryDetail;
