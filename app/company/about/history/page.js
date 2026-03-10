import React from "react";

export default function HistorySection() {
  const historyData = [
    {
      year: "2026",
      events: [
        {
          month: "00",
          title: "제9회 지방선거 합동토론회 추진",
          desc: "2026년 지방선거 대비 합동토론회 기획 및 추진 중",
        },
      ],
    },
    {
      year: "2025",
      events: [
        {
          month: "00",
          title: "영남지역 산불특별취재 및 성금 전달",
          desc: "산불 피해 지역 현장 취재 및 피해 복구를 위한 성금 기탁",
        },
      ],
    },
    {
      year: "2024",
      events: [
        {
          month: "00",
          title: "제22대 총선 후보자 릴레이 인터뷰",
          desc: "국회의원 선거 후보자별 심층 인터뷰 진행 및 보도",
        },
      ],
    },
    {
      year: "2022",
      events: [
        {
          month: "00",
          title: "제8회 지방선거 합동토론회 개최",
          desc: "유권자의 알 권리 충족을 위한 지방선거 후보자 합동토론회 운영",
        },
      ],
    },
    {
      year: "2020",
      events: [
        {
          month: "00",
          title: "제21대 총선 후보자 릴레이 인터뷰",
          desc: "총선 후보자 대상 릴레이 인터뷰 진행",
        },
      ],
    },
    {
      year: "2019",
      events: [
        {
          month: "03",
          title: "창간 10주년 기념식 개최",
          desc: "서부뉴스 창간 10주년 맞이 기념행사 및 비전 선포",
        },
      ],
    },
    {
      year: "2018",
      events: [
        {
          month: "00",
          title: "제7회 지방선거 합동토론회 개최",
          desc: "지방선거 후보자 초청 토론회 실시",
        },
      ],
    },
    {
      year: "2017",
      events: [
        {
          month: "00",
          title: "시민 기자단 출범",
          desc: "지역 밀착형 보도를 위한 시민 참여 기자단 구성",
        },
      ],
    },
    {
      year: "2016",
      events: [
        {
          month: "00",
          title: "제20대 총선 합동토론회 개최",
          desc: "국회의원 선거 후보자 합동토론회 개최",
        },
      ],
    },
    {
      year: "2014",
      events: [
        {
          month: "00",
          title: "제6회 지방선거 합동토론회 개최",
          desc: "지역 유권자를 위한 후보자 검증 토론회",
        },
      ],
    },
    {
      year: "2013",
      events: [
        {
          month: "00",
          title: "학생 기자단 출범",
          desc: "청소년 시각의 뉴스 발굴을 위한 학생 기자단 운영",
        },
      ],
    },
    {
      year: "2012",
      events: [
        {
          month: "00",
          title: "제19대 총선 합동토론회 개최",
          desc: "총선 후보자 정책 토론회 진행",
        },
        {
          month: "00",
          title: "3대 국경일 지키기 행사 개최",
          desc: "나라 사랑 정신 고취를 위한 국경일 기념 행사",
        },
        {
          month: "00",
          title: "제주특별자치도 취재 지역 추가",
          desc: "보도 네트워크 확장을 위한 제주 지역 취재망 확보",
        },
      ],
    },
    {
      year: "2011",
      events: [
        {
          month: "00",
          title: "안산지역 교육현장 릴레이 특별 취재",
          desc: "지역 내 28개교 교육 현장 연속 기획 취재",
        },
      ],
    },
    {
      year: "2010",
      events: [
        {
          month: "00",
          title: "코레일 서부본부 업무협약",
          desc: "철도 행정 홍보 및 상호 협력을 위한 MOU 체결",
        },
        {
          month: "00",
          title: "3대 국경일 지키기 행사 개최",
          desc: "범시민 국경일 지키기 캠페인 전개",
        },
        {
          month: "00",
          title: "안산시외버스복합터미널 업무협약",
          desc: "지역 교통 인프라 홍보 및 협력 추진",
        },
        {
          month: "00",
          title: "제5회 지방선거 합동 토론회 개최",
          desc: "지방선거 당선자 윤곽 및 정책 검증을 위한 토론",
        },
      ],
    },
    {
      year: "2009",
      events: [
        {
          month: "03",
          title: "서부뉴스 창간",
          desc: "안산·시흥·광명 지역 광역 주간신문 창간",
        },
        {
          month: "00",
          title: "3대 국경일 지키기 행사 개최",
          desc: "창간 첫해 국경일 기념 문화 행사 개최",
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
