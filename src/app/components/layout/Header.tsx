'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { FaCamera } from 'react-icons/fa';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import AuthButton from '../auth/AuthButton';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navLinks = [
    { href: '/#features', label: '기능' },
    { href: '/#how-it-works', label: '사용 방법' },
    { href: '/pricing', label: '요금제' },
    { href: '/upload', label: '업로드' },
    { href: '/', label: '저장소' },
  ];

  const renderLinks = (links: { href: string; label: string }[]) => (
    <>
      {links.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          className="text-gray-600 hover:text-blue-600"
        >
          {link.label}
        </Link>
      ))}
    </>
  );

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
            {renderLinks(navLinks)}
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
              {renderLinks(navLinks)}
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
