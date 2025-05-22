import React from 'react';
import Link from 'next/link';

export default function CTA() {
  return (
    <section className="py-20 bg-gradient-to-r from-blue-500 to-purple-600 text-white">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-6">
          지금 바로 시작하세요
        </h2>
        <p className="text-xl mb-10 max-w-2xl mx-auto">
          중요한 웹 콘텐츠를 놓치지 마세요. 지금 바로 가입하고 크롬 익스텐션을
          설치하여 웹 스크린샷을 쉽게 관리하세요.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/auth/signin"
            className="bg-white text-blue-600 hover:bg-gray-100 font-semibold py-3 px-8 rounded-lg text-center"
          >
            무료로 시작하기
          </Link>
          <a 
            href="https://chrome.google.com/webstore" 
            target="_blank" 
            rel="noopener noreferrer"
            className="bg-transparent border-2 border-white hover:bg-white hover:text-blue-600 font-semibold py-3 px-8 rounded-lg text-center transition-colors"
          >
            크롬 익스텐션 설치
          </a>
        </div>
      </div>
    </section>
  );
} 