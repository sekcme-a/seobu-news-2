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

// import React from "react";
// import { Award, Target, Users, Zap } from "lucide-react"; // 아이콘 라이브러리 사용 권장

// export default function AboutCleanWhite() {
//   const values = [
//     {
//       icon: <Target className="w-8 h-8 text-blue-600" />,
//       title: "진실 보도",
//       desc: "사실에 기반한 정확한 정보만을 전달합니다.",
//     },
//     {
//       icon: <Zap className="w-8 h-8 text-blue-600" />,
//       title: "신속한 뉴스",
//       desc: "지역의 이슈를 가장 빠르게 포착하여 보도합니다.",
//     },
//     {
//       icon: <Award className="w-8 h-8 text-blue-600" />,
//       title: "공정한 시각",
//       desc: "편향되지 않은 중립적인 입장을 견지합니다.",
//     },
//     {
//       icon: <Users className="w-8 h-8 text-blue-600" />,
//       title: "시민과 소통",
//       desc: "독자의 목소리에 귀 기울이며 함께 만들어갑니다.",
//     },
//   ];

//   return (
//     <div className="bg-white text-slate-900 font-sans">
//       {/* 1. 히어로 섹션: 투명하고 시원한 첫인상 */}
//       <section className="relative py-28 md:py-40 bg-slate-50/50 border-b border-slate-100 overflow-hidden">
//         {/* 은은한 배경 패턴 */}
//         <div className="absolute inset-0 opacity-[0.03] bg-[url('https://www.transparenttextures.com/patterns/az-subtle.png')]"></div>

//         <div className="relative max-w-7xl mx-auto px-6 text-center">
//           <div className="inline-flex items-center gap-2 px-4 py-1.5 mb-6 text-sm font-semibold text-blue-700 bg-blue-50 rounded-full border border-blue-100">
//             <Zap className="w-4 h-4" />
//             <span>Real-time News Media</span>
//           </div>
//           <h1 className="text-5xl md:text-7xl font-extrabold tracking-tighter text-slate-950 mb-8 leading-[1.1]">
//             세상을 바꾸는 <br />
//             <span className="text-blue-600">정직한 목소리</span>, 투데이태백
//           </h1>
//           <p className="max-w-3xl mx-auto text-xl md:text-2xl text-slate-600 font-light leading-relaxed">
//             우리는 정보의 홍수 속에서 진실의 침침함을 밝히는 등불이 되겠습니다.{" "}
//             <br />
//             팩트를 넘어 가치를 담은 뉴스를 만나보세요.
//           </p>
//         </div>
//       </section>

//       {/* 2. 핵심 가치 섹션: 미니멀 그리드 */}
//       <section className="py-24 md:py-32">
//         <div className="max-w-7xl mx-auto px-6">
//           <div className="text-center mb-20">
//             <h2 className="text-sm font-bold tracking-[0.3em] text-blue-600 uppercase mb-3">
//               Core Values
//             </h2>
//             <p className="text-4xl font-bold text-slate-950 tracking-tight">
//               우리가 지키는 네 가지 약속
//             </p>
//           </div>

//           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
//             {values.map((value, idx) => (
//               <div
//                 key={idx}
//                 className="bg-white p-10 rounded-3xl border border-slate-100 shadow-sm hover:border-blue-100 hover:shadow-xl hover:shadow-blue-500/5 transition-all duration-300 group"
//               >
//                 <div className="mb-8 p-4 inline-block bg-blue-50 rounded-2xl group-hover:scale-110 transition-transform duration-300">
//                   {value.icon}
//                 </div>
//                 <h3 className="text-2xl font-semibold text-slate-950 mb-4">
//                   {value.title}
//                 </h3>
//                 <p className="text-slate-600 leading-relaxed font-light">
//                   {value.desc}
//                 </p>
//               </div>
//             ))}
//           </div>
//         </div>
//       </section>

