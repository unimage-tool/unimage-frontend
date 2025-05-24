import { NextRequest, NextResponse } from 'next/server';
import { Screenshot } from '@/app/types/screenshot';

// 임시 데이터 (실제로는 DB에서 가져옴)
const MOCK_SCREENSHOTS: Screenshot[] = Array.from({ length: 1000 }, (_, i) => ({
  id: i + 1,
  title: `스크린샷 ${i + 1}`,
  url: `https://example.com/page${i + 1}`,
  imageUrl: `/images/capture.jpg`,
  createdAt: new Date(Date.now() - i * 86400000).toISOString(),
  tags: ['웹', '디자인', '참고자료'].slice(0, (i % 3) + 1),
}));

export async function GET(request: NextRequest) {
  // URL에서 쿼리 파라미터 추출
  const searchParams = request.nextUrl.searchParams;
  const page = parseInt(searchParams.get('page') || '1');
  const limit = parseInt(searchParams.get('limit') || '12');
  const search = searchParams.get('search') || undefined;
  const tags = searchParams.get('tags')?.split(',') || undefined;
  const sortBy =
    (searchParams.get('sortBy') as 'newest' | 'oldest' | 'title') || 'newest';

  // 검색 조건에 맞는 전체 개수 계산
  const total = MOCK_SCREENSHOTS.filter((item) => {
    if (search) {
      const query = search.toLowerCase();
      if (
        !item.title.toLowerCase().includes(query) &&
        !item.url.toLowerCase().includes(query)
      ) {
        return false;
      }
    }
    if (tags && tags.length > 0) {
      if (!tags.some((tag) => item.tags.includes(tag))) {
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

  // 검색 및 태그 필터링
  const filteredItems = sortedItems.filter((item) => {
    if (search) {
      const query = search.toLowerCase();
      if (
        !item.title.toLowerCase().includes(query) &&
        !item.url.toLowerCase().includes(query)
      ) {
        return false;
      }
    }
    if (tags && tags.length > 0) {
      if (!tags.some((tag) => item.tags.includes(tag))) {
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
