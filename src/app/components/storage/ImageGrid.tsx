'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { LinkIcon } from '@heroicons/react/24/outline';
import { Image as ImageType } from '../../types/image';

interface ImageGridProps {
  screenshots: ImageType[];
}

export default function ImageGrid({ screenshots }: ImageGridProps) {
  const [imageErrors, setImageErrors] = useState<Set<string>>(new Set());
  const [hoveredUrls, setHoveredUrls] = useState<Set<string>>(new Set());

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

  const handleMouseEnter = (id: string) => {
    setHoveredUrls((prev) => new Set(prev).add(id));
  };

  const handleMouseLeave = (id: string) => {
    setHoveredUrls((prev) => {
      const copy = new Set(prev);
      copy.delete(id);
      return copy;
    });
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {screenshots.map((image) => (
        <div
          key={image.id}
          className="group bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-all duration-300 relative"
        >
          {/* 이미지 링크 */}
          <Link href={`/${image.id}`} className="block relative">
            <div className="relative aspect-[3/2] w-full overflow-hidden">
              <Image
                src={
                  imageErrors.has(image.id)
                    ? '/fallback.png' // ❗ fallback 이미지 경로 필요
                    : image.screenshot
                }
                alt={`Screenshot of ${image.fileName}`}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-300"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                onError={() => handleImageError(image.id)}
                unoptimized
              />

              {/* 그라디언트 오버레이 */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent">
                <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
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

              {/* 링크 버튼 */}
              <div
                className="absolute top-2 right-2 z-10"
                onClick={(e) => e.stopPropagation()}
                onMouseEnter={() => handleMouseEnter(image.id)}
                onMouseLeave={() => handleMouseLeave(image.id)}
              >
                <div className="relative group/url">
                  <button
                    className={`p-2 bg-black/50 backdrop-blur-sm rounded-full hover:bg-white/30 transition-all duration-300 cursor-pointer ${
                      hoveredUrls.has(image.id) ? 'opacity-0' : ''
                    }`}
                  >
                    <LinkIcon className="w-4 h-4 text-white" />
                  </button>

                  {/* URL 확장 영역 */}
                  <div
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      window.open(image.originalUrl, '_blank', 'noopener,noreferrer');
                    }}
                    className={`absolute top-0 right-0 bg-black/50 backdrop-blur-sm rounded-full transition-all duration-300 overflow-hidden ${
                      hoveredUrls.has(image.id) ? 'w-64 opacity-100' : 'w-10 opacity-0'
                    }`}
                  >
                    <div className="flex items-center h-10">
                      <div className="w-10 h-10 flex items-center justify-center flex-shrink-0">
                        <LinkIcon className="w-4 h-4 text-white" />
                      </div>
                      <div className="pr-4 text-white text-sm truncate">
                        {image.originalUrl}
                      </div>
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
