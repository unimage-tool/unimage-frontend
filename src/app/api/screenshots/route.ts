import { NextRequest, NextResponse } from 'next/server';
import { Screenshot } from '@/app/types/screenshot';

// 무작위 크기 생성 함수
const getRandomSize = () => {
  const widths = [800, 1024, 1280, 1440, 1920];
  const heights = [400, 600, 720, 900, 1080];
  const width = widths[Math.floor(Math.random() * widths.length)];
  const height = heights[Math.floor(Math.random() * heights.length)];
  return { width, height };
};

// 임시 데이터 (실제로는 DB에서 가져옴)
const MOCK_SCREENSHOTS: Screenshot[] = Array.from({ length: 1000 }, (_, i) => {
  const { width, height } = getRandomSize();
  return {
    id: i + 1,
    title: `스크린샷 ${i + 1}`,
    originalUrl: `https://picsum.photos`,
    screenshotUrl: `https://picsum.photos/${width}/${height}`,
    widthPx: width,
    heightPx: height,
    createdAt: new Date(Date.now() - i * 86400000).toISOString(),
  };
});

export async function GET(request: NextRequest) {
  // URL에서 쿼리 파라미터 추출
  const searchParams = request.nextUrl.searchParams;
  const page = parseInt(searchParams.get('page') || '1');
  const limit = parseInt(searchParams.get('limit') || '12');
  const search = searchParams.get('search') || undefined;
  const sortBy =
    (searchParams.get('sortBy') as 'newest' | 'oldest' | 'title') || 'newest';

  // 검색 조건에 맞는 전체 개수 계산
  const total = MOCK_SCREENSHOTS.filter((item) => {
    if (search) {
      const query = search.toLowerCase();
      if (
        !item.title.toLowerCase().includes(query) &&
        !item.originalUrl.toLowerCase().includes(query)
      ) {
        return false;
      }
    }
    return true;
  }).length;

  // 정렬 기준에 따라 데이터 정렬
  const sortedItems = [...MOCK_SCREENSHOTS].sort((a, b) => {
    if (sortBy === 'newest') {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    } else if (sortBy === 'oldest') {
      return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
    } else {
      return a.title.localeCompare(b.title);
    }
  });

  // 검색 필터링
  const filteredItems = sortedItems.filter((item) => {
    if (search) {
      const query = search.toLowerCase();
      if (
        !item.title.toLowerCase().includes(query) &&
        !item.originalUrl.toLowerCase().includes(query)
      ) {
        return false;
      }
    }
    return true;
  });

  // 페이지네이션 적용
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  const items = filteredItems.slice(startIndex, endIndex);

  const totalPages = Math.ceil(total / limit);

  // API 응답 반환
  return NextResponse.json({
    items,
    total,
    page,
    totalPages,
  });
}
