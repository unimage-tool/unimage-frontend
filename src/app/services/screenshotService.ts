import { Screenshot } from '../types/screenshot';

interface GetScreenshotsParams {
  page: number;
  limit: number;
  search?: string;
  sortBy?: 'newest' | 'oldest' | 'title';
}

interface GetScreenshotsResponse {
  items: Screenshot[];
  total: number;
  page: number;
  totalPages: number;
}

export const screenshotService = {
  async getScreenshots({
    page,
    limit,
    search,
    sortBy = 'newest',
  }: GetScreenshotsParams): Promise<GetScreenshotsResponse> {
    // 쿼리 파라미터 구성
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      sortBy,
    });

    if (search) {
      params.append('search', search);
    }

    // API 호출 (절대 경로 사용)
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    const response = await fetch(`${baseUrl}/api/screenshots?${params.toString()}`);

    if (!response.ok) {
      throw new Error('스크린샷을 불러오는데 실패했습니다');
    }

    return response.json();
  },
};
