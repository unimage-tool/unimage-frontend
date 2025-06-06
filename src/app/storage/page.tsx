import React from 'react';
import Link from 'next/link';
import { FaPlus } from 'react-icons/fa';
import StorageClient from '../components/storage/StorageClient';
import { Screenshot } from '../types/screenshot';

interface StoragePageProps {
  searchParams: {
    page?: string;
    limit?: string;
    search?: string;
    sortBy?: 'newest' | 'oldest' | 'title';
  };
}

async function getScreenshots({
  page,
  limit,
  search,
  sortBy,
}: {
  page: number;
  limit: number;
  search?: string;
  sortBy: 'newest' | 'oldest' | 'title';
}) {
  const params = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
    sortBy,
  });

  if (search) {
    params.append('search', search);
  }

  const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/screenshots?${params.toString()}`);
  
  if (!response.ok) {
    throw new Error('스크린샷을 불러오는데 실패했습니다');
  }

  return response.json();
}

export default async function StoragePage({ searchParams }: StoragePageProps) {
  const page = parseInt(searchParams.page || '1');
  const limit = parseInt(searchParams.limit || '12');
  const search = searchParams.search;
  const sortBy = searchParams.sortBy || 'newest';

  const response = await getScreenshots({
    page,
    limit,
    search,
    sortBy,
  });

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">내 스크린샷 저장소</h1>
        <Link
          href="/upload"
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center space-x-2 transition-colors"
        >
          <FaPlus />
          <span>이미지 업로드</span>
        </Link>
      </div>

      <StorageClient initialData={response} />
    </div>
  );
}
