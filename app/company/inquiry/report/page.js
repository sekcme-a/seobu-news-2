import InquiryForm from "../../components/InquiryForm";

export default function InquiryReport() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-16">
      <div className="mb-10">
        <h1 className="text-4xl font-extrabold text-gray-900 mb-4">기사제보</h1>
        <p className="text-lg text-gray-600">
          사회의 부조리, 억울한 사연, 미담 등 여러분의 소중한 제보가 세상을
          바꿉니다.
          <br />
          제보자의 신원은 철저히 보호됩니다.
        </p>
      </div>
      <InquiryForm category="기사제보" categoryId="report" />
    </div>
  );
}
