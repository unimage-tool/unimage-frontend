import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const response = await fetch('https://api.unimages.com/images', {
      credentials: 'include',
      headers: {
        'Cookie': request.headers.get('cookie') || '',
      },
    });

    const data = await response.json();
    
    return NextResponse.json(data);
  } catch (error) {
    console.error('이미지 목록 조회 실패:', error);
    return NextResponse.json(
      { error: '이미지 목록을 불러오는데 실패했습니다' },
      { status: 500 }
    );
  }
} 