import { NextRequest, NextResponse } from 'next/server';

export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ imageId: string }> }
) {
  try {
    const { imageId } = await context.params;
    
    const response = await fetch(`https://api.unimages.com/images/${imageId}`, {
      method: 'DELETE',
      headers: {
        'Cookie': request.headers.get('cookie') || '',
      },
    });

    // 204 No Content 또는 200 OK인 경우 성공으로 처리
    if (response.status === 204 || response.ok) {
      return new NextResponse(null, { status: 200 });
    }

    // 에러 응답이 있는 경우에만 JSON 파싱
    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('이미지 삭제 실패:', error);
    return NextResponse.json(
      { error: '서버 오류가 발생했습니다' },
      { status: 500 }
    );
  }
} 