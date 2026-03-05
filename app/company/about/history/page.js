import React from "react";

export default function HistorySection() {
  const historyData = [
    {
      year: "2026",
      events: [
        {
          month: "03",
          title: "서부뉴스 통합 뉴스룸 AI 시스템 도입",
          desc: "실시간 팩트체크 시스템 '태백 인사이트' 구축",
        },
        {
          month: "01",
          title: "월간 활성 독자수(MAU) 100만 명 돌파",
          desc: "디지털 뉴스 영향력 지수 지역 부문 1위 선정",
        },
      ],
    },
    {
      year: "2025",
      events: [
        {
          month: "11",
          title: "대한민국 인터넷 언론 대상 수상",
          desc: "심층 보도 부문 대상 (탐사보도 '태백의 눈')",
        },
        {
          month: "06",
          title: "모바일 전용 뉴스 앱(App) 정식 런칭",
          desc: "사용자 맞춤형 뉴스 큐레이션 서비스 시작",
        },
        {
          month: "02",
          title: "지역 경제 살리기 '상생 미디어' 프로젝트 발족",
          desc: "소상공인 무료 홍보 및 디지털 전환 지원",
        },
      ],
    },
    {
      year: "2024",
      events: [
        {
          month: "10",
          title: "서부뉴스 창간 및 창립 기념식",
          desc: "'진실을 비추는 거울' 슬로건 아래 정식 서비스 개시",
        },
        {
          month: "08",
          title: "독립 언론 법인 '태백 미디어 그룹' 설립",
          desc: "정론직필을 위한 자본으로부터의 독립 선언",
        },
      ],
    },
  ];

  return (
    <section className="bg-white py-24 md:py-40 overflow-hidden">
      <div className="max-w-6xl mx-auto px-6">
        {/* 헤더 섹션 */}
        <div className="mb-24 text-center">
          <h2 className="text-sm font-bold tracking-[0.4em] text-blue-600 uppercase mb-4">
            Our Journey
          </h2>
          <p className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight">
            서부뉴스가 걸어온 <br className="md:hidden" />{" "}
            <span className="text-slate-300">신뢰의 기록</span>
          </p>
        </div>

        {/* 연혁 타임라인 리스트 */}
        <div className="relative">
          {/* 중앙 수직선 (데스크탑 전용) */}
          <div className="absolute left-1/2 transform -translate-x-1/2 w-[1px] h-full bg-slate-200 hidden lg:block"></div>

          <div className="space-y-24">
            {historyData.map((group, index) => (
              <div key={group.year} className="relative">
                {/* 연도 표시 */}
                <div className="flex justify-center mb-12">
                  <span className="relative z-10 px-8 py-2 bg-slate-900 text-white font-black text-2xl rounded-full tracking-widest shadow-xl">
                    {group.year}
                  </span>
                </div>

                <div className="space-y-12">
                  {group.events.map((item, i) => (
                    <div
                      key={i}
                      className={`flex flex-col lg:flex-row items-center gap-8 ${
                        i % 2 === 0 ? "lg:flex-row" : "lg:flex-row-reverse"
                      }`}
                    >
                      {/* 카드 내용 */}
                      <div className="flex-1 w-full">
                        <div
                          className={`p-8 rounded-[32px] border border-slate-100 hover:border-blue-200 hover:shadow-2xl hover:shadow-blue-500/10 transition-all duration-500 bg-white ${
                            i % 2 === 0 ? "lg:text-right" : "lg:text-left"
                          }`}
                        >
                          <span className="text-blue-600 font-black text-xl mb-2 block">
                            {item.month}월
                          </span>
                          <h3 className="text-xl font-bold text-slate-900 mb-3 leading-tight">
                            {item.title}
                          </h3>
                          <p className="text-slate-500 font-light leading-relaxed">
                            {item.desc}
                          </p>
                        </div>
                      </div>

                      {/* 중앙 연결 포인트 */}
                      <div className="relative flex items-center justify-center w-12 h-12">
                        <div className="w-3 h-3 bg-blue-600 rounded-full ring-8 ring-blue-50"></div>
                      </div>

                      {/* 반대편 빈 공간 (레이아웃 균형) */}
                      <div className="flex-1 hidden lg:block"></div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 하단 엔딩 멘트 */}
        <div className="mt-40 text-center">
          <p className="text-slate-400 font-light italic mb-8">
            {`History doesn't stop, it continues with you.`}
          </p>
          <div className="inline-block p-[1px] bg-gradient-to-r from-transparent via-slate-300 to-transparent w-full max-w-md"></div>
        </div>
      </div>
    </section>
  );
}
