'use client';

import { CSSProperties, PropsWithChildren, useEffect, useRef, useState } from 'react';
import styles from './ScreenshotViewer.module.css';

interface Props {
  screenshot: string;
  originalUrl: string;
  widthPx: number;
  heightPx: number;
}

type Sizing = 'image' | 'screen';

export default function ScreenshotViewer({ screenshot, originalUrl, widthPx, heightPx }: Props) {
  const [sizing, setSizing] = useState<Sizing>('image');
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const updateCanvasSize = () => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const img = new Image();
    img.src = screenshot;
    img.onload = () => {
      if (sizing === 'image') {
        canvas.width = widthPx;
        canvas.height = heightPx;
      } else {
        const containerWidth = container.clientWidth;
        const scale = containerWidth / widthPx;
        canvas.width = containerWidth;
        canvas.height = heightPx * scale;
      }
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    };
  };

  useEffect(() => {
    updateCanvasSize();
    
    const handleResize = () => {
      updateCanvasSize();
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [screenshot, widthPx, heightPx, sizing]);

  return (
    <>
      <div className={styles.Header}>
        <h1><a href={originalUrl} className={styles.OriginalUrl}>{originalUrl}</a></h1>
        <div>
          <select value={sizing} onChange={(e) => setSizing(e.target.value as Sizing)}>
            <option value="image">원본 크기</option>
            <option value="screen">화면 크기</option>
          </select>
        </div>
      </div>
      <ImageContainer sizing={sizing} widthPx={widthPx} heightPx={heightPx}>
        <div ref={containerRef} className={styles.CanvasContainer}>
          <canvas ref={canvasRef} />
        </div>
      </ImageContainer>
    </>
  );
}

function ImageContainer({ sizing, widthPx, heightPx, children }
  : PropsWithChildren<{ sizing: Sizing, widthPx: number, heightPx: number }>) {
  const [containerStyle, setContainerStyle] = useState<CSSProperties>({
    maxWidth: '100%',
    overflow: 'auto'
  });

  useEffect(() => {
    const updateContainerStyle = () => {
      if (sizing === 'image') {
        setContainerStyle({
          maxWidth: '100%',
          overflow: 'auto',
          width: `${widthPx}px`,
          height: `${heightPx}px`
        });
      } else {
        setContainerStyle({
          maxWidth: '100%',
          overflow: 'hidden',
          width: '100%',
          aspectRatio: `${widthPx / heightPx}`
        });
      }
    };

    updateContainerStyle();
    window.addEventListener('resize', updateContainerStyle);
    return () => window.removeEventListener('resize', updateContainerStyle);
  }, [sizing, widthPx, heightPx]);

  return (
    <div className={styles.ImageContainer} style={containerStyle}>
      {children}
    </div>
  );
}
