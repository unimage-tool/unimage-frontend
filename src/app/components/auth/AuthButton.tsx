'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function AuthButton() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const checkSession = () => {
    // 더 정확한 세션 체크
    const cookies = document.cookie.split(';');
    const sessionCookie = cookies.find(cookie => 
      cookie.trim().startsWith('session=')
    );
    
    // 세션 쿠키가 존재하고 값이 있는지 확인
    const hasValidSession = sessionCookie && 
      sessionCookie.split('=')[1] && 
      sessionCookie.split('=')[1].trim() !== '';
    
    setIsLoggedIn(!!hasValidSession);
  };

  useEffect(() => {
    // 초기 체크
    checkSession();

    // 페이지 포커스 시 세션 재확인
    const handleFocus = () => checkSession();
    window.addEventListener('focus', handleFocus);

    // 주기적으로 세션 상태 확인 (선택적)
    const interval = setInterval(checkSession, 30000); // 30초마다

    return () => {
      window.removeEventListener('focus', handleFocus);
      clearInterval(interval);
    };
  }, []);

  // 쿠키 변경을 감지하는 더 효율적인 방법
  useEffect(() => {
    const originalDocumentCookie = document.cookie;
    
    const checkCookieChanges = () => {
      if (document.cookie !== originalDocumentCookie) {
        checkSession();
      }
    };

    const interval = setInterval(checkCookieChanges, 1000); // 1초마다 체크
    
    return () => clearInterval(interval);
  }, []);

  const handleLogout = async () => {
    setIsLoading(true);
    
    try {
      const response = await fetch('https://api.unimages.com/auth/session-logout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', // 쿠키 자동 전송
      });
      
      if (response.ok) {
        // 쿠키 클리어 (브라우저에서도 제거)
        document.cookie = 'session=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
        setIsLoggedIn(false);
        router.push('/');
      } else {
        throw new Error('로그아웃 요청 실패');
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