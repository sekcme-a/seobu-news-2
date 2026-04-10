"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function HistoryPage() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchHistory();
  }, []);

  async function fetchHistory() {
    setLoading(true);
    const { data } = await supabase
      .from("checkout_history")
      .select("*")
      .order("checkout_date", { ascending: false });
    setHistory(data || []);
    setLoading(false);
  }

  const filtered = history.filter(
    (h) =>
      h.name.includes(search) ||
      h.room_number.includes(search) ||
      (h.phone || "").includes(search),
  );

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: "var(--text)" }}>
            퇴실 기록
          </h1>
          <p className="text-sm mt-1" style={{ color: "var(--text-muted)" }}>
            전체 {history.length}건
          </p>
        </div>
        <input
          className="input"
          style={{ width: 240 }}
          placeholder="이름, 호수, 전화번호 검색"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="grid grid-cols-3 gap-4">
        {/* List */}
        <div className="col-span-1 flex flex-col gap-3">
          {loading ? (
            <div
              className="text-center py-12"
              style={{ color: "var(--text-muted)" }}
            >
              불러오는 중...
            </div>
          ) : filtered.length === 0 ? (
            <div
              className="card p-6 text-center"
              style={{ color: "var(--text-muted)" }}
            >
              퇴실 기록이 없습니다
            </div>
          ) : (
            filtered.map((h) => (
              <div
                key={h.id}
                className="card p-4 cursor-pointer transition-all"
                style={{
                  borderColor:
                    selected?.id === h.id ? "var(--accent)" : "var(--border)",
                  background:
                    selected?.id === h.id
                      ? "var(--accent-dim)"
                      : "var(--surface)",
                }}
                onClick={() => setSelected(h)}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <div
                      className="font-bold text-sm"
                      style={{ color: "var(--text)" }}
                    >
                      {h.name}
                    </div>
                    <div
                      className="font-mono text-xs mt-0.5"
                      style={{ color: "var(--accent)" }}
                    >
                      {h.room_number}호
                    </div>
                  </div>
                  <div className="text-right">
                    <div
                      className="text-xs"
                      style={{ color: "var(--text-muted)" }}
                    >
                      퇴실일
                    </div>
                    <div
                      className="text-xs font-mono"
                      style={{ color: "var(--text)" }}
                    >
                      {h.checkout_date}
                    </div>
                  </div>
                </div>
                <div
                  className="mt-2 text-xs"
                  style={{ color: "var(--text-muted)" }}
                >
                  {h.rent_start_date} ~ {h.checkout_date}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Detail */}
        <div className="col-span-2">
          {selected ? (
            <div className="card p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2
                    className="text-xl font-bold"
                    style={{ color: "var(--text)" }}
                  >
                    {selected.name}
                  </h2>
                  <div className="flex items-center gap-2 mt-1">
                    <span
                      className="font-mono font-bold"
                      style={{ color: "var(--accent)" }}
                    >
                      {selected.room_number}호
                    </span>
                    <span
                      className="text-sm"
                      style={{ color: "var(--text-muted)" }}
                    >
                      {selected.phone}
                    </span>
                  </div>
                </div>
                <span className="badge badge-blue">퇴실 완료</span>
              </div>

              <div className="grid grid-cols-2 gap-x-8 gap-y-3 text-sm">
                {[
                  { label: "입주일", value: selected.rent_start_date },
                  { label: "퇴실일", value: selected.checkout_date },
                  { label: "인원", value: `${selected.people_count}명` },
                  {
                    label: "월세",
                    value: `${selected.monthly_rent?.toLocaleString()}원`,
                  },
                  {
                    label: "보증금",
                    value: `${selected.deposit?.toLocaleString()}원`,
                  },
                  {
                    label: "반환 보증금",
                    value: `${selected.deposit_returned?.toLocaleString()}원`,
                  },
                  { label: "부동산", value: selected.agency_name || "—" },
                  {
                    label: "세금계산서",
                    value: selected.tax_invoice ? "발행" : "미발행",
                  },
                  {
                    label: "월세 납부일",
                    value: selected.rent_due_day
                      ? `매월 ${selected.rent_due_day}일`
                      : "—",
                  },
                  {
                    label: "전기세 납부일",
                    value: selected.electric_due_day
                      ? `매월 ${selected.electric_due_day}일`
                      : "—",
                  },
                  {
                    label: "전기세 계산서",
                    value: selected.electric_invoice ? "발행" : "미발행",
                  },
                ].map((row) => (
                  <div
                    key={row.label}
                    className="flex items-center justify-between"
                    style={{
                      borderBottom: "1px solid var(--border)",
                      paddingBottom: 8,
                    }}
                  >
                    <span style={{ color: "var(--text-muted)" }}>
                      {row.label}
                    </span>
                    <span
                      className="font-medium"
                      style={{ color: "var(--text)" }}
                    >
                      {row.value}
                    </span>
                  </div>
                ))}
              </div>

              {selected.memo && (
                <div
                  className="mt-4 rounded-lg p-3"
                  style={{ background: "var(--surface-2)" }}
                >
                  <div
                    className="text-xs mb-1 font-semibold uppercase tracking-wider"
                    style={{ color: "var(--text-muted)" }}
                  >
                    입주 메모
                  </div>
                  <div className="text-sm" style={{ color: "var(--text)" }}>
                    {selected.memo}
                  </div>
                </div>
              )}
              {selected.checkout_memo && (
                <div
                  className="mt-3 rounded-lg p-3"
                  style={{ background: "var(--surface-2)" }}
                >
                  <div
                    className="text-xs mb-1 font-semibold uppercase tracking-wider"
                    style={{ color: "var(--text-muted)" }}
                  >
                    퇴실 메모
                  </div>
                  <div className="text-sm" style={{ color: "var(--text)" }}>
                    {selected.checkout_memo}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div
              className="card p-6 flex flex-col items-center justify-center h-64"
              style={{ color: "var(--text-muted)" }}
            >
              <div className="text-4xl mb-3">📋</div>
              <div>목록에서 기록을 선택해주세요</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
