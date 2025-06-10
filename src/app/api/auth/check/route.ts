import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const response = await fetch('https://api.unimages.com/auth/check', {
      credentials: 'include',
      headers: {
        'Cookie': request.headers.get('cookie') || '',
      },
    });

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('인증 상태 확인 실패:', error);
    return NextResponse.json(
      { authenticated: false, error: '인증 상태를 확인할 수 없습니다' },
      { status: 500 }
    );
  }
} 