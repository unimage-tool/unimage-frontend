import React from 'react';
import Image from 'next/image';
import { CheckIcon } from '@heroicons/react/24/solid';

const features = [
  {
    title: '간편한 스크린샷 캡처',
    description: '원하는 웹페이지의 특정 부분을 클릭 한 번으로 캡처하세요.',
    icon: '/images/capture.jpg',
  },
  {
    title: '자동 URL 저장',
    description: '캡처한 이미지와 함께 원본 URL이 자동으로 저장됩니다.',
    icon: '/images/dashboard.jpg',
  },
  {
    title: '클라우드 동기화',
    description:
      '모든 스크린샷이 클라우드에 저장되어 어디서든 접근 가능합니다.',
    icon: '/images/storage.jpg',
  },
  {
    title: '쉬운 관리 및 검색',
    description:
      '저장된 스크린샷을 태그, 날짜, URL로 쉽게 검색하고 관리하세요.',
    icon: '/images/dashboard.jpg',
  },
];

export default function Features() {
  return (
    <section id="features" className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold mb-4">주요 기능</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            웹 콘텐츠를 효율적으로 저장하고 관리할 수 있는 다양한 기능을
            제공합니다.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow"
            >
              <div className="w-full h-48 mb-4 relative overflow-hidden">
                <Image
                  src={feature.icon}
                  alt={feature.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                />
              </div>
              <div className="mt-2">
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-16 bg-white p-8 rounded-lg shadow-md">
          <h3 className="text-2xl font-bold mb-6 text-center">
            모든 플랜에 포함된 기능
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              '무제한 스크린샷 저장',
              'URL 자동 저장',
              '태그 및 폴더 정리',
              '크로스 브라우저 지원',
              '클라우드 백업',
              '고급 검색 기능',
            ].map((item, index) => (
              <div key={index} className="flex items-center">
                <CheckIcon className="h-6 w-6 text-green-500 mr-2" />
                <span>{item}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
