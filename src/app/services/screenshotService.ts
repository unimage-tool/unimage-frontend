import { Screenshot } from '../types/screenshot';

interface GetScreenshotsParams {
  page: number;
  limit: number;
  search?: string;
  tags?: string[];
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
    tags,
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

    if (tags && tags.length > 0) {
      params.append('tags', tags.join(','));
    }

    // API 호출
    const response = await fetch(`/api/screenshots?${params.toString()}`);

    if (!response.ok) {
      throw new Error('스크린샷을 불러오는데 실패했습니다');
    }

    return response.json();
  },
};
