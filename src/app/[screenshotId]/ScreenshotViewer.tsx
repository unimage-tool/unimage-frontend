'use client';

import { CSSProperties, PropsWithChildren, useCallback, useEffect, useRef, useState } from 'react';
import styles from './ScreenshotViewer.module.css';
import { FaFont, FaArrowRight, FaMinus, FaSquare, FaCircle, FaEraser, FaUndo, FaRedo } from 'react-icons/fa';
import { useRouter } from 'next/navigation';
import { MdDelete } from 'react-icons/md';

interface Props {
  id: string;
  screenshot: string;
  originalUrl: string;
  widthPx: number;
  heightPx: number;
}

type Sizing = 'image' | 'screen';



export default function ScreenshotViewer({ id, screenshot, originalUrl, widthPx, heightPx }: Props) {
  const [sizing, setSizing] = useState<Sizing>('image');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement | null>(null);
  const loadedImageRef = useRef<HTMLImageElement | null>(null);
  const router = useRouter();
  const drawCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    const loadedImage = loadedImageRef.current;

    if (!canvas || !container || !loadedImage) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    try {
      if (sizing === 'image') {
        canvas.width = widthPx;
        canvas.height = heightPx;
      } else {
        const containerWidth = container.clientWidth;
        const scale = containerWidth / widthPx;
        canvas.width = containerWidth;
        canvas.height = heightPx * scale;
      }
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';
      ctx.drawImage(loadedImage, 0, 0, canvas.width, canvas.height);
    } catch {
      setError('이미지 렌더링 중 오류가 발생했습니다.');
    }
  }, [sizing, widthPx, heightPx]);

  const loadImage = useCallback(() => {
    // 기존 이미지 정리
    if (imageRef.current) {
      imageRef.current.onload = null;
      imageRef.current.onerror = null;
    }

    const img = new Image();
    imageRef.current = img;

    img.onload = () => {
      // 컴포넌트가 언마운트되었는지 확인
      if (!canvasRef.current || !containerRef.current) return;

      loadedImageRef.current = img;
      drawCanvas();
      setIsLoading(false);
      setError(null);
    };

    img.onerror = () => {
      setError('이미지를 로드할 수 없습니다.');
      setIsLoading(false);
    };

    setIsLoading(true);
    setError(null);
    img.src = screenshot;
  }, [screenshot, drawCanvas]);

  const handleDelete = async (imageId: string) => {
    if (!confirm('정말로 이 이미지를 삭제하시겠습니까?')) {
      return;
    }

    try {
      const response = await fetch(`/api/images/${imageId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const data = await response.json();
        if (response.status === 401) {
          return;
        }
        throw new Error(data.error || '삭제에 실패했습니다');
      }

      // 성공 시 상위 컴포넌트에 삭제된 이미지 ID 전달
      alert('이미지가 삭제되었습니다');
      router.push('/');
    } catch (error) {
      console.error('삭제 실패:', error);
      alert(error instanceof Error ? error.message : '삭제에 실패했습니다. 다시 시도해주세요.');
    }
  };

  useEffect(() => {
    loadImage();
  }, [loadImage]);

  useEffect(() => {
    if (loadedImageRef.current) {
      drawCanvas();
    }
  }, [drawCanvas]);

  useEffect(() => {
    const handleResize = () => {
      if (loadedImageRef.current) {
        drawCanvas();
      }
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      // 컴포넌트 언마운트 시 이미지 핸들러 정리
      if (imageRef.current) {
        imageRef.current.onload = null;
        imageRef.current.onerror = null;
      }
    };
  }, [drawCanvas]);

  return (
    <>
      <div className={styles.Header}>
        <h1>
          <a href={originalUrl} className={styles.OriginalUrl} target="_blank" rel="noopener noreferrer">
            {originalUrl}
          </a>
        </h1>
        <div className={styles.Toolbar}>
          <button type="button" title="텍스트"><FaFont /></button>
          <button type="button" title="선"><FaMinus /></button>
          <button type="button" title="화살표"><FaArrowRight /></button>
          <button type="button" title="사각형"><FaSquare /></button>
          <button type="button" title="원"><FaCircle /></button>
          <button type="button" title="지우개"><FaEraser /></button>
          <button type="button" title="Undo"><FaUndo /></button>
          <button type="button" title="Redo"><FaRedo /></button>
          <button type="button" title="삭제" onClick={() => handleDelete(id)}><MdDelete /></button>
        </div>
        <div>
          <select
            value={sizing}
            onChange={(e) => setSizing(e.target.value as Sizing)}
            disabled={isLoading}
          >
            <option value="image">원본 크기</option>
            <option value="screen">화면 크기</option>
          </select>
        </div>
      </div>

      <ImageContainer sizing={sizing} widthPx={widthPx} heightPx={heightPx}>
        <div ref={containerRef} className={styles.CanvasContainer}>
          {isLoading && <div className={styles.Loading}>로딩 중...</div>}
          {error && <div className={styles.Error}>{error}</div>}
          <canvas
            ref={canvasRef}
            style={{ display: isLoading || error ? 'none' : 'block' }}
          />
        </div>
      </ImageContainer>
    </>
  );
}

function ImageContainer({ sizing, widthPx, heightPx, children }
  : PropsWithChildren<{ sizing: Sizing, widthPx: number, heightPx: number }>) {

  const containerStyle: CSSProperties = sizing === 'image'
    ? {
      maxWidth: '100%',
      overflow: 'auto',
      width: `${widthPx}px`,
      height: `${heightPx}px`
    }
    : {
      maxWidth: '100%',
      overflow: 'hidden',
      width: '100%',
      aspectRatio: `${widthPx / heightPx}`
    };

  return (
    <div className={styles.ImageContainer} style={containerStyle}>
      {children}
    </div>
  );
}