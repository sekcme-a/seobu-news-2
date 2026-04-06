"use client";

import { useState } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
);

export default function TenantModal({ room, onClose }) {
  const isOccupied = room.tenants && room.tenants.length > 0;
  const tenant = isOccupied ? room.tenants[0] : null;

  // 모든 필드를 포함한 초기 상태
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    occupants_count: 1,
    monthly_rent: 0,
    deposit: 0,
    start_date: new Date().toISOString().split("T")[0],
    agency_name: "",
    tax_invoice: false,
    elec_invoice: false,
    rent_due_day: 1,
    elec_due_day: 1,
    memo: "",
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleCheckIn = async (e) => {
    e.preventDefault();
    const { error } = await supabase.from("tenants").insert([
      {
        ...formData,
        room_id: room.id,
        room_number: room.room_number,
      },
    ]);

    if (error) {
      alert("등록 실패: " + error.message);
    } else {
      alert("입주 등록이 완료되었습니다.");
      onClose();
    }
  };

  // 퇴실 처리 로직
  const handleCheckOut = async () => {
    if (!tenant) return;

    const confirmMessage = `
[퇴실 확인]
호수: ${room.room_number}
성함: ${tenant.name}
보증금 반환 및 정산이 완료되었습니까?
퇴실 처리 시 모든 정보는 히스토리로 이동합니다.
    `;

    if (!confirm(confirmMessage)) return;
    try {
      // 1. 히스토리 저장 시 room_id를 포함 (유지보수 핵심)
      const { error: historyError } = await supabase
        .from("tenant_history")
        .insert([
          {
            room_id: room.id, // 고유 ID 저장
            room_number: room.room_number, // 방 이름 변경 대비 백업용 텍스트
            name: tenant.name,
            phone: tenant.phone,
            monthly_rent: tenant.monthly_rent,
            deposit: tenant.deposit,
            start_date: tenant.start_date,
            end_date: new Date().toISOString(),
            memo: tenant.memo,
            // 추가 정보들도 함께 아카이빙
            occupants_count: tenant.occupants_count,
            agency_name: tenant.agency_name,
          },
        ]);

      if (historyError) throw historyError;

      // 2. 현재 입주자 삭제
      const { error: deleteError } = await supabase
        .from("tenants")
        .delete()
        .eq("id", tenant.id);

      if (deleteError) throw deleteError;

      alert("퇴실 처리가 완료되었습니다.");
      onClose();
    } catch (err) {
      alert("오류 발생: " + err.message);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-2xl shadow-2xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-6 border-b flex justify-between items-center bg-slate-50">
          <div>
            <h3 className="text-xl font-bold text-slate-800">
              {room.room_number} 관리
            </h3>
            <p className="text-sm text-slate-500">
              {isOccupied ? "현재 입주 정보" : "새로운 입주자 등록"}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 transition"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="p-8 overflow-y-auto">
          {!isOccupied ? (
            <form onSubmit={handleCheckIn} className="space-y-6">
              {/* 기본 정보 섹션 */}
              <div>
                <h4 className="text-sm font-bold text-blue-600 mb-4 flex items-center gap-2">
                  <span className="w-1 h-4 bg-blue-600 rounded-full"></span>{" "}
                  기본 계약 정보
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-600">
                      성함
                    </label>
                    <input
                      name="name"
                      required
                      className="w-full border-slate-200 border p-2.5 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition"
                      onChange={handleChange}
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-600">
                      전화번호
                    </label>
                    <input
                      name="phone"
                      placeholder="010-0000-0000"
                      className="w-full border-slate-200 border p-2.5 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                      onChange={handleChange}
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-600">
                      인원 (명)
                    </label>
                    <input
                      name="occupants_count"
                      type="number"
                      className="w-full border-slate-200 border p-2.5 rounded-lg outline-none"
                      onChange={handleChange}
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-600">
                      부동산 명
                    </label>
                    <input
                      name="agency_name"
                      className="w-full border-slate-200 border p-2.5 rounded-lg outline-none"
                      onChange={handleChange}
                    />
                  </div>
                </div>
              </div>

              {/* 금액 및 날짜 정보 섹션 */}
              <div>
                <h4 className="text-sm font-bold text-blue-600 mb-4 flex items-center gap-2">
                  <span className="w-1 h-4 bg-blue-600 rounded-full"></span>{" "}
                  금액 및 입금 정보
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-600">
                      보증금 (원)
                    </label>
                    <input
                      name="deposit"
                      type="number"
                      className="w-full border-slate-200 border p-2.5 rounded-lg outline-none"
                      onChange={handleChange}
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-600">
                      월세 가격 (원)
                    </label>
                    <input
                      name="monthly_rent"
                      type="number"
                      className="w-full border-slate-200 border p-2.5 rounded-lg outline-none font-bold text-blue-600"
                      onChange={handleChange}
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-600">
                      월세 시작일
                    </label>
                    <input
                      name="start_date"
                      type="date"
                      value={formData.start_date}
                      className="w-full border-slate-200 border p-2.5 rounded-lg outline-none"
                      onChange={handleChange}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-slate-600">
                        월세 입금일
                      </label>
                      <input
                        name="rent_due_day"
                        type="number"
                        placeholder="일"
                        className="w-full border-slate-200 border p-2.5 rounded-lg outline-none"
                        onChange={handleChange}
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-slate-600">
                        전기세 입금일
                      </label>
                      <input
                        name="elec_due_day"
                        type="number"
                        placeholder="일"
                        className="w-full border-slate-200 border p-2.5 rounded-lg outline-none"
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* 기타 설정 섹션 */}
              <div className="bg-slate-50 p-4 rounded-xl space-y-4">
                <div className="flex gap-6">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      name="tax_invoice"
                      type="checkbox"
                      className="w-4 h-4 rounded text-blue-600"
                      onChange={handleChange}
                    />
                    <span className="text-sm font-medium text-slate-700">
                      월세 세금계산서
                    </span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      name="elec_invoice"
                      type="checkbox"
                      className="w-4 h-4 rounded text-blue-600"
                      onChange={handleChange}
                    />
                    <span className="text-sm font-medium text-slate-700">
                      전기세 계산서
                    </span>
                  </label>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-600">
                    메모
                  </label>
                  <textarea
                    name="memo"
                    rows="3"
                    className="w-full border-slate-200 border p-2.5 rounded-lg outline-none resize-none"
                    onChange={handleChange}
                  ></textarea>
                </div>
              </div>

              <button className="w-full bg-blue-600 text-white py-4 rounded-xl font-bold hover:bg-blue-700 shadow-lg shadow-blue-200 transition-all active:scale-[0.98]">
                입주 등록하기
              </button>
            </form>
          ) : (
            <div className="space-y-6">
              {/* 기존 입주자 정보 표시 로직 (생략 - 필요시 handleCheckOut 버튼 포함) */}
              <div className="bg-blue-50 p-6 rounded-2xl border border-blue-100">
                <p className="text-blue-600 font-bold mb-2">입주 정보</p>
                <div className="grid grid-cols-2 gap-y-3 text-sm">
                  <span className="text-slate-500">성함</span>{" "}
                  <span className="font-semibold">{tenant.name}</span>
                  <span className="text-slate-500">연락처</span>{" "}
                  <span className="font-semibold">{tenant.phone}</span>
                  <span className="text-slate-500">월세</span>{" "}
                  <span className="font-semibold text-blue-600">
                    {Number(tenant.monthly_rent).toLocaleString()}원
                  </span>
                  <span className="text-slate-500">입금일</span>{" "}
                  <span className="font-semibold">
                    월세 {tenant.rent_due_day}일 / 전기세 {tenant.elec_due_day}
                    일
                  </span>
                </div>
              </div>
              {/* 퇴실 버튼 */}
              <div className="pt-4 border-t">
                <button
                  onClick={handleCheckOut}
                  className="w-full py-4 bg-white border-2 border-red-100 text-red-500 rounded-xl font-bold hover:bg-red-50 transition-colors flex items-center justify-center gap-2"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                    />
                  </svg>
                  퇴실 처리 및 데이터 보관
                </button>
                <p className="text-center text-[11px] text-slate-400 mt-3">
                  * 퇴실 시 입주 정보는 '퇴실 기록'으로 안전하게 이동됩니다.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
