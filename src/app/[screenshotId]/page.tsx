import styles from './page.module.css';
import ScreenshotViewer from './ScreenshotViewer';

async function fetchScreenshotData() {
  return {
    screenshot: 'https://picsum.photos/800/400',
    originalUrl: 'https://picsum.photos',
    widthPx: 800,
    heightPx: 400,
  };
}

export default async function ScreenshotPage() {
  const screenshotData = await fetchScreenshotData();

  return (
    <div className={styles.ScreenshotPage}>
      <ScreenshotViewer {...screenshotData} />
    </div>
  );
}
