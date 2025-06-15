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

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const img = new Image();
    img.src = screenshot;
    img.onload = () => {
      canvas.width = widthPx;
      canvas.height = heightPx;
      ctx.drawImage(img, 0, 0, widthPx, heightPx);
    };
  }, [screenshot, widthPx, heightPx]);

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
        <canvas ref={canvasRef} />
      </ImageContainer>
    </>
  );
}

function ImageContainer({ sizing, widthPx, heightPx, children }
  : PropsWithChildren<{ sizing: Sizing, widthPx: number, heightPx: number }>) {

  const style: CSSProperties = {};

  if (sizing === 'image') {
    style.width = `${widthPx}px`;
    style.height = `${heightPx}px`;
  } else {
    style.aspectRatio = `${widthPx / heightPx}`;
  }

  return (
    <div className={styles.ImageContainer} style={style}>
      {children}
    </div>
  );
}
