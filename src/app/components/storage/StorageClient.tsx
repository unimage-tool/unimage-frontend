'use client';

import React from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import SearchBar from './SearchBar';
import ImageGrid from './ImageGrid';
import FilterOptions from './FilterOptions';
import Pagination from './Pagination';
import { Screenshot } from '../../types/screenshot';

interface StorageClientProps {
  initialData: {
    items: Screenshot[];
    total: number;
    page: number;
    totalPages: number;
  };
}

export default function StorageClient({ initialData }: StorageClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleSearch = (query: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('search', query);
    params.set('page', '1');
    router.push(`/storage?${params.toString()}`);
  };

  const handleSortChange = (sort: 'newest' | 'oldest' | 'title') => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('sortBy', sort);
    params.set('page', '1');
    router.push(`/storage?${params.toString()}`);
  };

  const handleItemsPerPageChange = (newLimit: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('limit', newLimit.toString());
    params.set('page', '1');
    router.push(`/storage?${params.toString()}`);
  };

  const handlePageChange = (page: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('page', page.toString());
    router.push(`/storage?${params.toString()}`);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      <div className="mb-8">
        <SearchBar onSearch={handleSearch} />
      </div>

      <div className="mb-8">
        <FilterOptions
          onSortChange={handleSortChange}
          sortBy={searchParams.get('sortBy') as 'newest' | 'oldest' | 'title' || 'newest'}
        />
      </div>

      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center space-x-2">
          <span className="text-gray-600">페이지당 표시:</span>
          <select
            value={searchParams.get('limit') || '12'}
            onChange={(e) => handleItemsPerPageChange(Number(e.target.value))}
            className="border border-gray-300 rounded-md px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {[12, 24, 36, 48].map((option) => (
              <option key={option} value={option}>
                {option}개
              </option>
            ))}
          </select>
        </div>
        <div className="text-gray-600">
          총 {initialData.total}개의 스크린샷
        </div>
      </div>

      {initialData.items.length === 0 ? (
        <div className="text-center py-16">
          <h3 className="text-xl font-semibold mb-2">검색 결과가 없습니다</h3>
          <p className="text-gray-600 mb-4">
            다른 검색어나 필터를 시도해보세요.
          </p>
        </div>
      ) : (
        <>
          <ImageGrid screenshots={initialData.items} />

          <div className="mt-8">
            <Pagination
              currentPage={initialData.page}
              totalPages={initialData.totalPages}
              onPageChange={handlePageChange}
            />
          </div>
        </>
      )}
    </>
  );
} 