import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ContentItem, Category } from '../types';
import { getImageUrl } from '../lib/imageUrl';

interface ContentDetailProps {
  item: ContentItem;
  onBack: () => void;
  onToggleWishlist: (id: string) => void;
  isWishlisted: boolean;
}

const ContentDetail: React.FC<ContentDetailProps> = ({ 
  item, 
  onBack, 
  onToggleWishlist, 
  isWishlisted 
}) => {
  const navigate = useNavigate();
  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-ieumCream pb-28 pt-[60px]">
      {/* Sleek Header - Changed to fixed for flawless layout without overlap */}
      <header className="fixed top-0 left-0 w-full z-[100] bg-white/90 backdrop-blur-md border-b border-gray-100 flex justify-center transition-all">
        <div className="w-full max-w-[1126px] px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button onClick={onBack} className="w-8 h-8 flex items-center justify-center bg-gray-50 rounded-full text-gray-800 hover:bg-gray-100 transition-colors border border-gray-200">
              <i className="fa-solid fa-chevron-left"></i>
            </button>
          </div>
          <div className="flex flex-col items-center">
             <span className="text-[10px] font-bold text-gray-400 tracking-widest uppercase">{item.category}</span>
             <h1 className="text-sm font-extrabold text-gray-900 truncate max-w-[200px]">{item.title.replace(/\[.*?\]\s*/, '')}</h1>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => navigate('/')} className="w-8 h-8 flex items-center justify-center bg-gray-50 rounded-full text-gray-800 hover:bg-gray-100 transition-colors border border-gray-200">
              <i className="fa-solid fa-house"></i>
            </button>
            <button onClick={() => alert('공유 기능은 준비 중입니다.')} className="w-8 h-8 flex items-center justify-center bg-gray-50 rounded-full text-gray-800 hover:bg-gray-100 transition-colors border border-gray-200">
              <i className="fa-solid fa-share-nodes"></i>
            </button>
          </div>
        </div>
      </header>

      {/* Hero Image with Parallax-like aesthetic */}
      <div className="relative w-full h-[55vh] bg-gray-900 animate-fadeIn">
        <img 
          src={getImageUrl(item.imageUrl)}
          alt={item.title} 
          className="w-full h-full object-cover opacity-90"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent"></div>
        
        {/* Category & Tag overlay */}
        <div className="absolute top-5 left-5 flex gap-2">
          <span className="bg-white/20 backdrop-blur-md text-white border border-white/30 text-[11px] font-bold px-2.5 py-1 rounded-md">
            {item.category}
          </span>
          {item.tag && (
            <span className="bg-ieumAmber text-white text-[11px] font-bold px-2.5 py-1 rounded-md shadow-lg shadow-ieumAmber/30">
              {item.tag}
            </span>
          )}
        </div>

        {/* Title overlay */}
        <div className="absolute bottom-10 left-5 right-5 text-white">
          <h2 className="text-2xl font-black leading-tight mb-2 text-shadow-sm">
            {item.title}
          </h2>
          <p className="text-sm text-gray-200 line-clamp-2 leading-relaxed opacity-90 font-medium">
            {item.description}
          </p>
        </div>
      </div>

      {/* Stats & Info Bar */}
      <div className="bg-white px-5 py-4 flex items-center justify-between shadow-sm relative z-20 -mt-6 rounded-t-3xl border-b border-gray-50 animate-fadeIn">
        <div className="flex gap-6">
           <div className="flex flex-col">
             <span className="text-[10px] text-gray-400 font-bold mb-0.5">상태</span>
             <span className={`text-xs font-black ${item.deadline === '진행중' ? 'text-green-500' : 'text-red-500'}`}>
               {item.deadline || '상시'}
             </span>
           </div>
           <div className="flex flex-col">
             <span className="text-[10px] text-gray-400 font-bold mb-0.5">조회수</span>
             <span className="text-xs font-black text-gray-800">1.2K+</span>
           </div>
        </div>
        <button 
          onClick={() => onToggleWishlist(item.id)}
          className="w-10 h-10 bg-gray-50 rounded-full flex items-center justify-center border border-gray-100 shadow-sm"
        >
          <i className={`${isWishlisted ? 'fa-solid text-red-500' : 'fa-regular text-gray-400'} fa-heart text-lg transition-transform active:scale-75`}></i>
        </button>
      </div>

      {/* Dynamic Detailed Sections */}
      <section className="px-5 py-8 space-y-6 bg-ieumCream animate-fadeIn">
        {item.detailedSections && item.detailedSections.length > 0 ? (
          item.detailedSections.map((section, idx) => {
            
            // 0. IMAGE TYPE
            if (section.type === 'image') {
              return (
                <div key={idx} className="rounded-2xl overflow-hidden shadow-sm border border-gray-100">
                  <img src={section.body} alt={section.subtitle || ''} className="w-full h-auto" />
                </div>
              );
            }

            // 1. QUOTE TYPE
            if (section.type === 'quote') {
              return (
                <div key={idx} className="bg-ieumAmber/10 px-6 py-8 rounded-2xl relative border border-ieumAmber/30 shadow-sm">
                  <i className={`${section.iconClass || 'fa-solid fa-quote-left'} text-4xl text-ieumAmber absolute -top-4 -left-2 opacity-30 transform -rotate-12`}></i>
                  <h3 className="text-[19px] font-black text-gray-900 mb-3 relative z-10 leading-snug">
                    "{section.subtitle}"
                  </h3>
                  <p className="text-[14px] text-gray-700 relative z-10 leading-relaxed font-medium break-keep">
                    {section.body}
                  </p>
                </div>
              );
            }
            
            // 2. HIGHLIGHT TYPE
            if (section.type === 'highlight') {
              return (
                <div key={idx} className="bg-white px-6 py-7 rounded-2xl shadow-sm border border-gray-100 relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-1 h-full bg-ieumAmber"></div>
                  <div className="flex items-center gap-3 mb-3">
                    {section.iconClass && (
                      <div className="w-9 h-9 rounded-full bg-ieumAmber/10 flex items-center justify-center text-ieumAmber border border-ieumAmber/20">
                        <i className={`${section.iconClass}`}></i>
                      </div>
                    )}
                    <h3 className="text-lg font-bold text-gray-900 leading-tight">{section.subtitle}</h3>
                  </div>
                  {section.body && <p className="text-[14px] text-gray-600 leading-relaxed break-keep font-medium mb-3">{section.body}</p>}
                  {section.extraData && section.extraData.length > 0 && (
                    <ul className="space-y-3">
                      {section.extraData.map((item, eIdx) => {
                        const [topic, source] = item.split(' — 출처: ');
                        return (
                          <li key={eIdx} className="flex flex-col gap-0.5">
                            <span className="text-[13px] font-bold text-gray-800">· {topic}</span>
                            {source && (
                              <span className="text-[11px] text-gray-400 font-medium pl-3">출처 : {source}</span>
                            )}
                          </li>
                        );
                      })}
                    </ul>
                  )}
                </div>
              );
            }

            // 3. STEPS TYPE
            if (section.type === 'steps') {
              return (
                <div key={idx} className="bg-white px-6 py-7 rounded-2xl shadow-sm border border-gray-100 relative">
                  <div className="absolute top-0 left-0 w-1 h-full bg-ieumAmber rounded-l-2xl"></div>
                  <div className="flex items-center gap-3 mb-4">
                     {section.iconClass && (
                       <div className="w-9 h-9 rounded-full bg-ieumAmber/10 flex items-center justify-center text-ieumAmber border border-ieumAmber/20">
                         <i className={`${section.iconClass}`}></i>
                       </div>
                     )}
                     <h3 className="text-lg font-extrabold text-gray-900 pt-0.5">{section.subtitle}</h3>
                  </div>
                  <p className="text-[14px] text-gray-600 mb-5 break-keep font-medium">{section.body}</p>

                  <div className="space-y-3">
                    {section.extraData?.map((step, sIdx) => (
                      <div key={sIdx} className="flex items-center gap-4 bg-ieumLight/40 p-4 rounded-xl border border-ieumAmber/10 shadow-sm">
                        <div className="w-7 h-7 rounded-full bg-ieumAmber text-white text-[11px] font-black flex items-center justify-center flex-shrink-0 shadow-sm">
                          {sIdx + 1}
                        </div>
                        <span className="text-[14px] font-bold text-gray-800">{step}</span>
                      </div>
                    ))}
                  </div>
                </div>
              );
            }

            // 4. CHECKLIST TYPE
            if (section.type === 'checklist') {
              return (
                <div key={idx} className="bg-white px-6 py-7 rounded-2xl shadow-sm border border-gray-100 relative">
                  <div className="absolute top-0 left-0 w-1 h-full bg-ieumAmber rounded-l-2xl"></div>
                  <div className="flex items-center gap-3 mb-4">
                     {section.iconClass && (
                       <div className="w-9 h-9 rounded-full bg-ieumAmber/10 flex items-center justify-center text-ieumAmber border border-ieumAmber/20">
                         <i className={`${section.iconClass}`}></i>
                       </div>
                     )}
                     <h3 className="text-lg font-extrabold text-gray-900 pt-0.5">{section.subtitle}</h3>
                  </div>
                  <p className="text-[14px] text-gray-600 mb-5 break-keep font-medium">{section.body}</p>

                  <div className="space-y-2">
                    {section.extraData?.map((itemDesc, sIdx) => (
                      <div key={sIdx} className="flex items-start gap-3 py-2 border-b border-gray-50 last:border-0">
                        <i className="fa-solid fa-check text-ieumAmber mt-1"></i>
                        <span className="text-[14px] font-medium text-gray-700 leading-relaxed">{itemDesc}</span>
                      </div>
                    ))}
                  </div>
                </div>
              );
            }

            // 5. PROGRESS TYPE
            if (section.type === 'progress' && section.progressData) {
              const { current, target, label } = section.progressData;
              const percent = Math.min(100, Math.round((current / target) * 100));

              return (
                <div key={idx} className="bg-white px-6 py-7 rounded-2xl shadow-sm border border-ieumAmber/20 relative">
                  <div className="absolute top-0 left-0 w-1 h-full bg-ieumAmber rounded-l-2xl"></div>
                  <div className="flex justify-between items-end mb-4">
                    <div>
                      <h3 className="text-lg font-extrabold text-gray-900 mb-1">{section.subtitle}</h3>
                      <p className="text-[12px] text-gray-500 font-medium">{section.body}</p>
                    </div>
                    {section.iconClass && <i className={`${section.iconClass} text-2xl text-ieumAmber opacity-50`}></i>}
                  </div>

                  <div className="mt-6">
                    <div className="flex justify-between items-end mb-2">
                      <span className="text-[12px] font-bold text-gray-600">{label}</span>
                      <span className="text-lg font-black text-ieumAmber">{percent}%</span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-3 mb-2 overflow-hidden">
                      <div className="bg-ieumAmber h-3 rounded-full transition-all duration-1000 ease-out" style={{ width: `${percent}%` }}></div>
                    </div>
                    <div className="flex justify-between text-[11px] font-medium text-gray-400">
                      <span>현재 {current.toLocaleString()}명</span>
                      <span>목표 {target.toLocaleString()}명</span>
                    </div>
                  </div>
                </div>
              );
            }

            // 6. FAQ TYPE
            if (section.type === 'faq' && section.faqData) {
              return (
                <div key={idx} className="bg-white px-6 py-7 rounded-2xl shadow-sm border border-gray-100 relative">
                  <div className="absolute top-0 left-0 w-1 h-full bg-ieumAmber rounded-l-2xl"></div>
                  <div className="flex items-center gap-3 mb-5">
                    {section.iconClass && (
                      <div className="w-9 h-9 rounded-full bg-ieumAmber/10 flex items-center justify-center text-ieumAmber border border-ieumAmber/20">
                        <i className={`${section.iconClass}`}></i>
                      </div>
                    )}
                    <h3 className="text-lg font-bold text-gray-900 leading-tight">{section.subtitle}</h3>
                  </div>

                  <div className="space-y-4">
                    {section.faqData.map((faq, fIdx) => (
                      <div key={fIdx} className="bg-ieumLight/30 p-4 rounded-xl border border-ieumAmber/10">
                        <div className="flex gap-3 mb-2">
                          <span className="font-black text-ieumAmber">Q.</span>
                          <span className="text-[14px] font-bold text-gray-900 leading-snug">{faq.question}</span>
                        </div>
                        <div className="flex gap-3 pl-1">
                          <span className="font-black text-ieumMuted">A.</span>
                          <p className="text-[13px] text-gray-600 font-medium leading-relaxed">{faq.answer}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            }

            // DEFAULT TYPE
            return (
              <div key={idx} className="bg-white px-6 py-7 rounded-2xl shadow-sm border border-gray-100 relative">
                <div className="absolute top-0 left-0 w-1 h-full bg-ieumAmber rounded-l-2xl"></div>
                <div className="flex items-start gap-4">
                  {section.iconClass && (
                    <div className="w-9 h-9 flex-shrink-0 bg-ieumAmber/10 rounded-full flex items-center justify-center border border-ieumAmber/20 shadow-sm">
                      <i className={`${section.iconClass} text-ieumAmber`}></i>
                    </div>
                  )}
                  <div>
                    {section.subtitle && (
                      <h3 className="text-lg font-bold text-gray-900 mb-2 leading-tight pt-1">
                        {section.subtitle}
                      </h3>
                    )}
                    <div className="space-y-3">
                      {section.body.split('\n\n').map((para, pIdx) => (
                        <p key={pIdx} className="text-[14px] text-gray-600 leading-relaxed break-keep font-medium">
                          {para.split('\n').map((line, lIdx, arr) => (
                            <span key={lIdx}>{line}{lIdx < arr.length - 1 && <br />}</span>
                          ))}
                        </p>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          /* Fallback for items without detailedSections */
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <p className="text-[14px] text-gray-600 leading-relaxed whitespace-pre-line font-medium">
              {item.description}
            </p>
          </div>
        )}
      </section>

      {/* Fallback Legacy Images if exist */}
      {item.detailImages && item.detailImages.length > 0 && (
        <section className="px-5 pb-8 space-y-4 animate-fadeIn">
          <h4 className="text-[15px] font-bold text-gray-800 mb-3 px-1">활동 사진</h4>
          {item.detailImages.map((img, idx) => (
            <div key={idx} className="rounded-2xl overflow-hidden shadow-sm border border-gray-200 bg-white">
              <img 
                src={img} 
                alt={`detail-${idx}`} 
                className="w-full h-auto" 
                referrerPolicy="no-referrer"
              />
            </div>
          ))}
        </section>
      )}

      {/* Fixed Bottom Action Bar */}
      <div className="fixed bottom-0 left-0 w-full bg-white/95 backdrop-blur-lg border-t border-gray-200 p-4 pb-6 flex items-center justify-center z-[100]">
        <div className="w-full max-w-[1126px] flex items-center gap-3">
        <button 
          onClick={() => onToggleWishlist(item.id)}
          className={`flex flex-col items-center justify-center w-[54px] h-[54px] ${isWishlisted ? 'bg-red-50 border-red-200' : 'bg-white border-gray-300'} border shadow-sm rounded-xl transition-colors`}
        >
          <i className={`${isWishlisted ? 'fa-solid text-red-500' : 'fa-regular text-gray-500'} fa-heart text-xl`}></i>
          <span className={`text-[10px] font-bold mt-1 ${isWishlisted ? 'text-red-500' : 'text-gray-500'}`}>99+</span>
        </button>
        {item.category === Category.INTERVIEWS ? (
          <button
            onClick={() => navigate(`/category/${Category.INTERVIEWS}`)}
            className="flex-1 bg-gradient-to-r from-ieumAmber to-ieumGold hover:opacity-90 text-white font-black text-base h-[54px] rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-ieumAmber/30 active:scale-[0.98] transition-all"
          >
            <i className="fa-solid fa-book-open text-[14px]"></i>
            <span>인터뷰 보러가기</span>
          </button>
        ) : item.category === Category.INSIGHTS ? (
          <button
            onClick={() => navigate(`/category/${Category.INSIGHTS}`)}
            className="flex-1 bg-gradient-to-r from-ieumAmber to-ieumGold hover:opacity-90 text-white font-black text-base h-[54px] rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-ieumAmber/30 active:scale-[0.98] transition-all"
          >
            <i className="fa-solid fa-lightbulb text-[14px]"></i>
            <span>다른 인사이트 보러가기</span>
          </button>
        ) : item.deadline === '진행완료' ? (
          <button
            disabled
            className="flex-1 bg-gray-200 text-gray-400 font-black text-base h-[54px] rounded-xl flex items-center justify-center gap-2 cursor-not-allowed"
          >
            <i className="fa-solid fa-circle-check text-[14px]"></i>
            <span>진행 완료된 프로젝트입니다</span>
          </button>
        ) : (
          <button
            onClick={() => {
              if (item.externalLink) {
                window.open(item.externalLink, '_blank');
              } else {
                alert('해당 캠페인 채팅방으로 이동합니다.');
              }
            }}
            className="flex-1 bg-gradient-to-r from-ieumAmber to-ieumGold hover:opacity-90 text-white font-black text-base h-[54px] rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-ieumAmber/30 active:scale-[0.98] transition-all"
          >
            <span>신청하기</span>
            <i className="fa-solid fa-arrow-right text-[14px]"></i>
          </button>
        )}
        </div>
      </div>
    </div>
  );
};

export default ContentDetail;
