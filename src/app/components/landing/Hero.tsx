import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

export default function Hero() {
  return (
    <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white">
      <div className="container mx-auto px-4 py-20 flex flex-col md:flex-row items-center">
        <div className="md:w-1/2 mb-10 md:mb-0">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            웹 스크린샷을 쉽게 저장하고 관리하세요
          </h1>
          <p className="text-xl mb-8">
            중요한 웹 콘텐츠를 스크린샷으로 캡처하고, 링크와 함께 저장하여 언제든지 쉽게 찾아보세요.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link href="/auth/signin" className="bg-white text-blue-600 hover:bg-gray-100 font-semibold py-3 px-6 rounded-lg text-center">
              시작하기
            </Link>
            <a 
              href="https://chrome.google.com/webstore" 
              target="_blank" 
              rel="noopener noreferrer"
              className="bg-transparent border-2 border-white hover:bg-white hover:text-blue-600 font-semibold py-3 px-6 rounded-lg text-center transition-colors"
            >
              크롬 익스텐션 설치
            </a>
          </div>
        </div>
        <div className="md:w-1/2">
          <div className="relative h-[400px] w-full">
            <Image 
              src="/images/capture.jpg"
              alt="스크린샷 캡처 데모" 
              width={600}
              height={400}
              className="object-contain rounded-lg shadow-2xl"
            />
          </div>
        </div>
      </div>
    </div>
  );
} 