'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

export default function AuthButton() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true); // 초기 로딩 상태
  const [isButtonLoading, setIsButtonLoading] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  const checkSession = async () => {
    try {
      const response = await fetch('/api/auth/check', {
        credentials: 'include',
      });
      
      if (!response.ok) {
        throw new Error('인증 상태 확인 실패');
      }

      const data = await response.json();
      const authenticated = data.authenticated;
      setIsLoggedIn(authenticated);
      
      // 루트 페이지에서 인증되지 않은 경우 리다이렉트
      if (pathname === '/' && !authenticated) {
        router.push('/about');
      }
      
    } catch (error) {
      console.error('세션 확인 실패:', error);
      setIsLoggedIn(false);
      
      // 루트 페이지에서 오류 발생 시 리다이렉트
      if (pathname === '/') {
        router.push('/about');
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    checkSession();
    
    const handleFocus = () => checkSession();
    window.addEventListener('focus', handleFocus);
    
    return () => {
      window.removeEventListener('focus', handleFocus);
    };
  }, [pathname]);
  
  const handleLogout = async () => {
    setIsButtonLoading(true);
    
    try {
      const response = await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include',
      });
      
      if (response.ok) {
        setIsLoggedIn(false);
        router.push('/about'); // 로그아웃 후 about 페이지로
      } else {
        const data = await response.json();
        throw new Error(data.error || '로그아웃 요청 실패');
      }
    } catch (error) {
      console.error('로그아웃 실패:', error);
      alert('로그아웃 중 오류가 발생했습니다. 다시 시도해주세요.');
    } finally {
      setIsButtonLoading(false);
    }
  };

  // 초기 로딩 중에는 빈 상태 표시
  if (isLoading) {
    return (
      <div className="w-20 h-10 bg-gray-200 animate-pulse rounded-lg"></div>
    );
  }

  if (isLoggedIn) {
    return (
      <button
        onClick={handleLogout}
        disabled={isButtonLoading}
        className={`px-4 py-2 rounded-lg text-white font-medium transition-colors ${
          isButtonLoading 
            ? 'bg-gray-400 cursor-not-allowed' 
            : 'bg-red-600 hover:bg-red-700'
        }`}
      >
        {isButtonLoading ? '로그아웃 중...' : '로그아웃'}
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