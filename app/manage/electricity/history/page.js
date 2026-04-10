'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'

export default function ElectricityHistoryPage() {
  const [history, setHistory] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => { fetchHistory() }, [])

  async function fetchHistory() {
    setLoading(true)
    const { data } = await supabase
      .from('electricity_historys')
      .select('id, title, created_at, data')
      .order('created_at', { ascending: false })
    setHistory(data || [])
    setLoading(false)
  }

  async function handleDelete(id, title) {
    if (!confirm(`"${title}" 기록을 삭제하시겠습니까?`)) return
    await supabase.from('electricity_historys').delete().eq('id', id)
    fetchHistory()
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: 'var(--text)' }}>⚡ 계산 기록</h1>
          <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>저장된 전기세 계산 결과</p>
        </div>
        <Link href="/electricity" className="btn btn-primary text-sm">
          + 새 계산
        </Link>
      </div>

      {loading ? (
        <div className="text-center py-20" style={{ color: 'var(--text-muted)' }}>불러오는 중...</div>
      ) : history.length === 0 ? (
        <div className="card p-12 text-center">
          <div className="text-4xl mb-3">⚡</div>
          <div style={{ color: 'var(--text-muted)' }}>저장된 계산 기록이 없습니다</div>
          <Link href="/electricity" className="btn btn-primary mt-4 inline-flex">전기세 계산하기</Link>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {history.map(item => {
            const rooms = item.data || []
            return (
              <div key={item.id} className="card p-5 flex items-center gap-4">
                <div className="flex-1">
                  <div className="font-semibold" style={{ color: 'var(--text)' }}>{item.title}</div>
                  <div className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>
                    {new Date(item.created_at).toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric' })}
                    {' · '}{rooms.length}개 방
                  </div>
                  {/* Room summary pills */}
                  <div className="flex gap-2 flex-wrap mt-2">
                    {rooms.map(r => (
                      <span key={r.room} className="badge badge-blue text-xs">
                        {r.room}호 {r.price}원
                      </span>
                    ))}
                  </div>
                </div>
                <div className="flex gap-2">
                  <Link href={`/electricity/history/${item.id}`} className="btn btn-ghost text-sm">상세 보기</Link>
                  <button className="btn btn-danger text-sm" onClick={() => handleDelete(item.id, item.title)}>삭제</button>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
