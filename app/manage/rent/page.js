"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function RentPage() {
  // 오늘 날짜 — 컴포넌트 수명 동안 고정
  const today = new Date();
  const todayYear = today.getFullYear();
  const todayMonth = today.getMonth() + 1;
  const todayDay = today.getDate();
  const currentYearMonth = todayYear * 100 + todayMonth;

  const [year, setYear] = useState(todayYear);
  const [month, setMonth] = useState(todayMonth);
  const [payments, setPayments] = useState([]);
  const [tenants, setTenants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  // 수동 추가 모달
  const [showAddModal, setShowAddModal] = useState(false);
  const [addTenantId, setAddTenantId] = useState("");
  const [addAmount, setAddAmount] = useState("");
  const [addMemo, setAddMemo] = useState("");

  useEffect(() => {
    fetchData();
  }, [year, month]);

  async function fetchData() {
    setLoading(true);
    const [{ data: tData }, { data: pData }] = await Promise.all([
      supabase
        .from("tenants")
        .select("*")
        .eq("is_active", true)
        .order("room_number"),
      supabase
        .from("rent_payments")
        .select("*")
        .eq("payment_year", year)
        .eq("payment_month", month)
        .eq("payment_type", "rent"),
    ]);

    const allTenants = tData || [];
    const allPayments = pData || [];
    setTenants(allTenants);

    const selectedYearMonth = year * 100 + month;

    // 이미 레코드가 있는 tenant_id (수동삭제 포함 전부)
    const existingTenantIds = new Set(allPayments.map((p) => p.tenant_id));

    // 자동 생성 대상 필터
    const toAutoCreate = allTenants.filter((t) => {
      // 이미 레코드 있으면 스킵 (수동삭제된 것도 existingTenantIds에 포함 → 재생성 방지)
      if (existingTenantIds.has(t.id)) return false;
      if (!t.rent_start_date || !t.rent_due_day) return false;

      // 조건 1: 미래 달 생성 안 함
      if (selectedYearMonth > currentYearMonth) return false;

      // 조건 2: 입주 당월 포함 그 이전은 생성 안 함
      //   (첫 payment는 입주 다음 달부터)
      const start = new Date(t.rent_start_date);
      const startYearMonth = start.getFullYear() * 100 + (start.getMonth() + 1);
      if (selectedYearMonth <= startYearMonth) return false;

      // 조건 3: 현재 달이면 오늘이 rent_due_day 이상이어야 생성
      //   (todayDay >= rent_due_day 일 때만)
      if (selectedYearMonth === currentYearMonth && todayDay < t.rent_due_day)
        return false;

      return true;
    });

    if (toAutoCreate.length > 0) {
      const inserts = toAutoCreate.map((t) => ({
        tenant_id: t.id,
        room_number: t.room_number,
        tenant_name: t.name,
        payment_year: year,
        payment_month: month,
        amount: t.monthly_rent,
        is_paid: false,
        is_manually_deleted: false,
        payment_type: "rent",
      }));
      await supabase.from("rent_payments").insert(inserts);
      const { data: refreshed } = await supabase
        .from("rent_payments")
        .select("*")
        .eq("payment_year", year)
        .eq("payment_month", month)
        .eq("payment_type", "rent");
      setPayments((refreshed || []).filter((p) => !p.is_manually_deleted));
    } else {
      setPayments(allPayments.filter((p) => !p.is_manually_deleted));
    }
    setLoading(false);
  }

  async function togglePaid(payment) {
    const todayStr = today.toISOString().split("T")[0];
    const updates = payment.is_paid
      ? { is_paid: false, paid_at: null }
      : { is_paid: true, paid_at: todayStr };
    await supabase.from("rent_payments").update(updates).eq("id", payment.id);
    fetchData();
  }

  async function updateMemo(id, memo) {
    await supabase.from("rent_payments").update({ memo }).eq("id", id);
  }

  // 수동 삭제: 실제 DELETE 대신 is_manually_deleted=true 플래그 → 자동 재생성 방지
  async function handleDelete(payment) {
    if (
      !confirm(
        `${payment.tenant_name}님의 ${year}년 ${month}월 월세 항목을 삭제하시겠습니까?\n삭제 후에는 이 달에 자동으로 재생성되지 않습니다.`,
      )
    )
      return;
    await supabase
      .from("rent_payments")
      .update({ is_manually_deleted: true })
      .eq("id", payment.id);
    fetchData();
  }

  // 수동 추가
  async function handleManualAdd(e) {
    e.preventDefault();
    const tenant = tenants.find((t) => t.id === addTenantId);
    if (!tenant) return alert("입주자를 선택해주세요.");

    // 수동삭제된 레코드 포함해서 확인
    const { data: existing } = await supabase
      .from("rent_payments")
      .select("id, is_manually_deleted")
      .eq("tenant_id", addTenantId)
      .eq("payment_year", year)
      .eq("payment_month", month)
      .eq("payment_type", "rent")
      .maybeSingle();

    if (existing) {
      if (existing.is_manually_deleted) {
        // 수동삭제 레코드 복구
        await supabase
          .from("rent_payments")
          .update({
            is_manually_deleted: false,
            amount: Number(addAmount) || tenant.monthly_rent,
            memo: addMemo || null,
            is_paid: false,
            paid_at: null,
          })
          .eq("id", existing.id);
      } else {
        alert("이미 이 달 payment가 존재합니다.");
        return;
      }
    } else {
      await supabase.from("rent_payments").insert({
        tenant_id: tenant.id,
        room_number: tenant.room_number,
        tenant_name: tenant.name,
        payment_year: year,
        payment_month: month,
        amount: Number(addAmount) || tenant.monthly_rent,
        is_paid: false,
        is_manually_deleted: false,
        payment_type: "rent",
        memo: addMemo || null,
      });
    }

    setShowAddModal(false);
    setAddTenantId("");
    setAddAmount("");
    setAddMemo("");
    fetchData();
  }

  function handleSelectTenant(id) {
    setAddTenantId(id);
    const t = tenants.find((t) => t.id === id);
    if (t) setAddAmount(String(t.monthly_rent));
  }

  const selectedYearMonth = year * 100 + month;

  const filtered = payments.filter((p) => {
    if (filter === "paid") return p.is_paid;
    if (filter === "unpaid") return !p.is_paid;
    return true;
  });

  const totalAmount = payments.reduce((s, p) => s + (p.amount || 0), 0);
  const paidAmount = payments
    .filter((p) => p.is_paid)
    .reduce((s, p) => s + (p.amount || 0), 0);
  const unpaidAmount = totalAmount - paidAmount;

  const months = Array.from({ length: 12 }, (_, i) => i + 1);
  const years = [todayYear - 1, todayYear, todayYear + 1];

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: "var(--text)" }}>
            월세 관리
          </h1>
          <p className="text-sm mt-1" style={{ color: "var(--text-muted)" }}>
            월별 납부 현황 관리
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            className="btn btn-primary text-sm"
            onClick={() => setShowAddModal(true)}
          >
            + payment 추가
          </button>
          <select
            className="input"
            style={{ width: 90 }}
            value={year}
            onChange={(e) => setYear(Number(e.target.value))}
          >
            {years.map((y) => (
              <option key={y} value={y}>
                {y}년
              </option>
            ))}
          </select>
          <select
            className="input"
            style={{ width: 80 }}
            value={month}
            onChange={(e) => setMonth(Number(e.target.value))}
          >
            {months.map((m) => (
              <option key={m} value={m}>
                {m}월
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="card p-4">
          <div
            className="text-xs uppercase tracking-wider mb-2"
            style={{ color: "var(--text-muted)" }}
          >
            총 월세
          </div>
          <div
            className="text-2xl font-bold font-mono"
            style={{ color: "var(--text)" }}
          >
            {totalAmount.toLocaleString()}원
          </div>
        </div>
        <div className="card p-4">
          <div
            className="text-xs uppercase tracking-wider mb-2"
            style={{ color: "var(--text-muted)" }}
          >
            납부 완료
          </div>
          <div
            className="text-2xl font-bold font-mono"
            style={{ color: "var(--green)" }}
          >
            {paidAmount.toLocaleString()}원
          </div>
          <div className="text-xs mt-1" style={{ color: "var(--text-muted)" }}>
            {payments.filter((p) => p.is_paid).length}명
          </div>
        </div>
        <div className="card p-4">
          <div
            className="text-xs uppercase tracking-wider mb-2"
            style={{ color: "var(--text-muted)" }}
          >
            미납
          </div>
          <div
            className="text-2xl font-bold font-mono"
            style={{ color: "var(--red)" }}
          >
            {unpaidAmount.toLocaleString()}원
          </div>
          <div className="text-xs mt-1" style={{ color: "var(--text-muted)" }}>
            {payments.filter((p) => !p.is_paid).length}명
          </div>
        </div>
      </div>

      {/* Progress bar */}
      {totalAmount > 0 && (
        <div className="card p-4 mb-6">
          <div
            className="flex items-center justify-between text-xs mb-2"
            style={{ color: "var(--text-muted)" }}
          >
            <span>납부율</span>
            <span>{Math.round((paidAmount / totalAmount) * 100)}%</span>
          </div>
          <div
            className="h-2 rounded-full overflow-hidden"
            style={{ background: "var(--surface-2)" }}
          >
            <div
              className="h-full rounded-full transition-all"
              style={{
                width: `${(paidAmount / totalAmount) * 100}%`,
                background: "var(--green)",
              }}
            />
          </div>
        </div>
      )}

      {/* Filter tabs */}
      <div className="flex gap-2 mb-4">
        {[
          ["all", "전체"],
          ["unpaid", "미납"],
          ["paid", "납부완료"],
        ].map(([key, label]) => (
          <button
            key={key}
            className="btn text-xs"
            style={{
              background: filter === key ? "var(--accent-dim)" : "transparent",
              color: filter === key ? "var(--accent)" : "var(--text-muted)",
              border: `1px solid ${filter === key ? "var(--accent)" : "var(--border)"}`,
            }}
            onClick={() => setFilter(key)}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Payment list */}
      {loading ? (
        <div
          className="text-center py-20"
          style={{ color: "var(--text-muted)" }}
        >
          불러오는 중...
        </div>
      ) : (
        <div className="card overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr
                style={{
                  borderBottom: "1px solid var(--border)",
                  background: "var(--surface-2)",
                }}
              >
                {[
                  "호수",
                  "성함",
                  "금액",
                  "납부기한",
                  "납부일",
                  "상태",
                  "메모",
                  "",
                ].map((h) => (
                  <th
                    key={h}
                    className="text-left py-3 px-4 text-xs uppercase tracking-wider font-medium"
                    style={{ color: "var(--text-muted)" }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((p) => {
                const tenant = tenants.find((t) => t.id === p.tenant_id);
                const dueDay = tenant?.rent_due_day;
                const isPastMonth = selectedYearMonth < currentYearMonth;
                const isCurrentMonth = selectedYearMonth === currentYearMonth;
                const isLate =
                  !p.is_paid &&
                  dueDay &&
                  (isPastMonth || (isCurrentMonth && todayDay > dueDay));
                return (
                  <tr
                    key={p.id}
                    style={{ borderBottom: "1px solid var(--border)" }}
                  >
                    <td
                      className="py-3 px-4 font-mono font-bold"
                      style={{ color: "var(--accent)" }}
                    >
                      {p.room_number}
                    </td>
                    <td
                      className="py-3 px-4 font-semibold"
                      style={{ color: "var(--text)" }}
                    >
                      {p.tenant_name}
                    </td>
                    <td
                      className="py-3 px-4 font-mono"
                      style={{ color: "var(--text)" }}
                    >
                      {p.amount?.toLocaleString()}원
                    </td>
                    <td
                      className="py-3 px-4"
                      style={{
                        color: isLate ? "var(--red)" : "var(--text-muted)",
                      }}
                    >
                      {dueDay ? `매월 ${dueDay}일` : "—"}
                      {isLate && <span className="ml-1 text-xs">(연체)</span>}
                    </td>
                    <td
                      className="py-3 px-4 text-xs"
                      style={{ color: "var(--text-muted)" }}
                    >
                      {p.paid_at || "—"}
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`badge ${p.is_paid ? "badge-green" : isLate ? "badge-red" : "badge-yellow"}`}
                      >
                        {p.is_paid ? "납부완료" : isLate ? "연체" : "미납"}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <input
                        className="input text-xs"
                        style={{ padding: "4px 8px", width: 140 }}
                        defaultValue={p.memo || ""}
                        placeholder="메모"
                        onBlur={(e) => updateMemo(p.id, e.target.value)}
                      />
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex gap-2">
                        <button
                          className={`btn text-xs ${p.is_paid ? "btn-ghost" : "btn-success"}`}
                          onClick={() => togglePaid(p)}
                        >
                          {p.is_paid ? "납부취소" : "납부확인"}
                        </button>
                        <button
                          className="btn btn-danger text-xs"
                          onClick={() => handleDelete(p)}
                        >
                          삭제
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <div
              className="text-center py-12"
              style={{ color: "var(--text-muted)" }}
            >
              해당하는 항목이 없습니다
            </div>
          )}
        </div>
      )}

      {/* 수동 추가 모달 */}
      {showAddModal && (
        <div className="modal-overlay" onClick={() => setShowAddModal(false)}>
          <div className="modal-box" onClick={(e) => e.stopPropagation()}>
            <div
              className="p-6"
              style={{ borderBottom: "1px solid var(--border)" }}
            >
              <h2
                className="text-lg font-bold"
                style={{ color: "var(--text)" }}
              >
                payment 수동 추가
              </h2>
              <p
                className="text-sm mt-1"
                style={{ color: "var(--text-muted)" }}
              >
                {year}년 {month}월
              </p>
            </div>
            <form
              onSubmit={handleManualAdd}
              className="p-6 flex flex-col gap-4"
            >
              <div>
                <label className="label">입주자 선택 *</label>
                <select
                  className="input"
                  value={addTenantId}
                  onChange={(e) => handleSelectTenant(e.target.value)}
                  required
                >
                  <option value="">-- 선택 --</option>
                  {tenants.map((t) => {
                    const hasPayment = payments.find(
                      (p) => p.tenant_id === t.id,
                    );
                    return (
                      <option key={t.id} value={t.id}>
                        {t.room_number}호 — {t.name}
                        {hasPayment ? " (이미 존재)" : ""}
                      </option>
                    );
                  })}
                </select>
              </div>
              <div>
                <label className="label">금액 (원) *</label>
                <input
                  className="input"
                  type="number"
                  value={addAmount}
                  onChange={(e) => setAddAmount(e.target.value)}
                  placeholder="월세 금액"
                  required
                />
              </div>
              <div>
                <label className="label">메모</label>
                <input
                  className="input"
                  value={addMemo}
                  onChange={(e) => setAddMemo(e.target.value)}
                  placeholder="메모 (선택)"
                />
              </div>
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  className="btn btn-ghost flex-1"
                  onClick={() => setShowAddModal(false)}
                >
                  취소
                </button>
                <button type="submit" className="btn btn-primary flex-1">
                  추가
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
