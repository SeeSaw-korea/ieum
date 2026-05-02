import React from 'react';
import { Category } from '../types';
import { useNavigate } from 'react-router-dom';

const CategoryList: React.FC = () => {
  const navigate = useNavigate();

  const handleClick = (cat: string) => {
    if (cat === Category.TYPE_TEST) {
      navigate('/type-test');
    } else {
      navigate(`/category/${cat}`);
    }
  };

  return (
    <div className="px-5 py-4 space-y-6">
      <h2 className="text-xl font-bold">카테고리 탐색</h2>
      <div className="grid grid-cols-2 gap-4">
        {Object.values(Category).map((cat) => (
          <button
            key={cat}
            onClick={() => handleClick(cat)}
            className="h-28 bg-seeSawCream rounded-2xl flex flex-col items-center justify-center gap-3 hover:bg-seeSawAmber/8 transition-colors border border-transparent hover:border-seeSawAmber/20 shadow-sm"
          >
            <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center text-xl text-seeSawAmber">
              {cat === Category.PROJECTS && <i className="fa-solid fa-puzzle-piece"></i>}
              {cat === Category.SEMINARS && <i className="fa-solid fa-users-rays"></i>}
              {cat === Category.INSIGHTS && <i className="fa-solid fa-lightbulb"></i>}
              {cat === Category.CAMPAIGNS && <i className="fa-solid fa-bullhorn"></i>}
              {cat === Category.INTERVIEWS && <i className="fa-solid fa-microphone"></i>}
              {cat === Category.ESSAYS && <i className="fa-solid fa-pen-nib"></i>}
              {cat === Category.TYPE_TEST && <i className="fa-solid fa-clipboard-question"></i>}
            </div>
            <span className="text-sm font-bold text-gray-700">{cat}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default CategoryList;
