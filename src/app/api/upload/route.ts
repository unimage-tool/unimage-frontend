import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file');
    const originalUrl = formData.get('originalUrl');
    
    console.log('Upload request:', {
      fileName: file instanceof File ? file.name : 'unknown',
      fileType: file instanceof File ? file.type : 'unknown',
      fileSize: file instanceof File ? file.size : 'unknown',
      originalUrl,
    });
    
    if (!file) {
      return NextResponse.json(
        { error: '이미지 파일이 필요합니다' },
        { status: 400 }
      );
    }

    if (!(file instanceof File)) {
      return NextResponse.json(
        { error: '유효하지 않은 파일입니다' },
        { status: 400 }
      );
    }

    if (!file.type.startsWith('image/')) {
      return NextResponse.json(
        { error: '이미지 파일만 업로드할 수 있습니다' },
        { status: 400 }
      );
    }

    const response = await fetch('https://api.unimages.com/images', {
      method: 'POST',
      body: formData,
      headers: {
        'Cookie': request.headers.get('cookie') || '',
      },
    });

    const data = await response.json();
    
    if (!response.ok) {
      console.error('API Error:', {
        status: response.status,
        data,
        fileInfo: {
          name: file.name,
          type: file.type,
          size: file.size,
          originalUrl,
        }
      });

      // API 서버의 에러 메시지가 있으면 사용
      if (data.error) {
        return NextResponse.json(
          { error: data.error },
          { status: response.status }
        );
      }

      // 상태 코드에 따른 기본 에러 메시지
      switch (response.status) {
        case 400:
          return NextResponse.json(
            { error: '잘못된 요청입니다. 파일 형식과 크기를 확인해주세요.' },
            { status: 400 }
          );
        case 401:
          return NextResponse.json(
            { error: '로그인이 필요합니다' },
            { status: 401 }
          );
        case 413:
          return NextResponse.json(
            { error: '파일 크기가 너무 큽니다' },
            { status: 413 }
          );
        default:
          return NextResponse.json(
            { error: '업로드에 실패했습니다. 잠시 후 다시 시도해주세요.' },
            { status: response.status }
          );
      }
    }
    
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('업로드 실패:', error);
    return NextResponse.json(
      { error: '서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.' },
      { status: 500 }
    );
  }
} 