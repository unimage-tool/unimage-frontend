'use client';

import React from 'react';
import Link from 'next/link';
import { FaCheck } from 'react-icons/fa';

const plans = [
  {
    name: '무료',
    price: '0',
    description: '기본적인 기능을 무료로 사용해보세요',
    features: [
      '월 50개 스크린샷 저장',
      '기본 검색 기능',
      'URL 자동 저장',
      '기본 태그 기능',
    ],
    buttonText: '시작하기',
    buttonLink: '/auth/signin',
    highlighted: false,
  },
  {
    name: '프로',
    price: '9,900',
    description: '더 많은 기능과 저장 공간을 원하시나요?',
    features: [
      '무제한 스크린샷 저장',
      '고급 검색 기능',
      'URL 자동 저장',
      '고급 태그 및 폴더 기능',
      '우선 지원',
      '광고 제거',
    ],
    buttonText: '프로 시작하기',
    buttonLink: '/auth/signin',
    highlighted: true,
  },
  {
    name: '팀',
    price: '29,900',
    description: '팀과 함께 효율적으로 작업하세요',
    features: [
      '프로 플랜의 모든 기능',
      '팀 멤버 관리',
      '공유 폴더',
      '팀 통계 및 분석',
      '전용 지원 매니저',
      'API 액세스',
    ],
    buttonText: '팀 시작하기',
    buttonLink: '/auth/signin',
    highlighted: false,
  },
];

export default function Pricing() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            간단하고 투명한 요금제
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            필요에 맞는 요금제를 선택하세요. 모든 요금제는 14일 무료 체험을
            제공합니다.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`bg-white rounded-2xl shadow-lg overflow-hidden ${
                plan.highlighted
                  ? 'ring-2 ring-blue-600 transform scale-105'
                  : ''
              }`}
            >
              <div className="p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  {plan.name}
                </h2>
                <p className="text-gray-600 mb-6">{plan.description}</p>
                <div className="mb-6">
                  <span className="text-4xl font-bold text-gray-900">
                    ₩{plan.price}
                  </span>
                  <span className="text-gray-600">/월</span>
                </div>
                <Link
                  href={plan.buttonLink}
                  className={`block w-full py-3 px-4 rounded-lg text-center font-medium ${
                    plan.highlighted
                      ? 'bg-blue-600 text-white hover:bg-blue-700'
                      : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                  }`}
                >
                  {plan.buttonText}
                </Link>
              </div>
              <div className="bg-gray-50 p-8">
                <ul className="space-y-4">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start">
                      <FaCheck className="h-5 w-5 text-green-500 mt-0.5 mr-3" />
                      <span className="text-gray-600">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-16 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            자주 묻는 질문
          </h2>
          <p className="text-gray-600 mb-8">
            더 자세한 내용이 필요하신가요?{' '}
            <Link href="/faq" className="text-blue-600 hover:text-blue-700">
              FAQ 페이지
            </Link>
            를 확인해보세요.
          </p>
        </div>
      </div>
    </div>
  );
}
