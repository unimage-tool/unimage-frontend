'use client';

import React from 'react';
import { ArrowsUpDownIcon } from '@heroicons/react/24/outline';

interface FilterOptionsProps {
  onSortChange: (sort: 'newest' | 'oldest' | 'title') => void;
  sortBy: 'newest' | 'oldest' | 'title';
}

export default function FilterOptions({ 
  onSortChange, 
  sortBy 
}: FilterOptionsProps) {
  return (
    <div className="flex justify-end gap-4 bg-gray-50 p-4 rounded-lg">
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