'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

const DEFAULT_MONTHS = Array.from({ length: 12 }, (_, i) => ({
  month: i + 1,
  basic_price: 0,
  price_per_kwh: 0,
  gihu: 0,
  fuel: 0,
  fund: 0,
  gonggong: 0,
  tv: 0,
}))

const FIELDS = [
  { key: 'price_per_kwh', label: 'kWh당 요금', hint: '삼천리 일반용(갑)저압 저압전력' },
  { key: 'gihu',          label: '기후환경요금', hint: 'kWh당 / 삼천리 기후환경요금 검색' },
  { key: 'fuel',          label: '연료비조정액', hint: 'kWh당 / 삼천리 공지사항 > 연료비조정단가' },
  { key: 'fund',          label: '전력기금 (%)', hint: '전력기금 요율 검색' },
  { key: 'gonggong',      label: '공공전기요금 (%)', hint: '전기요금계에 % 적용' },
]

export default function ElectricitySettingsPage() {
  const [list, setList] = useState(DEFAULT_MONTHS)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  // 기본요금·TV는 1월 설정값을 전체에 적용
  const [basicPrice, setBasicPrice] = useState('')
  const [tv, setTv] = useState('')

  useEffect(() => { fetchData() }, [])

  async function fetchData() {
    const { data } = await supabase.from('electricity_settings').select('*').order('month')
    if (data && data.length > 0) {
      setList(data)
      setBasicPrice(data[0]?.basic_price ?? '')
      setTv(data[0]?.tv ?? '')
    }
  }

  function handleChange(index, field, value) {
    setList(prev => {
      const next = [...prev]
      next[index] = { ...next[index], [field]: value === '' ? 0 : Number(value) }
      return next
    })
  }

  // 1월 값을 전체 달에 복사하는 편의 기능
  function copyToAll(field) {
    const val = list[0][field]
    setList(prev => prev.map(item => ({ ...item, [field]: val })))
  }

  async function handleSave() {
    setSaving(true)
    const payload = list.map(item => ({
      month: item.month,
      basic_price: Number(basicPrice) || 0,
      price_per_kwh: item.price_per_kwh || 0,
      gihu: item.gihu || 0,
      fuel: item.fuel || 0,
      fund: item.fund || 0,
      gonggong: item.gonggong || 0,
      tv: Number(tv) || 0,
    }))

    const { error } = await supabase.from('electricity_settings').upsert(payload, { onConflict: 'month' })
    if (error) alert('저장 실패: ' + error.message)
    else {
      setSaved(true)
      setTimeout(() => setSaved(false), 2000)
      fetchData()
    }
    setSaving(false)
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold" style={{ color: 'var(--text)' }}>⚡ 전기세 요금 설정</h1>
        <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>삼천리 일반용(갑)저압 기준 월별 단가 설정</p>
      </div>

      {/* 참고 안내 */}
      <div className="card p-5 mb-6 text-sm" style={{ borderColor: 'rgba(108,142,255,0.3)' }}>
        <div className="font-semibold mb-3" style={{ color: 'var(--accent)' }}>📌 단가 조회 방법</div>
        <div className="flex flex-col gap-1.5" style={{ color: 'var(--text-muted)' }}>
          <div>• <strong style={{ color: 'var(--text)' }}>kWh당 요금</strong>: 구글 "삼천리 일반용(갑)저압" → 저압전력 요금표 (한전 직접 문의 권장)</div>
          <div>• <strong style={{ color: 'var(--text)' }}>기후환경요금</strong>: 구글 "삼천리 기후환경요금" → 페이지 하단 확인</div>
          <div>• <strong style={{ color: 'var(--text)' }}>연료비조정액</strong>: 구글 "삼천리 공지사항" → "N분기 전기요금 연료비조정단가 산정내역" → 최종 연료비조정단가</div>
          <div>• <strong style={{ color: 'var(--text)' }}>전력기금</strong>: 구글 "전력기금 요율" → 기사/블로그 확인</div>
          <div>• <strong style={{ color: 'var(--text)' }}>공공전기요금</strong>: 전기요금계에 % 적용 (보통 3.7%)</div>
        </div>
      </div>

      {/* 기본요금 · TV수신료 (전체 공통) */}
      <div className="card p-5 mb-6">
        <div className="font-semibold mb-1" style={{ color: 'var(--text)' }}>공통 항목 <span className="text-xs font-normal" style={{ color: 'var(--text-muted)' }}>(월 1회 고정, 전체 달에 동일 적용)</span></div>
        <div className="grid grid-cols-2 gap-4 mt-4">
          <div>
            <label className="label">기본요금 (원)</label>
            <input
              className="input"
              type="number"
              value={basicPrice}
              onChange={e => setBasicPrice(e.target.value)}
              placeholder="예: 730"
            />
          </div>
          <div>
            <label className="label">TV 수신료 (원)</label>
            <input
              className="input"
              type="number"
              value={tv}
              onChange={e => setTv(e.target.value)}
              placeholder="예: 2500"
            />
          </div>
        </div>
      </div>

      {/* 월별 설정 */}
      <div className="card overflow-hidden mb-6">
        <div className="px-5 py-4 flex items-center justify-between" style={{ borderBottom: '1px solid var(--border)' }}>
          <div className="font-semibold text-sm" style={{ color: 'var(--text)' }}>월별 단가 설정</div>
          <div className="text-xs" style={{ color: 'var(--text-muted)' }}>
            1월 값 입력 후 "전체 적용" 클릭 시 모든 달에 복사됩니다
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr style={{ background: 'var(--surface-2)', borderBottom: '1px solid var(--border)' }}>
                <th className="text-left py-3 px-4 text-xs uppercase tracking-wider font-medium" style={{ color: 'var(--text-muted)', width: 60 }}>월</th>
                {FIELDS.map(f => (
                  <th key={f.key} className="text-left py-3 px-3 text-xs uppercase tracking-wider font-medium" style={{ color: 'var(--text-muted)', minWidth: 140 }}>
                    <div>{f.label}</div>
                    <button
                      className="mt-1 text-xs normal-case tracking-normal"
                      style={{ color: 'var(--accent)', fontWeight: 400 }}
                      onClick={() => copyToAll(f.key)}
                      type="button"
                    >
                      1월→전체 적용
                    </button>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {list.map((item, idx) => (
                <tr
                  key={item.month}
                  style={{
                    borderBottom: '1px solid var(--border)',
                    background: idx % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.01)',
                  }}
                >
                  <td className="py-2 px-4 font-mono font-bold" style={{ color: 'var(--accent)' }}>
                    {item.month}월
                  </td>
                  {FIELDS.map(f => (
                    <td key={f.key} className="py-2 px-3">
                      <input
                        className="input text-sm font-mono"
                        style={{ padding: '6px 10px' }}
                        type="number"
                        step="0.01"
                        value={item[f.key] || ''}
                        onChange={e => handleChange(idx, f.key, e.target.value)}
                        placeholder="0"
                      />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Save button */}
      <button
        className="btn btn-primary w-full"
        style={{ padding: '14px', fontSize: 15 }}
        onClick={handleSave}
        disabled={saving}
      >
        {saved ? '✓ 저장 완료!' : saving ? '저장 중...' : '설정 저장'}
      </button>
    </div>
  )
}
