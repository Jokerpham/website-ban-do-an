import React from 'react';
import { MealCategory } from '../types';
import { MEAL_CATEGORIES } from '../data/mockData';

interface QuickSearchSectionProps {
  selectedCategory: string | null;
  onSelectCategory: (categoryId: string) => void;
}

export const QuickSearchSection: React.FC<QuickSearchSectionProps> = ({
  selectedCategory,
  onSelectCategory,
}) => {
  return (
    <section className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Section Header matching demo */}
      <div className="mb-8 sm:mb-10 text-left">
        <h2 className="text-2xl sm:text-3xl lg:text-[34px] font-bold text-[#192f60] tracking-tight">
          Tìm kiếm nhanh
        </h2>
        <p className="mt-1 text-slate-500 text-sm sm:text-base font-medium">
          Khám phá các nhà hàng theo loại món ăn
        </p>
      </div>

      {/* 2x3 Grid of Cards matching demo layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7">
        {MEAL_CATEGORIES.map((category) => {
          const isSelected = selectedCategory === category.id;

          return (
            <div
              key={category.id}
              onClick={() => onSelectCategory(category.id)}
              className={`group flex items-stretch bg-white rounded-xl sm:rounded-2xl overflow-hidden cursor-pointer transition-all duration-200 ${
                isSelected
                  ? 'ring-2 ring-red-500 shadow-md translate-y-[-2px]'
                  : 'shadow-xs hover:shadow-lg hover:-translate-y-1 border border-slate-100 hover:border-slate-200'
              }`}
            >
              {/* Left Image: ~38% width, covers full height */}
              <div className="w-[38%] min-w-[125px] sm:min-w-[140px] relative overflow-hidden bg-slate-100 shrink-0">
                <img
                  src={category.image}
                  alt={category.title}
                  className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
                  referrerPolicy="no-referrer"
                  loading="lazy"
                />
              </div>

              {/* Right Content */}
              <div className="flex-1 p-4 sm:p-5 flex flex-col justify-center">
                <h3 className="text-base sm:text-lg font-bold text-[#192f60] group-hover:text-red-600 transition-colors">
                  {category.title}
                </h3>
                <p className="mt-1.5 text-xs sm:text-sm text-slate-500 leading-relaxed font-normal">
                  {category.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
