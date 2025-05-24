'use client';

import React, { useState, useEffect, useCallback } from 'react';
import SearchBar from '../components/storage/SearchBar';
import ImageGrid from '../components/storage/ImageGrid';
import FilterOptions from '../components/storage/FilterOptions';
import Pagination from '../components/storage/Pagination';
import { Screenshot } from '../types/screenshot';
import { screenshotService } from '../services/screenshotService';

const ITEMS_PER_PAGE_OPTIONS = [12, 24, 36, 48];

export default function StoragePage() {
  const [screenshots, setScreenshots] = useState<Screenshot[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'title'>('newest');
  const [totalPages, setTotalPages] = useState(1);
  const [error, setError] = useState<string | null>(null);
  const [itemsPerPage, setItemsPerPage] = useState(12);

  const fetchScreenshots = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await screenshotService.getScreenshots({
        page: currentPage,
        limit: itemsPerPage,
        search: searchQuery,
        tags: selectedTags,
        sortBy,
      });

      setScreenshots(response.items);
      setTotalPages(response.totalPages);
    } catch (error) {
      console.error('스크린샷을 불러오는데 실패했습니다:', error);
      setError('스크린샷을 불러오는데 실패했습니다. 다시 시도해주세요.');
    } finally {
      setLoading(false);
    }
  }, [currentPage, searchQuery, selectedTags, sortBy, itemsPerPage]);

  useEffect(() => {
    fetchScreenshots();
  }, [fetchScreenshots]);

  const handleItemsPerPageChange = (newItemsPerPage: number) => {
    setItemsPerPage(newItemsPerPage);
    setCurrentPage(1);
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setCurrentPage(1);
  };

  const handleTagSelect = (tags: string[]) => {
    setSelectedTags(tags);
    setCurrentPage(1);
  };

  const handleSortChange = (sort: 'newest' | 'oldest' | 'title') => {
    setSortBy(sort);
    setCurrentPage(1);
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

      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center space-x-2">
          <span className="text-gray-600">페이지당 표시:</span>
          <select
            value={itemsPerPage}
            onChange={(e) => handleItemsPerPageChange(Number(e.target.value))}
            className="border border-gray-300 rounded-md px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {ITEMS_PER_PAGE_OPTIONS.map((option) => (
              <option key={option} value={option}>
                {option}개
              </option>
            ))}
          </select>
        </div>
        <div className="text-gray-600">
          총 {screenshots.length}개의 스크린샷
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : error ? (
        <div className="text-center py-16">
          <h3 className="text-xl font-semibold mb-2 text-red-600">{error}</h3>
          <button
            onClick={fetchScreenshots}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            다시 시도
          </button>
        </div>
      ) : screenshots.length === 0 ? (
        <div className="text-center py-16">
          <h3 className="text-xl font-semibold mb-2">검색 결과가 없습니다</h3>
          <p className="text-gray-600">다른 검색어나 필터를 시도해보세요.</p>
        </div>
      ) : (
        <>
          <ImageGrid screenshots={screenshots} />

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
