'use client';

import React, { useState, useRef, useCallback } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { FaCloudUploadAlt, FaImage, FaLink, FaTimes } from 'react-icons/fa';

interface UploadedImage {
  file: File;
  preview: string;
  originalUrl?: string;
}

export default function UploadPage() {
  const router = useRouter();
  const [uploadedImage, setUploadedImage] = useState<UploadedImage | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const uploadImage = async () => {
    if (!uploadedImage) return;

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', uploadedImage.file);
      if (uploadedImage.originalUrl) {
        formData.append('originalUrl', uploadedImage.originalUrl);
      }

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('업로드 실패');
      }

      const data = await response.json();
      router.push(`/${data.objectKey}`);
    } catch (error) {
      console.error('업로드 실패:', error);
      alert('업로드에 실패했습니다. 다시 시도해주세요.');
    } finally {
      setUploading(false);
    }
  };

  // 클립보드에서 이미지 붙여넣기 처리
  const handlePaste = useCallback((e: React.ClipboardEvent) => {
    const items = e.clipboardData?.items;
    if (!items) return;

    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      if (item.type.indexOf('image') !== -1) {
        const file = item.getAsFile();
        if (file) {
          handleImageFile(file);
        }
      }
    }
  }, []);

  // 전역 키보드 이벤트 처리 (Ctrl+V)
  React.useEffect(() => {
    const handleGlobalPaste = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.key === 'v') {
        const activeElement = document.activeElement;
        if (
          activeElement?.tagName !== 'INPUT' &&
          activeElement?.tagName !== 'TEXTAREA'
        ) {
          e.preventDefault();
          navigator.clipboard
            .read()
            .then((items) => {
              for (const item of items) {
                for (const type of item.types) {
                  if (type.startsWith('image/')) {
                    item.getType(type).then((blob) => {
                      const file = new File(
                        [blob],
                        `clipboard-image-${Date.now()}.png`,
                        { type }
                      );
                      handleImageFile(file);
                    });
                  }
                }
              }
            })
            .catch((err) => {
              console.log('클립보드 읽기 실패:', err);
            });
        }
      }
    };

    document.addEventListener('keydown', handleGlobalPaste);
    return () => document.removeEventListener('keydown', handleGlobalPaste);
  }, []);

  const handleImageFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('이미지 파일만 업로드할 수 있습니다.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const preview = e.target?.result as string;
      setUploadedImage({ file, preview });
    };
    reader.readAsDataURL(file);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleImageFile(files[0]);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      handleImageFile(files[0]);
    }
  };

  const removeImage = () => {
    setUploadedImage(null);
  };

  const updateOriginalUrl = (url: string) => {
    if (uploadedImage) {
      setUploadedImage({ ...uploadedImage, originalUrl: url });
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">이미지 업로드</h1>

      {/* 업로드 영역 */}
      <div
        className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
          dragActive
            ? 'border-blue-500 bg-blue-50'
            : 'border-gray-300 hover:border-gray-400'
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onPaste={handlePaste}
        tabIndex={0}
      >
        <FaCloudUploadAlt className="mx-auto text-6xl text-gray-400 mb-4" />
        <h3 className="text-xl font-semibold mb-2">이미지를 업로드하세요</h3>
        <p className="text-gray-600 mb-4">
          파일을 드래그 앤 드롭하거나, Ctrl+V로 클립보드에서 붙여넣기하거나,
          아래 버튼을 클릭하세요
        </p>
        <button
          onClick={() => fileInputRef.current?.click()}
          className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
        >
          파일 선택
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          className="hidden"
        />
      </div>

      {/* 업로드된 이미지 */}
      {uploadedImage && (
        <div className="mt-8">
          <h2 className="text-2xl font-semibold mb-4">업로드할 이미지</h2>
          <div className="border rounded-lg p-4 bg-white shadow-sm">
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0 relative w-24 h-24">
                <Image
                  src={uploadedImage.preview}
                  alt="업로드 이미지"
                  fill
                  className="object-cover rounded-lg"
                />
              </div>
              <div className="flex-grow">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-medium text-gray-900">
                    {uploadedImage.file.name}
                  </h3>
                  <button
                    onClick={removeImage}
                    className="text-red-500 hover:text-red-700"
                  >
                    <FaTimes />
                  </button>
                </div>
                <p className="text-sm text-gray-500 mb-3">
                  크기: {(uploadedImage.file.size / 1024 / 1024).toFixed(2)} MB
                </p>
                <div className="flex items-center space-x-2">
                  <FaLink className="text-gray-400" />
                  <input
                    type="url"
                    placeholder="원본 이미지 URL (선택사항)"
                    value={uploadedImage.originalUrl || ''}
                    onChange={(e) => updateOriginalUrl(e.target.value)}
                    className="flex-grow border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* 업로드 버튼 */}
          <div className="mt-6 text-center">
            <button
              onClick={uploadImage}
              disabled={uploading}
              className={`px-8 py-3 rounded-lg font-semibold ${
                uploading
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-green-600 hover:bg-green-700'
              } text-white transition-colors`}
            >
              {uploading ? '업로드 중...' : '이미지 업로드'}
            </button>
          </div>
        </div>
      )}

      {/* 사용법 안내 */}
      <div className="mt-12 bg-gray-50 rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-3">사용법</h3>
        <ul className="space-y-2 text-gray-700">
          <li className="flex items-center space-x-2">
            <FaImage className="text-blue-500" />
            <span>파일을 드래그 앤 드롭하여 업로드</span>
          </li>
          <li className="flex items-center space-x-2">
            <FaCloudUploadAlt className="text-blue-500" />
            <span>Ctrl+V를 눌러 클립보드의 이미지 붙여넣기</span>
          </li>
          <li className="flex items-center space-x-2">
            <FaLink className="text-blue-500" />
            <span>원본 이미지의 URL을 함께 저장 (선택사항)</span>
          </li>
        </ul>
      </div>
    </div>
  );
}
