import React from "react";

const PrivacyPage = () => {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="text-3xl md:text-4xl font-bold mb-8 text-gray-900">개인정보 처리방침</h1>
      <section className="text-base md:text-lg leading-relaxed text-gray-800">
        <p className="mb-8">UnImage(이하 &quot;회사&quot;)는 이용자의 개인정보를 소중하게 생각하며, 관련 법령을 준수합니다. 본 개인정보 처리방침은 회사가 제공하는 서비스 이용 시, 이용자의 개인정보가 어떻게 수집·이용·보관·파기되는지에 대해 안내합니다.</p>

        <h2 className="text-xl font-semibold mt-10 mb-3 text-gray-900">1. 수집하는 개인정보 항목</h2>
        <ul className="list-disc pl-6 mb-8 space-y-1">
          <li>필수항목: 이메일, 이름, 비밀번호</li>
          <li>서비스 이용 기록, 접속 로그, 쿠키, 접속 IP 정보</li>
          <li>결제 시: 결제 정보(카드사명, 카드번호 일부 등)</li>
        </ul>

        <h2 className="text-xl font-semibold mt-10 mb-3 text-gray-900">2. 개인정보의 수집 및 이용 목적</h2>
        <ul className="list-disc pl-6 mb-8 space-y-1">
          <li>회원 가입 및 관리</li>
          <li>서비스 제공 및 맞춤형 서비스 제공</li>
          <li>고객 문의 및 민원 처리</li>
          <li>마케팅 및 광고 활용(동의한 경우에 한함)</li>
        </ul>

        <h2 className="text-xl font-semibold mt-10 mb-3 text-gray-900">3. 개인정보의 보유 및 이용 기간</h2>
        <ul className="list-disc pl-6 mb-8 space-y-1">
          <li>회원 탈퇴 시 즉시 파기</li>
          <li>관계 법령에 따라 일정 기간 보관이 필요한 경우 해당 기간 동안 보관</li>
        </ul>

        <h2 className="text-xl font-semibold mt-10 mb-3 text-gray-900">4. 개인정보의 제3자 제공</h2>
        <p className="mb-8">회사는 이용자의 동의 없이 개인정보를 외부에 제공하지 않습니다. 단, 법령에 의거하거나 수사기관의 요청이 있는 경우 등 예외적으로 제공될 수 있습니다.</p>

        <h2 className="text-xl font-semibold mt-10 mb-3 text-gray-900">5. 개인정보 처리 위탁</h2>
        <p className="mb-8">회사는 서비스 향상을 위해 필요한 경우 개인정보 처리를 외부에 위탁할 수 있으며, 위탁 시 관련 법령에 따라 안전하게 관리합니다.</p>

        <h2 className="text-xl font-semibold mt-10 mb-3 text-gray-900">6. 이용자의 권리와 행사 방법</h2>
        <ul className="list-disc pl-6 mb-8 space-y-1">
          <li>개인정보 열람, 정정, 삭제, 처리정지 요구 가능</li>
          <li>회원정보 수정 또는 탈퇴는 마이페이지에서 직접 가능</li>
        </ul>

        <h2 className="text-xl font-semibold mt-10 mb-3 text-gray-900">7. 개인정보의 파기 절차 및 방법</h2>
        <ul className="list-disc pl-6 mb-8 space-y-1">
          <li>목적 달성 후 즉시 파기</li>
          <li>전자적 파일: 복구 불가능한 방법으로 영구 삭제</li>
          <li>종이 문서: 분쇄 또는 소각</li>
        </ul>

        <h2 className="text-xl font-semibold mt-10 mb-3 text-gray-900">8. 개인정보 보호책임자 안내</h2>
        <p className="mb-8">문의사항이 있으시면 아래로 연락해 주세요.<br/>이메일: <a href="mailto:info@unimage.com" className="text-blue-600 underline">info@unimage.com</a></p>

        <h2 className="text-xl font-semibold mt-10 mb-3 text-gray-900">9. 고지의 의무</h2>
        <p className="mb-8">본 개인정보 처리방침은 법령 및 회사 정책에 따라 변경될 수 있으며, 변경 시 홈페이지를 통해 공지합니다.</p>

        <p className="mt-12 text-sm text-gray-500">시행일: 2025년 6월 24일</p>
      </section>
    </div>
  );
};

export default PrivacyPage; 