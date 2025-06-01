'use client';

import Image from 'next/image';
import { CSSProperties, PropsWithChildren, useState } from 'react';
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
        <Image src={screenshot} alt={originalUrl} fill />
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
