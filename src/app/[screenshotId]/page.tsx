import Image from 'next/image';
import styles from './page.module.css';

async function fetchScreenshotData() {
  return {
    screenshot: 'https://picsum.photos/800/400',
    originalUrl: 'https://picsum.photos',
    widthPx: 800,
    heightPx: 400,
  };
}

export default async function ScreenshotPage() {
  const { screenshot, originalUrl, widthPx, heightPx } = await fetchScreenshotData();

  return (
    <div className={styles.ScreenshotPage}>
      <h1><a href={originalUrl} className={styles.OriginalUrl}>{originalUrl}</a></h1>
      <Image src={screenshot} alt={originalUrl} width={widthPx} height={heightPx} />
    </div>
  );
}
