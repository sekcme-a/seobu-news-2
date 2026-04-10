"use client";
import { useState, useEffect } from "react";

export default function RoomModal({ room, onClose, onSave }) {
  const [form, setForm] = useState({
    room_number: "",
    floor: "",
    area: "",
    memo: "",
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (room) {
      setForm({
        room_number: room.room_number || "",
        floor: room.floor || "",
        area: room.area || "",
        memo: room.memo || "",
      });
    }
  }, [room]);

  function handleChange(e) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!form.room_number) return alert("호수를 입력해주세요.");
    setSaving(true);
    await onSave(form);
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
            {room ? "방 편집" : "방 추가"}
          </h2>
        </div>
        <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-4">
          <div>
            <label className="label">호수 *</label>
            <input
              className="input"
              name="room_number"
              value={form.room_number}
              onChange={handleChange}
              placeholder="예: 101, 202, 옥탑"
              required
              disabled={!!room}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">층수</label>
              <input
                className="input"
                name="floor"
                type="number"
                value={form.floor}
                onChange={handleChange}
                placeholder="예: 1"
              />
            </div>
            <div>
              <label className="label">면적 (㎡)</label>
              <input
                className="input"
                name="area"
                type="number"
                step="0.1"
                value={form.area}
                onChange={handleChange}
                placeholder="예: 33.0"
              />
            </div>
          </div>
          <div>
            <label className="label">메모</label>
            <textarea
              className="input"
              name="memo"
              value={form.memo}
              onChange={handleChange}
              placeholder="방에 대한 특이사항"
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
              {saving ? "저장 중..." : "저장"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
