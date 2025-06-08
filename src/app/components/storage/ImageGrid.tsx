'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { CalendarIcon, LinkIcon } from '@heroicons/react/24/outline';

interface Image {
  originalUrl: string;
  width: number;
  height: number;
  objectKey: string;
  fileName: string;
  size: number;
  screenshot: string;
  uploadedAt: string;
}

interface ImageGridProps {
  screenshots: Image[];
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
      {screenshots.map((image) => (
        <div
          key={image.objectKey}
          className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow"
        >
          <div className="relative h-48 w-full overflow-hidden">
            <Image
              src={image.screenshot}
              alt={image.fileName}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
            />
          </div>

          <div className="p-4">
            <h3 className="text-lg font-semibold mb-2 truncate">
              {image.fileName}
            </h3>

            <div className="flex items-center text-sm text-gray-500 mb-2">
              <CalendarIcon className="w-4 h-4 mr-1" />
              <span>{formatDate(image.uploadedAt)}</span>
            </div>

            <div className="flex items-center text-sm text-gray-500 mb-3">
              <LinkIcon className="w-4 h-4 mr-1 flex-shrink-0" />
              <a
                href={image.originalUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="truncate hover:text-blue-500"
              >
                {image.originalUrl}
              </a>
            </div>
          </div>

          <div className="px-4 py-3 bg-gray-50 flex justify-between items-center">
            <Link
              href={`/${image.objectKey}`}
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
