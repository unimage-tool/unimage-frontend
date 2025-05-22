'use client';

import React, { useState } from 'react';
import Image from 'next/image';

const steps = [
  {
    title: '익스텐션 설치',
    description: '크롬 웹 스토어에서 익스텐션을 설치하세요.',
    image: '/images/capture.jpg',
  },
  {
    title: '계정 연결',
    description: '구글 계정으로 간편하게 로그인하세요.',
    image: '/images/dashboard.jpg',
  },
  {
    title: '스크린샷 캡처',
    description: '웹페이지에서 원하는 부분을 선택하여 캡처하세요.',
    image: '/images/capture.jpg',
  },
  {
    title: '저장 및 관리',
    description: '캡처된 스크린샷을 웹사이트에서 확인하고 관리하세요.',
    image: '/images/storage.jpg',
  },
];

export default function HowItWorks() {
  const [activeStep, setActiveStep] = useState(0);

  return (
    <section id="how-it-works" className="py-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold mb-4">사용 방법</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            간단한 4단계로 웹 콘텐츠를 효율적으로 저장하고 관리하세요.
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          <div className="lg:w-1/3">
            {steps.map((step, index) => (
              <div
                key={index}
                className={`mb-4 p-6 rounded-lg cursor-pointer transition-all ${
                  activeStep === index
                    ? 'bg-blue-500 text-white shadow-lg'
                    : 'bg-gray-100 hover:bg-gray-200'
                }`}
                onClick={() => setActiveStep(index)}
              >
                <div className="flex items-center mb-2">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 ${
                      activeStep === index
                        ? 'bg-white text-blue-500'
                        : 'bg-blue-500 text-white'
                    }`}
                  >
                    {index + 1}
                  </div>
                  <h3 className="text-xl font-semibold">{step.title}</h3>
                </div>
                <p
                  className={
                    activeStep === index ? 'text-blue-100' : 'text-gray-600'
                  }
                >
                  {step.description}
                </p>
              </div>
            ))}
          </div>

          <div className="lg:w-2/3 bg-gray-100 rounded-lg p-4 flex items-center justify-center">
            <div className="relative w-full h-[400px] overflow-hidden rounded-lg">
              <Image
                src={steps[activeStep].image}
                alt={steps[activeStep].title}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
