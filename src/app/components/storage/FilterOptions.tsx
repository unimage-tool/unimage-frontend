'use client';

import React from 'react';
import { TagIcon, ArrowsUpDownIcon } from '@heroicons/react/24/outline';

interface FilterOptionsProps {
  onTagSelect: (tags: string[]) => void;
  onSortChange: (sort: 'newest' | 'oldest' | 'title') => void;
  selectedTags: string[];
  sortBy: 'newest' | 'oldest' | 'title';
}

// 임시 태그 목록
const AVAILABLE_TAGS = ['웹', '디자인', '참고자료', '아이디어', '프로젝트', '개인', '업무'];

export default function FilterOptions({ 
  onTagSelect, 
  onSortChange, 
  selectedTags,
  sortBy 
}: FilterOptionsProps) {
  
  const handleTagClick = (tag: string) => {
    if (selectedTags.includes(tag)) {
      onTagSelect(selectedTags.filter(t => t !== tag));
    } else {
      onTagSelect([...selectedTags, tag]);
    }
  };
  
  return (
    <div className="flex flex-col md:flex-row justify-between gap-4 bg-gray-50 p-4 rounded-lg">
      <div className="flex flex-wrap gap-2 items-center">
        <div className="flex items-center mr-2">
          <TagIcon className="w-5 h-5 text-gray-500 mr-1" />
          <span className="text-gray-700 font-medium">태그:</span>
        </div>
        {AVAILABLE_TAGS.map(tag => (
          <button
            key={tag}
            onClick={() => handleTagClick(tag)}
            className={`px-3 py-1 rounded-full text-sm ${
              selectedTags.includes(tag)
                ? 'bg-blue-500 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            {tag}
          </button>
        ))}
      </div>
      
      <div className="flex items-center">
        <div className="flex items-center mr-2">
          <ArrowsUpDownIcon className="w-5 h-5 text-gray-500 mr-1" />
          <span className="text-gray-700 font-medium">정렬:</span>
        </div>
        <select
          value={sortBy}
          onChange={(e) => onSortChange(e.target.value as 'newest' | 'oldest' | 'title')}
          className="bg-white border border-gray-300 rounded-md px-3 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="newest">최신순</option>
          <option value="oldest">오래된순</option>
          <option value="title">제목순</option>
        </select>
      </div>
    </div>
  );
} 