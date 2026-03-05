export default function AboutOverview() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-16">
      <div className="text-center mb-16">
        <h1 className="text-4xl font-extrabold text-gray-900 mb-4">회사개요</h1>
        <p className="text-xl text-gray-500">
          투명하고 신뢰받는 기업, 서부뉴스의 기본 정보입니다.
        </p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <tbody className="divide-y divide-gray-200">
            <tr className="hover:bg-gray-50 transition-colors">
              <th className="w-1/3 py-6 px-8 bg-gray-50 font-bold text-gray-900 text-lg border-r border-gray-200">
                회사명
              </th>
              <td className="w-2/3 py-6 px-8 text-lg text-gray-700">
                (주)서부뉴스
              </td>
            </tr>
            <tr className="hover:bg-gray-50 transition-colors">
              <th className="w-1/3 py-6 px-8 bg-gray-50 font-bold text-gray-900 text-lg border-r border-gray-200">
                설립일자
              </th>
              <td className="w-2/3 py-6 px-8 text-lg text-gray-700">
                2026년 1월 1일
              </td>
            </tr>
            <tr className="hover:bg-gray-50 transition-colors">
              <th className="w-1/3 py-6 px-8 bg-gray-50 font-bold text-gray-900 text-lg border-r border-gray-200">
                대표이사
              </th>
              <td className="w-2/3 py-6 px-8 text-lg text-gray-700">홍길동</td>
            </tr>
            {/* <tr className="hover:bg-gray-50 transition-colors">
              <th className="w-1/3 py-6 px-8 bg-gray-50 font-bold text-gray-900 text-lg border-r border-gray-200">
                사업분야
              </th>
              <td className="w-2/3 py-6 px-8 text-lg text-gray-700">
                인터넷 신문 발행, 정기간행물 출판, 미디어 콘텐츠 제작 등
              </td>
            </tr> */}
            <tr className="hover:bg-gray-50 transition-colors">
              <th className="w-1/3 py-6 px-8 bg-gray-50 font-bold text-gray-900 text-lg border-r border-gray-200">
                주소
              </th>
              <td className="w-2/3 py-6 px-8 text-lg text-gray-700">
                경기도 시흥시 장현동 671-5 시티프론트561 더파이브437호
              </td>
            </tr>
            <tr className="hover:bg-gray-50 transition-colors">
              <th className="w-1/3 py-6 px-8 bg-gray-50 font-bold text-gray-900 text-lg border-r border-gray-200">
                대표전화
              </th>
              <td className="w-2/3 py-6 px-8 text-lg text-gray-700">
                031-311-8272
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
