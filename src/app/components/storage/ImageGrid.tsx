'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { LinkIcon } from '@heroicons/react/24/outline';
import { Screenshot } from '../../types/image';

interface ImageGridProps {
  screenshots: Screenshot[];
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
    setImageErrors((prev) => new Set(prev).add(imageId));
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {screenshots.map((image) => (
        <div
          key={image.id}
          className="group bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-all duration-300 relative"
        >
          <Link href={`/${image.id}`} className="block relative">
            <div className="relative aspect-[3/2] w-full overflow-hidden">
              <Image
                src={
                  imageErrors.has(image.id)
                    ? 'https://placehold.co/600x400?text=No Image'
                    : image.screenshot
                }
                alt={`Screenshot of ${image.fileName}`}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-300"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                onError={() => handleImageError(image.id)}
                unoptimized
              />

              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent">
                <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                  <p>{image.title || "No Title"}</p>
                  <div className="flex items-center justify-between text-sm">
                    <h3
                      className="text-lg font-semibold mb-1 truncate"
                      title={image.fileName}
                    >
                      {image.fileName}
                    </h3>
                    <span className="whitespace-nowrap">
                      {formatDate(image.uploadedAt)}
                    </span>
                  </div>
                </div>
              </div>
              <div className="absolute top-2 right-2 z-10">
                <div
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    window.open(image.originalUrl, '_blank', 'noopener,noreferrer');
                  }}
                  // 링크 버튼과 URL 영역을 새로운 group으로 지정 (group/url)
                  className="group/url flex items-center h-10 bg-black/50 backdrop-blur-sm rounded-full transition-all duration-300 ease-in-out cursor-pointer"
                >
                  {/* 아이콘 영역 */}
                  <div className="w-10 h-10 flex items-center justify-center flex-shrink-0">
                    <LinkIcon className="w-4 h-4 text-white" />
                  </div>

                  {/* URL 텍스트 컨테이너 */}
                  <div className="max-w-0 group-hover/url:max-w-[28rem] md:group-hover/url:max-w-[16rem] transition-all duration-300 ease-in-out overflow-hidden">
                    <div className="pr-4 text-white text-sm whitespace-nowrap truncate">
                      {image.originalUrl}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Link>
        </div>
      ))}
    </div>
  );
}
