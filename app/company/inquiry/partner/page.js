import InquiryForm from "../../components/InquiryForm";

export default function InquiryPartner() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-16">
      <div className="mb-10">
        <h1 className="text-4xl font-extrabold text-gray-900 mb-4">제휴문의</h1>
        <p className="text-lg text-gray-600">
          콘텐츠 교류, 공동 이벤트, 전략적 파트너십 등 <br />
          서부뉴스와 함께 성장할 기업 및 기관의 제안을 기다립니다.
        </p>
      </div>
      <InquiryForm category="제휴문의" categoryId="partner" />
    </div>
  );
}
