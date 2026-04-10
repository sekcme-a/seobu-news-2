"use client";
import { useState, useEffect } from "react";

const defaultForm = {
  name: "",
  phone: "",
  people_count: 1,
  monthly_rent: "",
  rent_start_date: "",
  agency_name: "",
  deposit: "",
  tax_invoice: false,
  rent_due_day: "",
  electric_due_day: "",
  electric_invoice: false,
  memo: "",
};

export default function TenantModal({ room, onClose, onSave }) {
  const [form, setForm] = useState(defaultForm);
  const [saving, setSaving] = useState(false);

  function handleChange(e) {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (
      !form.name ||
      !form.phone ||
      !form.monthly_rent ||
      !form.rent_start_date ||
      !form.rent_due_day
    ) {
      return alert("필수 항목을 입력해주세요.");
    }
    setSaving(true);
    await onSave({ ...form, room_id: room.id, room_number: room.room_number });
    setSaving(false);
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-box"
        style={{ maxWidth: 640 }}
        onClick={(e) => e.stopPropagation()}
      >
        <div
          className="p-6"
          style={{ borderBottom: "1px solid var(--border)" }}
        >
          <h2 className="text-lg font-bold" style={{ color: "var(--text)" }}>
            입주자 등록 —{" "}
            <span style={{ color: "var(--accent)" }}>
              {room?.room_number}호
            </span>
          </h2>
        </div>
        <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">성함 *</label>
              <input
                className="input"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="홍길동"
                required
              />
            </div>
            <div>
              <label className="label">전화번호 *</label>
              <input
                className="input"
                name="phone"
                value={form.phone}
                onChange={handleChange}
                placeholder="010-0000-0000"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">인원</label>
              <input
                className="input"
                name="people_count"
                type="number"
                min="1"
                value={form.people_count}
                onChange={handleChange}
              />
            </div>
            <div>
              <label className="label">월세 가격 (원) *</label>
              <input
                className="input"
                name="monthly_rent"
                type="number"
                value={form.monthly_rent}
                onChange={handleChange}
                placeholder="500000"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">월세 시작일 *</label>
              <input
                className="input"
                name="rent_start_date"
                type="date"
                value={form.rent_start_date}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <label className="label">부동산 명</label>
              <input
                className="input"
                name="agency_name"
                value={form.agency_name}
                onChange={handleChange}
                placeholder="○○부동산"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">보증금 (원)</label>
              <input
                className="input"
                name="deposit"
                type="number"
                value={form.deposit}
                onChange={handleChange}
                placeholder="1000000"
              />
            </div>
            <div className="flex items-end pb-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  name="tax_invoice"
                  checked={form.tax_invoice}
                  onChange={handleChange}
                  className="w-4 h-4 accent-blue-500"
                />
                <span className="text-sm" style={{ color: "var(--text)" }}>
                  세금계산서 발행
                </span>
              </label>
            </div>
          </div>

          <div style={{ borderTop: "1px solid var(--border)", paddingTop: 16 }}>
            <div
              className="text-xs font-semibold uppercase tracking-wider mb-3"
              style={{ color: "var(--text-muted)" }}
            >
              납부 설정
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="label">월세 입금일 * (매월 N일)</label>
                <input
                  className="input"
                  name="rent_due_day"
                  type="number"
                  min="1"
                  max="31"
                  value={form.rent_due_day}
                  onChange={handleChange}
                  placeholder="25"
                  required
                />
              </div>
              <div>
                <label className="label">전기세 입금일 (매월 N일)</label>
                <input
                  className="input"
                  name="electric_due_day"
                  type="number"
                  min="1"
                  max="31"
                  value={form.electric_due_day}
                  onChange={handleChange}
                  placeholder="10"
                />
              </div>
            </div>
            <div className="mt-3">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  name="electric_invoice"
                  checked={form.electric_invoice}
                  onChange={handleChange}
                  className="w-4 h-4 accent-blue-500"
                />
                <span className="text-sm" style={{ color: "var(--text)" }}>
                  전기세 계산서 발행
                </span>
              </label>
            </div>
          </div>

          <div>
            <label className="label">메모</label>
            <textarea
              className="input"
              name="memo"
              value={form.memo}
              onChange={handleChange}
              placeholder="특이사항 메모"
              rows={3}
            />
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              className="btn btn-ghost flex-1"
              onClick={onClose}
            >
              취소
            </button>
            <button
              type="submit"
              className="btn btn-primary flex-1"
              disabled={saving}
            >
              {saving ? "등록 중..." : "입주 등록"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
