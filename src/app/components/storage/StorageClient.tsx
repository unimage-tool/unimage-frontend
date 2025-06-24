'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import SearchBar from './SearchBar';
import ImageGrid from './ImageGrid';
import FilterOptions from './FilterOptions';
import { Image } from '../../types/image';

function StorageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [images, setImages] = useState<Image[]>([]);
  const [filteredImages, setFilteredImages] = useState<Image[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('/api/images', {
          credentials: 'include',
        });

        if (!response.ok) {
          throw new Error('이미지를 불러오는데 실패했습니다');
        }

        const data = await response.json();
        setImages(data);
        setFilteredImages(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : '알 수 없는 오류가 발생했습니다');
      } finally {
        setIsLoading(false);
      }
    };

    fetchImages();
  }, []);

  // URL 파라미터 변경 시 필터링 및 정렬 적용
  useEffect(() => {
    if (images.length === 0) return;

    let filtered = [...images];
    const searchQuery = searchParams.get('search');
    const sortBy = searchParams.get('sortBy') as 'newest' | 'oldest' | 'title' || 'newest';

    // 검색 필터링
    if (searchQuery) {
      filtered = filtered.filter(image => 
        image.fileName.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // 정렬
    switch (sortBy) {
      case 'newest':
        filtered.sort((a, b) => new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime());
        break;
      case 'oldest':
        filtered.sort((a, b) => new Date(a.uploadedAt).getTime() - new Date(b.uploadedAt).getTime());
        break;
      case 'title':
        filtered.sort((a, b) => a.fileName.localeCompare(b.fileName));
        break;
    }

    setFilteredImages(filtered);
  }, [images, searchParams]);

  const handleSearch = (query: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (query.trim()) {
      params.set('search', query.trim());
    } else {
      params.delete('search');
    }
    router.push(`/?${params.toString()}`);
  };

  const handleSortChange = (sort: 'newest' | 'oldest' | 'title') => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('sortBy', sort);
    router.push(`/?${params.toString()}`);
  };

  if (isLoading) {
    return (
      <div className="text-center py-16">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-4 text-gray-600">이미지를 불러오는 중...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-16">
        <h3 className="text-xl font-semibold mb-2 text-red-600">{error}</h3>
        <p className="text-gray-600">잠시 후 다시 시도해주세요.</p>
      </div>
    );
  }

  const currentSearch = searchParams.get('search') || '';
  const currentSort = searchParams.get('sortBy') as 'newest' | 'oldest' | 'title' || 'newest';

  return (
    <>
      <div className="mb-8">
        <SearchBar onSearch={handleSearch} defaultValue={currentSearch} />
      </div>

      <div className="mb-8">
        <FilterOptions
          onSortChange={handleSortChange}
          sortBy={currentSort}
        />
      </div>

      <div className="flex justify-between items-center mb-4">
        <div className="text-gray-600">
          총 {filteredImages.length}개의 스크린샷
          {currentSearch && (
            <span className="ml-2 text-blue-600">
              (&apos;{currentSearch}&apos; 검색 결과)
            </span>
          )}
        </div>
      </div>

      {filteredImages.length === 0 ? (
        <div className="text-center py-16">
          <h3 className="text-xl font-semibold mb-2">
            {currentSearch ? '검색 결과가 없습니다' : '저장된 스크린샷이 없습니다'}
          </h3>
          <p className="text-gray-600 mb-4">
            {currentSearch 
              ? '다른 검색어를 시도해보세요.' 
              : '첫 번째 스크린샷을 업로드해보세요.'
            }
          </p>
        </div>
      ) : (
        <ImageGrid 
          screenshots={filteredImages} 
        />
      )}
    </>
  );
}

export default function StorageClient() {
  return (
    <Suspense fallback={
      <div className="text-center py-16">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-4 text-gray-600">로딩 중...</p>
      </div>
    }>
      <StorageContent />
    </Suspense>
  );
}