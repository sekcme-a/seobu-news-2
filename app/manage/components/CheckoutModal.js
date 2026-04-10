"use client";
import { useState } from "react";

export default function CheckoutModal({ tenant, onClose, onCheckout }) {
  const [form, setForm] = useState({
    checkout_date: new Date().toISOString().split("T")[0],
    deposit_returned: tenant?.deposit || 0,
    checkout_memo: "",
  });
  const [saving, setSaving] = useState(false);

  function handleChange(e) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!confirm(`${tenant.name}님을 퇴실 처리하시겠습니까?`)) return;
    setSaving(true);
    await onCheckout({
      ...form,
      deposit_returned: Number(form.deposit_returned),
    });
    setSaving(false);
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box" onClick={(e) => e.stopPropagation()}>
        <div
          className="p-6"
          style={{ borderBottom: "1px solid var(--border)" }}
        >
          <h2 className="text-lg font-bold" style={{ color: "var(--text)" }}>
            퇴실 처리
          </h2>
          <p className="text-sm mt-1" style={{ color: "var(--text-muted)" }}>
            {tenant?.room_number}호 — {tenant?.name}
          </p>
        </div>

        {/* Tenant summary */}
        <div className="px-6 pt-4">
          <div
            className="rounded-lg p-4 grid grid-cols-2 gap-2 text-sm"
            style={{ background: "var(--surface-2)" }}
          >
            <div>
              <span style={{ color: "var(--text-muted)" }}>입주일: </span>
              <span style={{ color: "var(--text)" }}>
                {tenant?.rent_start_date}
              </span>
            </div>
            <div>
              <span style={{ color: "var(--text-muted)" }}>월세: </span>
              <span style={{ color: "var(--text)" }}>
                {tenant?.monthly_rent?.toLocaleString()}원
              </span>
            </div>
            <div>
              <span style={{ color: "var(--text-muted)" }}>보증금: </span>
              <span style={{ color: "var(--text)" }}>
                {tenant?.deposit?.toLocaleString()}원
              </span>
            </div>
            <div>
              <span style={{ color: "var(--text-muted)" }}>전화: </span>
              <span style={{ color: "var(--text)" }}>{tenant?.phone}</span>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-4">
          <div>
            <label className="label">퇴실일 *</label>
            <input
              className="input"
              name="checkout_date"
              type="date"
              value={form.checkout_date}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label className="label">반환 보증금 (원)</label>
            <input
              className="input"
              name="deposit_returned"
              type="number"
              value={form.deposit_returned}
              onChange={handleChange}
            />
          </div>
          <div>
            <label className="label">퇴실 메모</label>
            <textarea
              className="input"
              name="checkout_memo"
              value={form.checkout_memo}
              onChange={handleChange}
              placeholder="퇴실 관련 특이사항"
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
              className="btn btn-danger flex-1"
              disabled={saving}
            >
              {saving ? "처리 중..." : "퇴실 처리"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
