export default function HistoryDetailModal({ data, onClose }) {
  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
      <div className="bg-white rounded-2xl w-full max-w-lg shadow-xl overflow-hidden">
        <div className="p-5 border-b flex justify-between items-center bg-slate-50">
          <h3 className="font-bold text-slate-800">
            {data.room_number} 과거 정보
          </h3>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600"
          >
            닫기
          </button>
        </div>

        <div className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <InfoItem label="성함" value={data.name} />
            <InfoItem label="전화번호" value={data.phone} />
            <InfoItem
              label="보증금"
              value={`${Number(data.deposit || 0).toLocaleString()}원`}
            />
            <InfoItem
              label="월세"
              value={`${Number(data.monthly_rent || 0).toLocaleString()}원`}
              color="text-blue-600"
            />
            <InfoItem label="입주일" value={data.start_date} />
            <InfoItem
              label="퇴실일"
              value={
                data.end_date &&
                new Date(data.end_date).toISOString().slice(0, 10)
              }
            />
            <InfoItem label="인원" value={`${data.occupants_count || 1}명`} />
            <InfoItem label="부동산" value={data.agency_name || "직거래"} />
            {/* <InfoItem label="입금일" value={`매달 ${data.rent_due_day}일`} /> */}
          </div>

          <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
            <p className="text-[11px] font-bold text-slate-400 mb-1">메모</p>
            <p className="text-sm text-slate-600 whitespace-pre-wrap">
              {data.memo || "기록된 메모가 없습니다."}
            </p>
          </div>

          <div className="flex gap-2">
            <span
              className={`text-[10px] px-2 py-1 rounded font-bold ${data.tax_invoice ? "bg-blue-50 text-blue-600" : "bg-slate-100 text-slate-400"}`}
            >
              {data.tax_invoice ? "세금계산서 발행" : "계산서 미발행"}
            </span>
            {data.isEvicted && (
              <span className="text-[10px] px-2 py-1 rounded font-bold bg-red-50 text-red-600">
                퇴실 완료
              </span>
            )}
          </div>
        </div>

        <div className="p-4 bg-slate-50 border-t flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-slate-800 text-white rounded-lg text-sm font-bold"
          >
            확인
          </button>
        </div>
      </div>
    </div>
  );
}

function InfoItem({ label, value, color = "text-slate-700" }) {
  return (
    <div>
      <p className="text-[10px] font-bold text-slate-400 mb-0.5">{label}</p>
      <p className={`text-sm font-bold ${color}`}>{value || "-"}</p>
    </div>
  );
}
