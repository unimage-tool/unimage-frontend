import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    
    const response = await fetch('https://api.unimages.com/images', {
      method: 'POST',
      body: formData,
      headers: {
        'Cookie': request.headers.get('cookie') || '',
      },
    });

    const data = await response.json();
    
    return NextResponse.json(data);
  } catch (error) {
    console.error('업로드 실패:', error);
    return NextResponse.json(
      { error: '업로드에 실패했습니다' },
      { status: 500 }
    );
  }
} 