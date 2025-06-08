import React from 'react';
import Link from 'next/link';
import { FaPlus } from 'react-icons/fa';
import StorageClient from '../components/storage/StorageClient';

export default async function StoragePage() {
  const response = await fetch('https://api.unimages.com/images', {
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
  });
  
  if (!response.ok) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-16">
          <h3 className="text-xl font-semibold mb-2 text-red-600">스크린샷을 불러오는데 실패했습니다</h3>
          <p className="text-gray-600">잠시 후 다시 시도해주세요.</p>
        </div>
      </div>
    );
  }

  const data = await response.json();
  
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

      <StorageClient initialData={data} />
    </div>
  );
}