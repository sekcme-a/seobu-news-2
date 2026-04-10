'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useParams, useRouter } from 'next/navigation'

const HIGHLIGHT_TOTAL = '총금액(10원단위 절사)'
const HIGHLIGHT_SUB   = '전기요금계'

export default function ElectricityHistoryDetailPage() {
  const { id } = useParams()
  const router = useRouter()
  const [record, setRecord] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => { fetchDetail() }, [id])

  async function fetchDetail() {
    setLoading(true)
    const { data } = await supabase
      .from('electricity_historys')
      .select('*')
      .eq('id', id)
      .single()
    setRecord(data)
    setLoading(false)
  }

  if (loading) return <div className="text-center py-20" style={{ color: 'var(--text-muted)' }}>불러오는 중...</div>
  if (!record) return <div className="text-center py-20" style={{ color: 'var(--red)' }}>기록을 찾을 수 없습니다.</div>

  const summaryRows = record.data || []
  const detailRows  = record.data_detail || []
  // 방 컬럼: id 제외
  const roomCols = detailRows.length > 0
    ? Object.keys(detailRows[0]).filter(k => k !== 'id')
    : []

  return (
    <div>
      <div className="flex items-center gap-4 mb-8">
        <button className="btn btn-ghost text-sm" onClick={() => router.back()}>← 뒤로</button>
        <div>
          <h1 className="text-2xl font-bold" style={{ color: 'var(--text)' }}>{record.title}</h1>
          <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>
            {new Date(record.created_at).toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
          </p>
        </div>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        {summaryRows.map(r => (
          <div key={r.room} className="card p-4">
            <div className="font-mono font-bold text-lg mb-1" style={{ color: 'var(--accent)' }}>{r.room}호</div>
            <div className="text-2xl font-bold font-mono" style={{ color: 'var(--green)' }}>{r.price}원</div>
            <div className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>{r.kwh} kWh</div>
          </div>
        ))}
      </div>

      {/* Total */}
      <div className="card p-4 mb-6 flex items-center justify-between">
        <span className="font-semibold" style={{ color: 'var(--text)' }}>전체 합계</span>
        <span className="font-mono text-2xl font-bold" style={{ color: 'var(--accent)' }}>
          {summaryRows
            .reduce((s, r) => s + Number((r.price || '').replace(/,/g, '')), 0)
            .toLocaleString()}원
        </span>
      </div>

      {/* Detail table */}
      {detailRows.length > 0 && (
        <div className="card overflow-hidden">
          <div className="px-5 py-4" style={{ borderBottom: '1px solid var(--border)' }}>
            <div className="font-semibold text-sm" style={{ color: 'var(--text)' }}>상세 요금 내역</div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr style={{ background: 'var(--surface-2)', borderBottom: '1px solid var(--border)' }}>
                  <th className="text-left py-3 px-5 text-xs uppercase tracking-wider font-medium" style={{ color: 'var(--text-muted)', minWidth: 160 }}>항목</th>
                  {roomCols.map(col => (
                    <th key={col} className="text-right py-3 px-5 text-xs uppercase tracking-wider font-medium" style={{ color: 'var(--accent)', minWidth: 140 }}>
                      {col}호
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {detailRows.map(row => {
                  const isTotal   = row.id === HIGHLIGHT_TOTAL
                  const isSubtotal = row.id === HIGHLIGHT_SUB
                  return (
                    <tr
                      key={row.id}
                      style={{
                        borderBottom: '1px solid var(--border)',
                        background: isTotal
                          ? 'rgba(108,142,255,0.12)'
                          : isSubtotal
                          ? 'var(--surface-2)'
                          : 'transparent',
                      }}
                    >
                      <td
                        className="py-3 px-5 font-medium"
                        style={{ color: isTotal ? 'var(--accent)' : isSubtotal ? 'var(--text)' : 'var(--text-muted)' }}
                      >
                        {row.id}
                      </td>
                      {roomCols.map(col => (
                        <td
                          key={col}
                          className="py-3 px-5 text-right font-mono"
                          style={{ color: isTotal ? 'var(--green)' : 'var(--text)', fontWeight: isTotal ? 700 : 400 }}
                        >
                          {row[col] ?? '—'}
                        </td>
                      ))}
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
