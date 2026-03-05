export default function AboutIntro() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-16">
      <div className="text-center mb-16">
        <h1 className="text-4xl font-extrabold text-gray-900 mb-4">회사소개</h1>
        <p className="text-xl text-gray-500">
          세상의 모든 이야기를 가장 투명하게 비추는 거울, 서부뉴스입니다.
        </p>
      </div>

      <div className="bg-white shadow-xl rounded-2xl overflow-hidden border border-gray-100">
        <div className="p-10 md:p-16">
          <h2 className="text-3xl font-bold text-blue-900 mb-8 border-b-2 border-blue-900 pb-4 inline-block">
            CEO 인사말
          </h2>
          <div className="text-lg text-gray-700 leading-loose space-y-6">
            <p>
              <strong>안녕하십니까, 서부뉴스 대표이사 김균식입니다.</strong>
            </p>
            <p>
              {`정보의 홍수 속에서 진실을 가려내는 일은 그 어느 때보다
              중요해졌습니다. 가짜 뉴스가 범람하고 편향된 정보가 여론을 왜곡하는
              시대에, 서부뉴스는 오직 '팩트'와 '진실'이라는 언론 본연의 가치를
              지키기 위해 탄생했습니다.`}
            </p>
            <p>
              우리는 어떠한 권력이나 자본의 외압에도 흔들리지 않는{" "}
              <strong>성역 없는 취재</strong>를 약속드립니다. 사회의 어두운 곳을
              밝히는 등불이 되고, 소외된 이웃의 작은 목소리도 크게 듣는 따뜻한
              언론이 되겠습니다.
            </p>
            <p>
              독자 여러분의 날카로운 비판과 따뜻한 격려가 서부뉴스를 성장시키는
              가장 큰 원동력입니다. 앞으로도 초심을 잃지 않고 정론직필의 길을
              묵묵히 걸어가겠습니다. 감사합니다.
            </p>
            <p className="text-right pt-8 font-bold text-xl text-gray-900">
              서부뉴스 대표이사 <span className="text-2xl ml-2">김 균 식</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
