'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { FaCamera } from 'react-icons/fa';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import AuthButton from '../auth/AuthButton';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="bg-white shadow-sm sticky top-0 z-10">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 flex items-center justify-center text-blue-600">
              <FaCamera className="w-6 h-6" />
            </div>
            <span className="text-xl font-bold text-blue-600">UnImage</span>
          </Link>

          {/* 데스크톱 메뉴 */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link
              href="/#features"
              className="text-gray-600 hover:text-blue-600"
            >
              기능
            </Link>
            <Link
              href="/#how-it-works"
              className="text-gray-600 hover:text-blue-600"
            >
              사용 방법
            </Link>
            <Link href="/pricing" className="text-gray-600 hover:text-blue-600">
              요금제
            </Link>
            <Link href="/upload" className="text-gray-600 hover:text-blue-600">
              업로드
            </Link>
            <Link href="/storage" className="text-gray-600 hover:text-blue-600">
              저장소
            </Link>
            <AuthButton />
          </nav>

          {/* 모바일 메뉴 버튼 */}
          <button
            type="button"
            className="md:hidden text-gray-500"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? (
              <XMarkIcon className="h-6 w-6" />
            ) : (
              <Bars3Icon className="h-6 w-6" />
            )}
          </button>
        </div>

        {/* 모바일 메뉴 */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t">
            <nav className="flex flex-col space-y-4">
              <Link
                href="/#features"
                className="text-gray-600 hover:text-blue-600"
              >
                기능
              </Link>
              <Link
                href="/#how-it-works"
                className="text-gray-600 hover:text-blue-600"
              >
                사용 방법
              </Link>
              <Link
                href="/pricing"
                className="text-gray-600 hover:text-blue-600"
              >
                요금제
              </Link>
              <Link
                href="/upload"
                className="text-gray-600 hover:text-blue-600"
              >
                업로드
              </Link>
              <Link
                href="/storage"
                className="text-gray-600 hover:text-blue-600"
              >
                저장소
              </Link>
              <div className="text-center">
                <AuthButton />
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
