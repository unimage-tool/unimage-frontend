import React from 'react';
import { redirect } from 'next/navigation';
import StorageClient from './components/storage/StorageClient';
import Link from 'next/link';
import { FaPlus } from 'react-icons/fa';
import { headers } from 'next/headers';

async function checkAuth() {
  try {
    const headersList = await headers();
    const cookie = headersList.get('cookie') || '';
    const response = await fetch(`https://api.unimages.com/auth/check`, {
      headers: {
        'Cookie': cookie,
      },
    });

    if (!response.ok) {
      throw new Error('인증 상태 확인 실패');
    }

    const { data } = await response.json();
    return data.authenticated;
  } catch (error) {
    console.error('인증 상태 확인 실패:', error);
    return false;
  }
}

export default async function Home() {

  try {
    const isAuthenticated = await checkAuth();
    if (!isAuthenticated) {
      redirect('/about');
    } else {
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
          <StorageClient />
        </div>
      )
    }
  } catch (error) {
    console.error('인증 상태 확인 실패:', error);
    redirect('/about');
  }
}
