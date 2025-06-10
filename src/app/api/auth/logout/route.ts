import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
    try {
      const response = await fetch('https://api.unimages.com/auth/session-logout', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          'Cookie': request.headers.get('cookie') || '',
        },
      });
  
      const data = await response.json();
      
      if (!response.ok || !data.success) {
        throw new Error(data.message || '로그아웃 요청 실패');
      }
  
      // 응답 헤더 설정
      const responseHeaders = new Headers();
      
      // 기본 세션 쿠키들 삭제 (백엔드에서 명시적으로 지시하지 않더라도)
      const cookiesToClear = ['session', 'JSESSIONID', 'auth-token']; // 실제 사용하는 쿠키명으로 수정
      
      cookiesToClear.forEach(cookieName => {
        responseHeaders.append(
          'Set-Cookie', 
          `${cookieName}=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT; HttpOnly; Secure; SameSite=Lax`
        );
      });
  
      return new NextResponse(JSON.stringify({ 
        success: true, 
        message: data.message 
      }), {
        status: 200,
        headers: responseHeaders,
      });
      
    } catch (error) {
      console.error('로그아웃 실패:', error);
      return NextResponse.json(
        { error: '로그아웃 중 오류가 발생했습니다' },
        { status: 500 }
      );
    }
  }