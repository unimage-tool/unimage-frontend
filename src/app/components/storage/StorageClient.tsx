'use client';

import React from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import SearchBar from './SearchBar';
import ImageGrid from './ImageGrid';
import FilterOptions from './FilterOptions';

interface Image {
  originalUrl: string;
  width: number;
  height: number;
  objectKey: string;
  fileName: string;
  size: number;
  screenshot: string;
  uploadedAt: string;
}

export default function StorageClient({ initialData }: { initialData: Image[] }) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleSearch = (query: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('search', query);
    router.push(`/storage?${params.toString()}`);
  };

  const handleSortChange = (sort: 'newest' | 'oldest' | 'title') => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('sortBy', sort);
    router.push(`/storage?${params.toString()}`);
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
        <div className="text-gray-600">
          총 {initialData.length}개의 스크린샷
        </div>
      </div>

      {initialData.length === 0 ? (
        <div className="text-center py-16">
          <h3 className="text-xl font-semibold mb-2">검색 결과가 없습니다</h3>
          <p className="text-gray-600 mb-4">
            다른 검색어나 필터를 시도해보세요.
          </p>
        </div>
      ) : (
        <ImageGrid screenshots={initialData} />
      )}
    </>
  );
} 