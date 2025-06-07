import React from 'react';
import Link from 'next/link';
import { FaGoogle } from 'react-icons/fa';

export default function SignIn() {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
  const redirectUrl = '/storage';
  const fullRedirectUrl = `${baseUrl}${redirectUrl}`;
  const loginUrl = `https://api.unimages.com/auth/login?redirectUrl=${encodeURIComponent(fullRedirectUrl)}`;

  return (
    <div className="min-h-[calc(100vh-200px)] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-xl shadow-lg">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            계정에 로그인하세요
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            로그인하여 저장된 스크린샷을 확인하고 관리하세요
          </p>
        </div>

        <div className="mt-8 space-y-6">
          <Link
            href={loginUrl}
            className="group relative w-full flex justify-center py-3 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <span className="absolute left-0 inset-y-0 flex items-center pl-3">
              <FaGoogle className="h-5 w-5 text-gray-500" />
            </span>
            Google로 계속하기
          </Link>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">또는</span>
              </div>
            </div>

            <div className="mt-6">
              <p className="text-center text-sm text-gray-600">
                아직 계정이 없으신가요?{' '}
                <Link
                  href="#"
                  className="font-medium text-blue-600 hover:text-blue-500"
                >
                  회원가입
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
