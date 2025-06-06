'use client';

import React, { useState, useRef, useCallback } from 'react';
import Image from 'next/image';
import { FaCloudUploadAlt, FaImage, FaLink, FaTimes } from 'react-icons/fa';

interface UploadedImage {
  file: File;
  preview: string;
  originalUrl?: string;
}

export default function UploadPage() {
  const [uploadedImages, setUploadedImages] = useState<UploadedImage[]>([]);
  const [dragActive, setDragActive] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 클립보드에서 이미지 붙여넣기 처리
  const handlePaste = useCallback((e: React.ClipboardEvent) => {
    const items = e.clipboardData?.items;
    if (!items) return;

    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      if (item.type.indexOf('image') !== -1) {
        const file = item.getAsFile();
        if (file) {
          addImageFile(file);
        }
      }
    }
  }, []);

  // 전역 키보드 이벤트 처리 (Ctrl+V)
  React.useEffect(() => {
    const handleGlobalPaste = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.key === 'v') {
        // 입력 필드에 포커스가 있지 않을 때만 처리
        const activeElement = document.activeElement;
        if (
          activeElement?.tagName !== 'INPUT' &&
          activeElement?.tagName !== 'TEXTAREA'
        ) {
          e.preventDefault();
          // 클립보드 데이터 읽기
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
                      addImageFile(file);
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

  const addImageFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('이미지 파일만 업로드할 수 있습니다.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const preview = e.target?.result as string;
      setUploadedImages((prev) => [...prev, { file, preview }]);
    };
    reader.readAsDataURL(file);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      Array.from(files).forEach(addImageFile);
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
    if (files) {
      Array.from(files).forEach(addImageFile);
    }
  };

  const removeImage = (index: number) => {
    setUploadedImages((prev) => prev.filter((_, i) => i !== index));
  };

  const updateOriginalUrl = (index: number, url: string) => {
    setUploadedImages((prev) =>
      prev.map((img, i) => (i === index ? { ...img, originalUrl: url } : img))
    );
  };

  const handleUpload = async () => {
    if (uploadedImages.length === 0) {
      alert('업로드할 이미지를 선택해주세요.');
      return;
    }

    setUploading(true);
    try {
      // 여기에 실제 업로드 로직을 구현
      // 예시: FormData를 사용한 업로드
      for (const image of uploadedImages) {
        const formData = new FormData();
        formData.append('image', image.file);
        if (image.originalUrl) {
          formData.append('originalUrl', image.originalUrl);
        }

        // API 호출 예시 (실제 구현 시 screenshotService 사용)
        console.log('업로드할 이미지:', {
          fileName: image.file.name,
          size: image.file.size,
          originalUrl: image.originalUrl,
        });
      }

      alert('이미지가 성공적으로 업로드되었습니다!');
      setUploadedImages([]);
    } catch (error) {
      console.error('업로드 실패:', error);
      alert('업로드에 실패했습니다. 다시 시도해주세요.');
    } finally {
      setUploading(false);
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
          multiple
          accept="image/*"
          onChange={handleFileSelect}
          className="hidden"
        />
      </div>

      {/* 업로드된 이미지 목록 */}
      {uploadedImages.length > 0 && (
        <div className="mt-8">
          <h2 className="text-2xl font-semibold mb-4">
            업로드할 이미지 ({uploadedImages.length}개)
          </h2>
          <div className="space-y-4">
            {uploadedImages.map((image, index) => (
              <div
                key={index}
                className="border rounded-lg p-4 bg-white shadow-sm"
              >
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 relative w-24 h-24">
                    <Image
                      src={image.preview}
                      alt={`업로드 이미지 ${index + 1}`}
                      fill
                      className="object-cover rounded-lg"
                    />
                  </div>
                  <div className="flex-grow">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-medium text-gray-900">
                        {image.file.name}
                      </h3>
                      <button
                        onClick={() => removeImage(index)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <FaTimes />
                      </button>
                    </div>
                    <p className="text-sm text-gray-500 mb-3">
                      크기: {(image.file.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                    <div className="flex items-center space-x-2">
                      <FaLink className="text-gray-400" />
                      <input
                        type="url"
                        placeholder="원본 이미지 URL (선택사항)"
                        value={image.originalUrl || ''}
                        onChange={(e) =>
                          updateOriginalUrl(index, e.target.value)
                        }
                        className="flex-grow border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* 업로드 버튼 */}
          <div className="mt-6 text-center">
            <button
              onClick={handleUpload}
              disabled={uploading}
              className={`px-8 py-3 rounded-lg font-semibold ${
                uploading
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-green-600 hover:bg-green-700'
              } text-white transition-colors`}
            >
              {uploading ? '업로드 중...' : '모든 이미지 업로드'}
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
