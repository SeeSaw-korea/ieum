
import React from 'react';
import { ContentItem } from '../types';
import { getImageUrl } from '../lib/imageUrl';

interface CardProps {
  item: ContentItem;
  isWishlisted: boolean;
  onToggleWishlist: (id: string) => void;
  onClick?: () => void;
  variant?: 'large' | 'small';
  dark?: boolean;
}

const Card: React.FC<CardProps> = ({ item, isWishlisted, onToggleWishlist, onClick, variant = 'large', dark = false }) => {
  return (
    <div
      onClick={onClick}
      className={`relative flex-shrink-0 rounded-2xl overflow-hidden cursor-pointer transition-all active:scale-95 ${
        dark ? 'bg-white/10 border border-white/15' : 'bg-white border border-ieumBorder shadow-sm hover:shadow-md'
      } ${variant === 'large' ? 'w-44' : 'w-36'}`}
    >
      <div className="relative aspect-[3/4] bg-gray-50">
        <img
          src={getImageUrl(item.imageUrl)}
          alt={item.title}
          className="w-full h-full object-contain"
        />
        {item.tag && (
          <div className={`absolute bottom-2 left-2 text-[9px] font-bold px-1.5 py-0.5 rounded ${
            dark ? 'bg-ieumOrange text-white' : 'bg-ieumNavy text-white'
          }`}>
            {item.tag}
          </div>
        )}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleWishlist(item.id);
          }}
          className="absolute top-2 right-2 w-7 h-7 flex items-center justify-center bg-white/70 backdrop-blur-sm rounded-full"
        >
          <i className={`fa-${isWishlisted ? 'solid' : 'regular'} fa-heart text-ieumOrange text-sm`}></i>
        </button>
      </div>
      <div className="p-3">
        <p className={`text-[10px] font-semibold mb-1 ${dark ? 'text-white/50' : 'text-ieumMuted'}`}>{item.category}</p>
        <h3 className={`text-xs font-bold leading-relaxed line-clamp-2 ${dark ? 'text-white' : 'text-ieumDark'}`}>{item.title}</h3>
        {item.deadline && (
          <div className="mt-2">
            <span className={`text-xs font-bold ${dark ? 'text-ieumOrange' : 'text-ieumOrange'}`}>{item.deadline}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default Card;
