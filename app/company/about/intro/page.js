import React from "react";

export default function AboutModern() {
  return (
    <div className="bg-[#f9fafb] min-h-screen font-sans text-slate-900">
      {/* 상단 장식 요소 */}
      <div className="h-2 bg-gradient-to-r from-red-600 via-orange-500 to-yellow-400 w-full" />

      <main className="max-w-7xl mx-auto px-6 py-20 md:py-32">
        {/* 헤드라인 섹션 */}
        <header className="mb-24">
          <div className="flex items-center gap-4 mb-8">
            <span className="h-[1px] w-12 bg-slate-400"></span>
            <span className="text-sm font-bold tracking-[0.2em] text-slate-500 uppercase">
              Our Story
            </span>
          </div>
          <h1 className="text-5xl md:text-8xl font-black leading-[1.1] tracking-tighter mb-10">
            서부뉴스 <br />
            <span className="text-slate-300">오늘을 기록하다.</span>
          </h1>
          <p className="max-w-xl text-xl text-slate-600 leading-relaxed font-light">
            우리는 단순히 뉴스를 전달하는 것을 넘어, 사회의 이면을 탐구하고
            내일의 변화를 이끄는 디지털 미디어 그룹입니다.
          </p>
        </header>

        {/* CEO 섹션 (스플릿 레이아웃) */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-stretch">
          {/* 왼쪽: 비주얼 & 시그니처 */}
          <div className="relative group">
            <div className="absolute -inset-4 bg-slate-200 rounded-2xl scale-95 group-hover:scale-100 transition-transform duration-700 opacity-50"></div>
            <div className="relative h-full min-h-[400px] bg-slate-900 rounded-2xl overflow-hidden flex flex-col justify-end p-12 text-white">
              {/* 패턴 배경 배경 */}
              <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>

              <div className="relative z-10">
                <blockquote className="text-3xl font-serif italic mb-8 leading-snug">
                  "언론의 가치는 <br />
                  타협하지 않는 <br />
                  용기에서 나옵니다."
                </blockquote>
                <div className="space-y-1">
                  <p className="text-slate-400 text-sm tracking-widest uppercase">
                    CEO / Publisher
                  </p>
                  <p className="text-4xl font-light tracking-tighter">
                    Kim Kyun Sik
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* 오른쪽: 메시지 본문 */}
          <div className="flex flex-col justify-center">
            <h2 className="text-2xl font-bold mb-8 flex items-end gap-2">
              인사말{" "}
              <span className="text-sm font-normal text-slate-400 pb-1">
                Message
              </span>
            </h2>

            <div className="space-y-6 text-slate-600 leading-relaxed text-lg">
              <p>
                안녕하십니까,{" "}
                <span className="text-slate-900 font-bold">서부뉴스</span>{" "}
                대표이사 김균식입니다.
              </p>

              <p>
                지금은 정보가 부족한 시대가 아니라,{" "}
                <strong>진짜 정보를 찾는 것이 어려운 시대</strong>입니다.
                넘쳐나는 데이터 속에서 우리는 무엇이 진실인지 매 순간 질문해야
                합니다.
              </p>

              <p className="pl-6 border-l-2 border-slate-900 py-2 italic text-slate-800">
                "서부뉴스은 그 질문에 대한 가장 정직한 해답이 되고자 합니다."
              </p>

              <p>
                우리는 거대 권력의 눈치를 보지 않습니다. 광고주의 입맛에 맞는
                기사를 쓰지 않습니다. 오직 독자의 알 권리를 최우선 가치로 두며,{" "}
                <strong>성역 없는 취재</strong>와
                <strong>정교한 팩트체크</strong>를 통해 미디어의 새로운 기준을
                세우겠습니다.
              </p>

              <p>
                사회 곳곳의 부조리를 고발하는 날카로움과, 우리 이웃의 온기를
                전하는 따뜻함을 동시에 지닌 입체적인 언론이 되겠습니다. 묵묵히
                정론직필의 길을 걷는 서부뉴스의 여정에 함께해 주시길
                부탁드립니다.
              </p>

              <div className="pt-10 flex items-center justify-between border-t border-slate-200">
                <div className="text-sm text-slate-400">
                  <p>Trustworthy Journalism</p>
                  <p>Today Taebaek Media Group</p>
                </div>
                <div className="text-right">
                  <p className="text-xs uppercase tracking-widest text-slate-400 mb-1 font-bold">
                    Signature
                  </p>
                  <p className="text-2xl font-serif tracking-[0.3em] text-slate-900">
                    김균식
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 하단 수치 섹션 (신뢰도 강조) */}
        {/* <section className="mt-32 grid grid-cols-2 md:grid-cols-4 gap-8 border-y border-slate-200 py-16">
          {[
            { label: "창간", value: "2024.10" },
            { label: "누적 보도", value: "12,400+" },
            { label: "월간 독자", value: "850k" },
            { label: "취재 윤리 준수", value: "100%" },
          ].map((stat, i) => (
            <div key={i} className="text-center">
              <p className="text-slate-400 text-xs mb-2 font-bold uppercase tracking-tighter">
                {stat.label}
              </p>
              <p className="text-2xl font-black text-slate-900">{stat.value}</p>
            </div>
          ))}
        </section> */}
      </main>
    </div>
  );
}