//       {/* 3. CEO 메시지 섹션: 정갈한 타이포그래피 중심 */}
//       <section className="py-24 md:py-32 bg-slate-50/50 border-y border-slate-100">
//         <div className="max-w-5xl mx-auto px-6">
//           <div className="grid grid-cols-1 md:grid-cols-[200px,1fr] gap-16 items-start">
//             <div className="sticky top-10 text-center md:text-left">
//               <h2 className="text-4xl font-bold text-slate-950 tracking-tight mb-4">
//                 CEO <br />
//                 메시지
//               </h2>
//               <div className="w-16 h-1 bg-blue-600 rounded-full mx-auto md:mx-0"></div>
//             </div>

//             <div className="space-y-8 text-slate-700 text-lg leading-[1.8] font-light">
//               <p className="text-2xl font-normal text-slate-950 leading-snug">
//                 안녕하십니까, <br className="md:hidden" />
//                 <span className="font-bold text-blue-700">투데이태백</span>{" "}
//                 대표이사 <span className="font-bold">심귀자</span>입니다.
//               </p>

//               <p>
//                 정보의 홍수 속에서 진실을 가려내는 일은 그 어느 때보다
//                 중요해졌습니다. 가짜 뉴스가 범람하고 편향된 정보가 여론을
//                 왜곡하는 시대에, 투데이태백은 오직{" "}
//                 <strong className="font-semibold text-slate-950">'팩트'</strong>
//                 와{" "}
//                 <strong className="font-semibold text-slate-950">'진실'</strong>
//                 이라는 언론 본연의 가치를 지키기 위해 탄생했습니다.
//               </p>

//               <blockquote className="pl-6 border-l-4 border-blue-200 py-2 my-10 italic text-xl text-slate-800 font-medium bg-blue-50/50 rounded-r-xl">
//                 "어떠한 외압에도 흔들리지 않는 <br />
//                 성역 없는 취재를 약속드립니다."
//               </blockquote>

//               <p>
//                 우리는 사회의 어두운 곳을 밝히는 등불이 되고, 소외된 이웃의 작은
//                 목소리도 크게 듣는 따뜻한 언론이 되겠습니다. 독자 여러분의
//                 날카로운 비판과 따뜻한 격려가 투데이태백을 성장시키는 가장 큰
//                 원동력입니다.
//               </p>

//               <p>
//                 앞으로도 초심을 잃지 않고 정론직필의 길을 묵묵히 걸어가겠습니다.
//                 감사합니다.
//               </p>

//               <div className="mt-16 pt-10 border-t border-slate-200 text-right">
//                 <p className="text-sm text-slate-500 mb-1">
//                   Truth & Transparency Media Group
//                 </p>
//                 <p className="text-2xl font-serif tracking-[0.2em] text-slate-950">
//                   심귀자
//                 </p>
//               </div>
//             </div>
//           </div>
//         </div>
//       </section>

//       {/* 4. 하단 CTA 섹션: 깔끔한 마무리 */}
//       <section className="py-24 md:py-32 bg-white text-center">
//         <div className="max-w-3xl mx-auto px-6">
//           <h3 className="text-4xl font-bold text-slate-950 tracking-tight mb-6">
//             함께 만들어가는 미래
//           </h3>
//           <p className="text-xl text-slate-600 font-light leading-relaxed mb-12">
//             투데이태백은 언제나 독자 여러분의 제보와 의견을 기다립니다. <br />
//             우리의 내일이 더 투명해질 수 있도록, 지금 바로 목소리를 보태주세요.
//           </p>
//           <div className="flex gap-4 justify-center">
//             <button className="px-8 py-4 bg-slate-900 text-white font-semibold rounded-full hover:bg-slate-800 transition-colors duration-300">
//               기사 제보하기
//             </button>
//             <button className="px-8 py-4 bg-white text-slate-900 font-semibold rounded-full border border-slate-200 hover:border-slate-300 hover:bg-slate-50 transition-all duration-300">
//               광고/제휴 문의
//             </button>
//           </div>
//         </div>
//       </section>
//     </div>
//   );
// }
