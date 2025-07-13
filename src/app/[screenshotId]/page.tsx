import { headers } from 'next/headers';
import { notFound } from 'next/navigation';
import styles from './page.module.css';
import ScreenshotViewer from './ScreenshotViewer';

async function fetchScreenshotData(id: string, cookie: string) {
  try {
    const response = await fetch(`https://api.unimages.com/images/${id}`, {
      headers: {
        'Cookie': cookie,
      },
    });

    if (!response.ok) {
      throw new Error('스크린샷을 불러오는데 실패했습니다');
    }

    const { data } = await response.json();
    return data;
  } catch (error) {
    console.error('스크린샷 데이터 로드 실패:', error);
    notFound();
  }
}

interface PageProps {
  params: Promise<{
    screenshotId: string;
  }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function ScreenshotPage({ params }: PageProps) {
  // Next.js 15에서 params는 Promise이므로 await 필요
  const resolvedParams = await params;

  const headersList = await headers();
  const cookie = headersList.get('cookie') || '';

  try {
    const screenshotData = await fetchScreenshotData(resolvedParams.screenshotId, cookie);
    return (
      <div className={styles.ScreenshotPage}>
        <ScreenshotViewer {...screenshotData} />
      </div>
    );
  } catch (error) {
    console.error('스크린샷 데이터 로드 실패:', error);
    notFound();
  }
}