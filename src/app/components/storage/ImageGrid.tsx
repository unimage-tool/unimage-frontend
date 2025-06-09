'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { CalendarIcon, LinkIcon } from '@heroicons/react/24/outline';
import { Image as ImageType } from '../../types/image';

interface ImageGridProps {
  screenshots: ImageType[];
  onImageDelete: (imageId: string) => void; // 삭제 콜백 추가
}

export default function ImageGrid({ screenshots, onImageDelete }: ImageGridProps) {
  const router = useRouter();
  const [imageErrors, setImageErrors] = useState<Set<string>>(new Set());
  const [deletingId, setDeletingId] = useState<string | null>(null);

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

  const handleDelete = async (imageId: string) => {
    if (!confirm('정말로 이 이미지를 삭제하시겠습니까?')) {
      return;
    }

    setDeletingId(imageId);
    try {
      const response = await fetch(`/api/images/${imageId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const data = await response.json();
        if (response.status === 401) {
          router.push('/auth/signin');
          return;
        }
        throw new Error(data.error || '삭제에 실패했습니다');
      }

      // 성공 시 상위 컴포넌트에 삭제된 이미지 ID 전달
      onImageDelete(imageId);
      alert('이미지가 삭제되었습니다');
      
    } catch (error) {
      console.error('삭제 실패:', error);
      alert(error instanceof Error ? error.message : '삭제에 실패했습니다. 다시 시도해주세요.');
    } finally {
      setDeletingId(null);
    }
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
              <Image
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
            <button
              onClick={() => handleDelete(image.id)}
              disabled={deletingId === image.id}
              className={`text-sm ${
                deletingId === image.id
                  ? 'text-gray-400 cursor-not-allowed'
                  : 'text-red-600 hover:text-red-800'
              }`}
            >
              {deletingId === image.id ? '삭제 중...' : '삭제'}
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}