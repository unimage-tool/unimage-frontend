'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function AuthButton() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const checkSession = async () => {
    try {
      const response = await fetch('/api/auth/check', {
        credentials: 'include',
      });
      
      if (!response.ok) {
        throw new Error('인증 상태 확인 실패');
      }

      const data = await response.json();
      console.log('인증 상태:', data); // 디버깅용
      setIsLoggedIn(data.authenticated);
    } catch (error) {
      console.error('세션 확인 실패:', error);
      setIsLoggedIn(false);
    }
  };

  useEffect(() => {
    checkSession();
    
    const handleFocus = () => checkSession();
    window.addEventListener('focus', handleFocus);
    
    return () => {
      window.removeEventListener('focus', handleFocus);
    };
  }, []);
  
  const handleLogout = async () => {
    setIsLoading(true);
    
    try {
      const response = await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include',
      });
      
      if (response.ok) {
        setIsLoggedIn(false);
        router.push('/');
      } else {
        const data = await response.json();
        throw new Error(data.error || '로그아웃 요청 실패');
      }
    } catch (error) {
      console.error('로그아웃 실패:', error);
      alert('로그아웃 중 오류가 발생했습니다. 다시 시도해주세요.');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoggedIn) {
    return (
      <button
        onClick={handleLogout}
        disabled={isLoading}
        className={`px-4 py-2 rounded-lg text-white font-medium transition-colors ${
          isLoading 
            ? 'bg-gray-400 cursor-not-allowed' 
            : 'bg-red-600 hover:bg-red-700'
        }`}
      >
        {isLoading ? '로그아웃 중...' : '로그아웃'}
      </button>
    );
  }

  return (
    <Link
      href="/auth/signin"
      className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 font-medium transition-colors inline-block"
    >
      로그인
    </Link>
  );
}