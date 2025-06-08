'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { CalendarIcon, LinkIcon } from '@heroicons/react/24/outline';
import { Image as ImageType } from '../../types/image';

interface ImageGridProps {
  screenshots: ImageType[];
}

export default function ImageGrid({ screenshots }: ImageGridProps) {
  const [imageErrors, setImageErrors] = useState<Set<string>>(new Set());

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const handleImageError = (imageId: string) => {
    setImageErrors(prev => new Set(prev).add(imageId));
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {screenshots.map((image) => (
        <div
          key={image.id}
          className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow"
        >
          <div className="relative h-48 w-full overflow-hidden bg-gray-100">
            {imageErrors.has(image.id) ? (
              // Fallback: 일반 img 태그 사용
              <img
                src={image.screenshot}
                alt={image.fileName}
                className="w-full h-full object-cover"
                onError={() => {
                  console.error(`Failed to load image: ${image.screenshot}`);
                }}
              />
            ) : (
              <Image
                src={image.screenshot}
                alt={image.fileName}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                onError={() => handleImageError(image.id)}
                unoptimized={true} // S3 presigned URL의 경우 최적화 비활성화
              />
            )}
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
                title={image.originalUrl}
              >
                {image.originalUrl}
              </a>
            </div>
          </div>

          <div className="px-4 py-3 bg-gray-50 flex justify-between items-center">
            <Link
              href={`/${image.id}`}
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