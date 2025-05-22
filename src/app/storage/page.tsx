'use client';

import React, { useState, useEffect } from 'react';
import SearchBar from '../components/storage/SearchBar';
import ImageGrid from '../components/storage/ImageGrid';
import FilterOptions from '../components/storage/FilterOptions';
import Pagination from '../components/storage/Pagination';
import { Screenshot } from '../types/screenshot';

// 임시 데이터
const MOCK_SCREENSHOTS: Screenshot[] = Array.from({ length: 30 }, (_, i) => ({
  id: i + 1,
  title: `스크린샷 ${i + 1}`,
  url: `https://example.com/page${i + 1}`,
  imageUrl: `/images/capture.jpg`,
  createdAt: new Date(Date.now() - i * 86400000).toISOString(),
  tags: ['웹', '디자인', '참고자료'].slice(0, (i % 3) + 1),
}));

export default function StoragePage() {
  const [screenshots, setScreenshots] = useState<Screenshot[]>([]);
  const [filteredScreenshots, setFilteredScreenshots] = useState<Screenshot[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'title'>('newest');
  
  const itemsPerPage = 12;
  
  useEffect(() => {
    // API 호출 대신 임시 데이터 사용
    setTimeout(() => {
      setScreenshots(MOCK_SCREENSHOTS);
      setFilteredScreenshots(MOCK_SCREENSHOTS);
      setLoading(false);
    }, 800);
  }, []);
  
  useEffect(() => {
    // 검색어, 태그, 정렬 기준에 따라 스크린샷 필터링
    let result = [...screenshots];
    
    // 검색어 필터링
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (item) => 
          item.title.toLowerCase().includes(query) || 
          item.url.toLowerCase().includes(query)
      );
    }
    
    // 태그 필터링
    if (selectedTags.length > 0) {
      result = result.filter((item) => 
        selectedTags.some(tag => item.tags.includes(tag))
      );
    }
    
    // 정렬
    result.sort((a, b) => {
      if (sortBy === 'newest') {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      } else if (sortBy === 'oldest') {
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      } else {
        return a.title.localeCompare(b.title);
      }
    });
    
    setFilteredScreenshots(result);
    setCurrentPage(1); // 필터링 시 첫 페이지로 이동
  }, [searchQuery, selectedTags, sortBy, screenshots]);
  
  // 현재 페이지에 표시할 스크린샷
  const currentScreenshots = filteredScreenshots.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
  
  const totalPages = Math.ceil(filteredScreenshots.length / itemsPerPage);
  
  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };
  
  const handleTagSelect = (tags: string[]) => {
    setSelectedTags(tags);
  };
  
  const handleSortChange = (sort: 'newest' | 'oldest' | 'title') => {
    setSortBy(sort);
  };
  
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">내 스크린샷 저장소</h1>
      
      <div className="mb-8">
        <SearchBar onSearch={handleSearch} />
      </div>
      
      <div className="mb-8">
        <FilterOptions 
          onTagSelect={handleTagSelect} 
          onSortChange={handleSortChange}
          selectedTags={selectedTags}
          sortBy={sortBy}
        />
      </div>
      
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : filteredScreenshots.length === 0 ? (
        <div className="text-center py-16">
          <h3 className="text-xl font-semibold mb-2">검색 결과가 없습니다</h3>
          <p className="text-gray-600">다른 검색어나 필터를 시도해보세요.</p>
        </div>
      ) : (
        <>
          <ImageGrid screenshots={currentScreenshots} />
          
          <div className="mt-8">
            <Pagination 
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          </div>
        </>
      )}
    </div>
  );
} 