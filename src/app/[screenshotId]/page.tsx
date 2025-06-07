import { headers } from 'next/headers';
import styles from './page.module.css';
import ScreenshotViewer from './ScreenshotViewer';

async function fetchScreenshotData(objectKey: string, cookie: string) {
  try {
    const response = await fetch(`https://api.unimages.com/images/${objectKey}`, {
      headers: {
        'Cookie': cookie,
      },
    });

    if (!response.ok) {
      throw new Error('스크린샷을 불러오는데 실패했습니다');
    }

    const { data } = await response.json();
    return {
      screenshot: data.screenshot,
      originalUrl: data.originalUrl,
      widthPx: data.width,
      heightPx: data.height,
      fileName: data.fileName,
      size: data.size,
      uploadedAt: data.uploadedAt,
    };
  } catch (error) {
    console.error('스크린샷 데이터 로드 실패:', error);
    throw error;
  }
}

export default async function ScreenshotPage({
  params,
}: {
  params: { screenshotId: string };
}) {
  const headersList = await headers();
  const cookie = headersList.get('cookie') || '';
  const screenshotData = await fetchScreenshotData(params.screenshotId, cookie);

  return (
    <div className={styles.ScreenshotPage}>
      <ScreenshotViewer {...screenshotData} />
    </div>
  );
}
