import InquiryForm from "../../components/InquiryForm";

export default function InquiryAd() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-16">
      <div className="mb-10">
        <h1 className="text-4xl font-extrabold text-gray-900 mb-4">광고문의</h1>
        <p className="text-lg text-gray-600">
          서부뉴스의 폭넓은 독자층을 대상으로 최고의 광고 효율을 경험해 보세요.
          <br />
          배너 광고, 기획 기사 등 다양한 형태의 광고 상담이 가능합니다.
        </p>
      </div>
      <InquiryForm category="광고문의" categoryId="ad" />
    </div>
  );
}
