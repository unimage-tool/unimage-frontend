'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Screenshot } from '../../types/screenshot';
import { CalendarIcon, LinkIcon } from '@heroicons/react/24/outline';

interface ImageGridProps {
  screenshots: Screenshot[];
}

export default function ImageGrid({ screenshots }: ImageGridProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {screenshots.map((screenshot) => (
        <div
          key={screenshot.id}
          className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow"
        >
          <div className="relative h-48 w-full overflow-hidden">
            <Image
              src={screenshot.screenshotUrl}
              alt={screenshot.title}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
            />
          </div>

          <div className="p-4">
            <h3 className="text-lg font-semibold mb-2 truncate">
              {screenshot.title}
            </h3>

            <div className="flex items-center text-sm text-gray-500 mb-2">
              <CalendarIcon className="w-4 h-4 mr-1" />
              <span>{formatDate(screenshot.createdAt)}</span>
            </div>

            <div className="flex items-center text-sm text-gray-500 mb-3">
              <LinkIcon className="w-4 h-4 mr-1 flex-shrink-0" />
              <a
                href={screenshot.originalUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="truncate hover:text-blue-500"
              >
                {screenshot.originalUrl}
              </a>
            </div>
          </div>

          <div className="px-4 py-3 bg-gray-50 border-t flex justify-between">
            <Link
              href={`/${screenshot.id}`}
              className="text-blue-600 hover:text-blue-800 text-sm font-medium"
            >
              상세보기
            </Link>
            <button className="text-gray-500 hover:text-gray-700 text-sm">
              삭제
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
