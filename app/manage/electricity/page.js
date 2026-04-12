"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import {
  calcMonthlyUsage,
  calcElectricity,
  fmt,
  withDetail,
} from "./lib/electricityCalc";
import Link from "next/link";

// 세부 항목 표시 순서
const DETAIL_FIELDS = [
  "전력사용량(kWh)",
  "기본요금",
  "전력량요금",
  "기후환경요금",
  "연료비조정액",
  "공공전기요금",
  "전기요금계",
  "부가가치세",
  "전력기금",
  "TV수신료",
  "총금액(10원단위 절사)",
];

export default function ElectricityPage() {
  const [rooms, setRooms] = useState([]); // 현재 입주 방 목록
  const [settings, setSettings] = useState([]); // electricity_settings
  const [roomHistories, setRoomHistories] = useState({}); // 방별 kWh 기록
  const [selectedUsages, setSelectedUsages] = useState({}); // 방별 선택된 start/end
  const [roomUsage, setRoomUsage] = useState({}); // 방별 월별 kWh 결과

  // 다이얼로그
  const [openRoom, setOpenRoom] = useState(null);
  const [startUsage, setStartUsage] = useState(null);
  const [endUsage, setEndUsage] = useState(null);

  // 측정 추가 폼
  const [addKwh, setAddKwh] = useState("");
  const [addDate, setAddDate] = useState("");
  const [addingUsage, setAddingUsage] = useState(false);

  // 계산 결과
  const [results, setResults] = useState([]); // [{ room, result }]
  const [detailRows, setDetailRows] = useState([]); // 상세 테이블 rows

  // 저장
  const [saveTitle, setSaveTitle] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchRooms();
    fetchSettings();
  }, []);

  async function fetchRooms() {
    const { data } = await supabase
      .from("rooms")
      .select("room_number, is_occupied")
      .order("room_number");
    setRooms(data || []);
  }

  async function fetchSettings() {
    const { data } = await supabase
      .from("electricity_settings")
      .select("*")
      .order("month");
    setSettings(data || []);
  }

  async function openRoomDialog(room) {
    setOpenRoom(room);
    setStartUsage(null);
    setEndUsage(null);
    setAddKwh("");
    setAddDate("");

    if (!roomHistories[room]) {
      const { data } = await supabase
        .from("electricity_usages")
        .select("*")
        .eq("room", room)
        .order("used_at", { ascending: true });
      setRoomHistories((prev) => ({ ...prev, [room]: data || [] }));
    }
  }

  function handleSelectUsage(item) {
    let ns = startUsage,
      ne = endUsage;
    if (!ns) {
      ns = item;
    } else if (!ne) {
      ne = item;
    } else {
      ns = item;
      ne = null;
    }

    // 시간순 보정
    if (ns && ne && new Date(ns.used_at) > new Date(ne.used_at)) {
      [ns, ne] = [ne, ns];
    }

    setStartUsage(ns);
    setEndUsage(ne);

    if (ns && ne) {
      const monthly = calcMonthlyUsage(ns, ne, roomHistories[openRoom] || []);
      setRoomUsage((prev) => ({ ...prev, [openRoom]: monthly }));
      setSelectedUsages((prev) => ({
        ...prev,
        [openRoom]: { startUsage: ns, endUsage: ne },
      }));
    }
  }

  async function handleAddUsage() {
    if (!addKwh || !addDate) return;
    if (!/^\d{8}$/.test(addDate))
      return alert("날짜는 YYYYMMDD 형식으로 입력해주세요.");
    const formatted = `${addDate.slice(0, 4)}-${addDate.slice(4, 6)}-${addDate.slice(6, 8)}`;
    const kwhVal = parseFloat(addKwh);
    if (isNaN(kwhVal)) return alert("올바른 kWh 값을 입력해주세요.");

    setAddingUsage(true);
    const { data, error } = await supabase
      .from("electricity_usages")
      .insert([{ room: openRoom, kwh: kwhVal, used_at: new Date(formatted) }])
      .select();
    if (!error && data) {
      const updated = [...(roomHistories[openRoom] || []), ...data].sort(
        (a, b) => new Date(a.used_at) - new Date(b.used_at),
      );
      setRoomHistories((prev) => ({ ...prev, [openRoom]: updated }));
      setAddKwh("");
      setAddDate("");
    }
    setAddingUsage(false);
  }

  async function handleDeleteUsage(item) {
    if (!confirm("이 측정 기록을 삭제하시겠습니까?")) return;
    const { error } = await supabase
      .from("electricity_usages")
      .delete()
      .eq("id", item.id);
    if (!error) {
      const updated = (roomHistories[openRoom] || []).filter(
        (i) => i.id !== item.id,
      );
      setRoomHistories((prev) => ({ ...prev, [openRoom]: updated }));
      if (startUsage?.id === item.id) setStartUsage(null);
      if (endUsage?.id === item.id) setEndUsage(null);
    }
  }

  function handleCalculate() {
    if (Object.keys(selectedUsages).length === 0)
      return alert("방을 선택하고 측정 구간을 지정해주세요.");
    if (settings.length === 0)
      return alert(
        "요금 설정이 없습니다. 먼저 [요금 설정] 페이지에서 설정해주세요.",
      );

    const newResults = [];
    const detailMap = {};
    DETAIL_FIELDS.forEach((f) => {
      detailMap[f] = { id: f };
    });

    Object.entries(selectedUsages).forEach(
      ([room, { startUsage, endUsage }]) => {
        const monthly = calcMonthlyUsage(
          startUsage,
          endUsage,
          roomHistories[room] || [],
        );
        const r = calcElectricity(monthly, settings);

        newResults.push({ room, result: r, monthly });

        const { detail } = r;
        detailMap["전력사용량(kWh)"][room] = withDetail(
          r.totalKwh,
          detail.kwhArr,
        );
        detailMap["기본요금"][room] = fmt(r.basicPrice);
        detailMap["전력량요금"][room] = withDetail(r.energy, detail.energyArr);
        detailMap["기후환경요금"][room] = withDetail(r.gihu, detail.gihuArr);
        detailMap["연료비조정액"][room] = withDetail(r.fuel, detail.fuelArr);
        detailMap["공공전기요금"][room] = withDetail(
          r.gonggong,
          detail.gonggongArr,
        );
        detailMap["전기요금계"][room] = fmt(
          r.basicPrice + r.energy + r.gihu + r.fuel + r.gonggong,
        );
        detailMap["부가가치세"][room] = fmt(r.vat);
        detailMap["전력기금"][room] = withDetail(r.fund, detail.fundArr);
        detailMap["TV수신료"][room] = fmt(r.tv);
        detailMap["총금액(10원단위 절사)"][room] = fmt(r.finalTotal);
      },
    );

    setResults(newResults);
    setDetailRows(DETAIL_FIELDS.map((f) => detailMap[f]));
  }

  async function handleSave() {
    if (!saveTitle.trim()) return alert("제목을 입력해주세요.");
    if (results.length === 0) return alert("먼저 계산을 실행해주세요.");
    setSaving(true);

    const saveData = results.map(({ room, result }) => ({
      id: room,
      room,
      kwh: result.totalKwh,
      price: fmt(result.finalTotal),
    }));

    const { error } = await supabase.from("electricity_historys").insert({
      title: saveTitle.trim(),
      data: saveData,
      data_detail: detailRows,
    });

    if (error) alert("저장 실패: " + error.message);
    else {
      alert("저장되었습니다.");
      setSaveTitle("");
    }
    setSaving(false);
  }

  const roomsWithSelection = Object.keys(selectedUsages);

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold" style={{ color: "var(--text)" }}>
          ⚡ 전기세 계산
        </h1>
        <p className="text-sm mt-1" style={{ color: "var(--text-muted)" }}>
          삼천리 일반용(갑)저압 기준 — 방별 측정 구간 선택 후 계산
        </p>
      </div>

      {settings.length === 0 && (
        <div
          className="mb-6 rounded-lg p-4 text-sm"
          style={{
            background: "rgba(251,191,36,0.1)",
            border: "1px solid rgba(251,191,36,0.3)",
            color: "var(--yellow)",
          }}
        >
          ⚠️ 요금 설정이 없습니다. 먼저{" "}
          <Link
            href="/manage/electricity/settings"
            style={{ color: "var(--accent)", textDecoration: "underline" }}
          >
            요금 설정
          </Link>{" "}
          페이지에서 단가를 입력해주세요.
        </div>
      )}

      {/* Room grid */}
      <div className="mb-6">
        <div
          className="text-xs font-semibold uppercase tracking-wider mb-3"
          style={{ color: "var(--text-muted)" }}
        >
          방 선택 (클릭하여 측정 구간 지정)
        </div>
        <div className="grid grid-cols-4 gap-3">
          {rooms.map((room) => {
            const sel = selectedUsages[room.room_number];
            const monthly = roomUsage[room.room_number];
            const hasResult = results.find((r) => r.room === room.room_number);
            return (
              <div
                key={room.room_number}
                className="card p-4 cursor-pointer transition-all"
                style={{
                  borderColor: sel
                    ? "var(--accent)"
                    : hasResult
                      ? "var(--green)"
                      : "var(--border)",
                  background: sel ? "var(--accent-dim)" : "var(--surface)",
                }}
                onClick={() => openRoomDialog(room.room_number)}
              >
                <div className="flex items-center justify-between mb-1">
                  <span
                    className="font-mono font-bold text-lg"
                    style={{ color: sel ? "var(--accent)" : "var(--text)" }}
                  >
                    {room.room_number}호
                  </span>
                  {sel && (
                    <span className="badge badge-blue text-xs">선택됨</span>
                  )}
                </div>
                {monthly && (
                  <div
                    className="text-xs mt-1"
                    style={{ color: "var(--text-muted)" }}
                  >
                    {Object.entries(monthly)
                      .map(([m, u]) => `${m}월 ${fmt(u)}kWh`)
                      .join(" / ")}
                  </div>
                )}
                {hasResult && (
                  <div
                    className="text-xs mt-1 font-mono font-bold"
                    style={{ color: "var(--green)" }}
                  >
                    {fmt(hasResult.result.finalTotal)}원
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Calculate button */}
      <div className="flex gap-3 mb-8">
        <button
          className="btn btn-primary flex-1"
          style={{ padding: "12px", fontSize: 15 }}
          onClick={handleCalculate}
          disabled={roomsWithSelection.length === 0}
        >
          ⚡{" "}
          {roomsWithSelection.length > 0
            ? `선택된 ${roomsWithSelection.length}개 방 전기세 계산`
            : "방을 선택하세요"}
        </button>
        {results.length > 0 && (
          <button
            className="btn btn-ghost"
            onClick={() => {
              setResults([]);
              setDetailRows([]);
              setSelectedUsages({});
              setRoomUsage({});
            }}
          >
            초기화
          </button>
        )}
      </div>

      {/* Results */}
      {results.length > 0 && (
        <>
          {/* Summary cards */}
          <div className="grid grid-cols-4 gap-4 mb-6">
            {results.map(({ room, result }) => (
              <div key={room} className="card p-4">
                <div
                  className="font-mono font-bold text-lg mb-2"
                  style={{ color: "var(--accent)" }}
                >
                  {room}호
                </div>
                <div
                  className="text-2xl font-bold font-mono mb-1"
                  style={{ color: "var(--green)" }}
                >
                  {fmt(result.finalTotal)}원
                </div>
                <div className="text-xs" style={{ color: "var(--text-muted)" }}>
                  {fmt(result.totalKwh)} kWh
                </div>
                <div
                  className="text-xs mt-2"
                  style={{ color: "var(--text-muted)" }}
                >
                  {result.months.join(", ")}
                </div>
              </div>
            ))}
          </div>

          {/* Detail table */}
          <div className="card overflow-hidden mb-6">
            <div
              className="px-5 py-4"
              style={{ borderBottom: "1px solid var(--border)" }}
            >
              <div
                className="font-semibold text-sm"
                style={{ color: "var(--text)" }}
              >
                상세 요금 내역
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr
                    style={{
                      background: "var(--surface-2)",
                      borderBottom: "1px solid var(--border)",
                    }}
                  >
                    <th
                      className="text-left py-3 px-5 text-xs uppercase tracking-wider font-medium"
                      style={{ color: "var(--text-muted)", minWidth: 160 }}
                    >
                      항목
                    </th>
                    {results.map(({ room }) => (
                      <th
                        key={room}
                        className="text-right py-3 px-5 text-xs uppercase tracking-wider font-medium"
                        style={{ color: "var(--accent)", minWidth: 140 }}
                      >
                        {room}호
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {detailRows.map((row) => {
                    const isTotal = row.id === "총금액(10원단위 절사)";
                    const isSubtotal = row.id === "전기요금계";
                    return (
                      <tr
                        key={row.id}
                        style={{
                          borderBottom: "1px solid var(--border)",
                          background: isTotal
                            ? "rgba(108,142,255,0.12)"
                            : isSubtotal
                              ? "var(--surface-2)"
                              : "transparent",
                        }}
                      >
                        <td
                          className="py-3 px-5 font-medium"
                          style={{
                            color: isTotal
                              ? "var(--accent)"
                              : isSubtotal
                                ? "var(--text)"
                                : "var(--text-muted)",
                          }}
                        >
                          {row.id}
                        </td>
                        {results.map(({ room }) => (
                          <td
                            key={room}
                            className="py-3 px-5 text-right font-mono"
                            style={{
                              color: isTotal ? "var(--green)" : "var(--text)",
                              fontWeight: isTotal ? 700 : 400,
                            }}
                          >
                            {row[room] ?? "—"}
                          </td>
                        ))}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Save */}
          <div className="card p-5 flex gap-3 items-end">
            <div className="flex-1">
              <label className="label">저장 제목</label>
              <input
                className="input"
                value={saveTitle}
                onChange={(e) => setSaveTitle(e.target.value)}
                placeholder="예: 2026년 4월 전기세"
              />
            </div>
            <button
              className="btn btn-primary"
              style={{ padding: "10px 24px" }}
              onClick={handleSave}
              disabled={saving}
            >
              {saving ? "저장 중..." : "결과 저장"}
            </button>
          </div>
        </>
      )}

      {/* Room dialog */}
      {openRoom && (
        <div className="modal-overlay" onClick={() => setOpenRoom(null)}>
          <div
            className="modal-box"
            style={{ maxWidth: 560 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div
              className="p-6"
              style={{ borderBottom: "1px solid var(--border)" }}
            >
              <div className="flex items-center justify-between">
                <h2
                  className="text-lg font-bold"
                  style={{ color: "var(--text)" }}
                >
                  <span style={{ color: "var(--accent)" }}>{openRoom}호</span>{" "}
                  측정 기록
                </h2>
                <button
                  className="btn btn-ghost text-xs"
                  onClick={() => setOpenRoom(null)}
                >
                  닫기
                </button>
              </div>
              <p
                className="text-xs mt-1"
                style={{ color: "var(--text-muted)" }}
              >
                시작 → 종료 순서로 두 개를 선택하세요
              </p>
            </div>

            <div className="p-5 flex flex-col gap-4 max-h-[60vh] overflow-y-auto">
              {/* Usage list */}
              <div className="flex flex-col gap-2">
                {(roomHistories[openRoom] || []).length === 0 ? (
                  <div
                    className="text-center py-6 text-sm"
                    style={{ color: "var(--text-muted)" }}
                  >
                    측정 기록이 없습니다. 아래에서 추가하세요.
                  </div>
                ) : (
                  (roomHistories[openRoom] || []).map((item, i) => {
                    const isStart = startUsage?.id === item.id;
                    const isEnd = endUsage?.id === item.id;
                    const d = new Date(item.used_at);
                    const dateStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
                    return (
                      <div key={item.id} className="flex gap-2 items-center">
                        <div
                          className="flex-1 rounded-lg px-4 py-3 cursor-pointer transition-all flex items-center justify-between"
                          style={{
                            background:
                              isStart || isEnd
                                ? "var(--accent-dim)"
                                : "var(--surface-2)",
                            border: `1px solid ${isStart ? "var(--accent)" : isEnd ? "var(--green)" : "var(--border)"}`,
                          }}
                          onClick={() => handleSelectUsage(item)}
                        >
                          <div>
                            <span
                              className="text-sm"
                              style={{ color: "var(--text-muted)" }}
                            >
                              측정일:{" "}
                            </span>
                            <span
                              className="text-sm font-mono"
                              style={{ color: "var(--text)" }}
                            >
                              {dateStr}
                            </span>
                          </div>
                          <div className="flex items-center gap-3">
                            <span
                              className="font-mono font-bold"
                              style={{ color: "var(--text)" }}
                            >
                              누적 {fmt(item.kwh)} kWh
                            </span>
                            {isStart && (
                              <span className="badge badge-blue text-xs">
                                시작
                              </span>
                            )}
                            {isEnd && (
                              <span className="badge badge-green text-xs">
                                종료
                              </span>
                            )}
                          </div>
                        </div>
                        <button
                          className="btn btn-danger text-xs"
                          onClick={() => handleDeleteUsage(item)}
                        >
                          삭제
                        </button>
                      </div>
                    );
                  })
                )}
              </div>

              {/* 월별 미리보기 */}
              {startUsage && endUsage && roomUsage[openRoom] && (
                <div
                  className="rounded-lg p-4"
                  style={{
                    background: "var(--surface-2)",
                    border: "1px solid var(--border)",
                  }}
                >
                  <div
                    className="text-xs font-semibold uppercase tracking-wider mb-2"
                    style={{ color: "var(--text-muted)" }}
                  >
                    월별 사용량 미리보기
                  </div>
                  {Object.entries(roomUsage[openRoom]).map(([m, u]) => (
                    <div key={m} className="flex justify-between text-sm py-1">
                      <span style={{ color: "var(--text-muted)" }}>{m}월</span>
                      <span
                        className="font-mono"
                        style={{ color: "var(--text)" }}
                      >
                        {fmt(u)} kWh
                      </span>
                    </div>
                  ))}
                  <div
                    className="flex justify-between text-sm pt-2 font-bold"
                    style={{
                      borderTop: "1px solid var(--border)",
                      marginTop: 4,
                    }}
                  >
                    <span style={{ color: "var(--text)" }}>합계</span>
                    <span
                      className="font-mono"
                      style={{ color: "var(--accent)" }}
                    >
                      {fmt(
                        Object.values(roomUsage[openRoom]).reduce(
                          (s, v) => s + v,
                          0,
                        ),
                      )}{" "}
                      kWh
                    </span>
                  </div>
                </div>
              )}

              {/* Add usage form */}
              <div
                style={{ borderTop: "1px solid var(--border)", paddingTop: 16 }}
              >
                <div
                  className="text-xs font-semibold uppercase tracking-wider mb-3"
                  style={{ color: "var(--text-muted)" }}
                >
                  측정 추가
                </div>
                <div className="flex gap-2">
                  <div className="flex-1">
                    <input
                      className="input text-sm"
                      type="number"
                      step="0.1"
                      placeholder="누적 kWh"
                      value={addKwh}
                      onChange={(e) => setAddKwh(e.target.value)}
                    />
                  </div>
                  <div className="flex-1">
                    <input
                      className="input text-sm"
                      placeholder="측정일 YYYYMMDD"
                      value={addDate}
                      onChange={(e) => setAddDate(e.target.value)}
                      maxLength={8}
                    />
                  </div>
                  <button
                    className="btn btn-primary text-sm"
                    onClick={handleAddUsage}
                    disabled={!addKwh || !addDate || addingUsage}
                  >
                    {addingUsage ? "..." : "추가"}
                  </button>
                </div>
              </div>
            </div>

            <div
              className="p-5"
              style={{ borderTop: "1px solid var(--border)" }}
            >
              <button
                className="btn btn-primary w-full"
                onClick={() => setOpenRoom(null)}
                disabled={!startUsage || !endUsage}
              >
                {startUsage && endUsage
                  ? "선택 완료"
                  : "시작/종료 측정값을 선택하세요"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
