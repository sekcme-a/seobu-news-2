/**
 * 전기세 계산 로직
 * 삼천리 일반용(갑)저압 기준
 *
 * 기본요금 · TV수신료: 전체에서 1번만 적용
 * 전력량요금 · 기후환경요금 · 연료비조정액 · 공공전기요금 · 전력기금 · 부가가치세: 월별 누적
 * 최종금액: 10원 단위 절사
 */

export function fmt(num) {
  return new Intl.NumberFormat('ko-KR').format(Math.round(num))
}

/**
 * 두 측정 기록 사이의 월별 사용량을 계산합니다.
 * @param {object} start - 시작 측정 기록 { id, kwh, used_at }
 * @param {object} end   - 종료 측정 기록 { id, kwh, used_at }
 * @param {object[]} allHistory - 해당 방의 전체 측정 기록 배열
 * @returns {{ [month: number]: number }} 월 → kWh 사용량 맵
 */
export function calcMonthlyUsage(start, end, allHistory) {
  const filtered = allHistory
    .filter(
      item =>
        new Date(item.used_at) >= new Date(start.used_at) &&
        new Date(item.used_at) <= new Date(end.used_at)
    )
    .sort((a, b) => new Date(a.used_at) - new Date(b.used_at))

  const records = [
    start,
    ...filtered.filter(f => f.id !== start.id && f.id !== end.id),
    end,
  ]

  const monthlyUsage = {}

  for (let i = 0; i < records.length - 1; i++) {
    const cur = records[i]
    const nxt = records[i + 1]
    const used = nxt.kwh - cur.kwh

    const curDate = new Date(cur.used_at)
    const nxtDate = new Date(nxt.used_at)

    let month
    if (nxtDate.getDate() === 1) {
      // next가 1일 → 이전 달 사용량
      month = curDate.getMonth() + 1
    } else if (curDate.getDate() === 1) {
      // current가 1일 → 해당 달 사용량
      month = curDate.getMonth() + 1
    } else {
      // 일반 구간 → next 달
      month = nxtDate.getMonth() + 1
    }

    monthlyUsage[month] = (monthlyUsage[month] || 0) + used
  }

  return monthlyUsage
}

/**
 * 월별 사용량 + 설정값으로 전기세를 계산합니다.
 * @param {{ [month: number]: number }} monthlyUsage
 * @param {object[]} settings - electricity_settings 레코드 배열
 * @returns {object} 계산 결과 상세
 */
export function calcElectricity(monthlyUsage, settings) {
  let energy = 0, gihu = 0, fuel = 0, gonggong = 0, fund = 0, totalKwh = 0
  let basicPrice = 0, tv = 0

  const detail = {
    kwhArr: [], energyArr: [], gihuArr: [], fuelArr: [],
    gonggongArr: [], vatArr: [], fundArr: [], totalBeforeTaxArr: [],
    monthlyTotals: [],
  }

  const months = Object.entries(monthlyUsage).sort(([a], [b]) => Number(a) - Number(b))

  months.forEach(([monthStr, kwhUsed], idx) => {
    const month = parseInt(monthStr)
    const s = settings.find(s => s.month === month)
    if (!s) return

    const en = Math.floor(kwhUsed * s.price_per_kwh)
    const gi = Math.floor(kwhUsed * s.gihu)
    const fu = Math.floor(kwhUsed * s.fuel)
    const subtotal = en + gi + fu
    const gg = Math.floor(subtotal * (s.gonggong / 100))
    const fu2 = Math.floor(subtotal * (s.fund / 100))

    const beforeTax = en + gi + fu + gg
    const vat = Math.floor(beforeTax * 0.1)
    const monthTotal = Math.floor(beforeTax + vat + fu2)

    detail.kwhArr.push(fmt(kwhUsed))
    detail.energyArr.push(fmt(en))
    detail.gihuArr.push(fmt(gi))
    detail.fuelArr.push(fmt(fu))
    detail.gonggongArr.push(fmt(gg))
    detail.vatArr.push(fmt(vat))
    detail.fundArr.push(fmt(fu2))
    detail.totalBeforeTaxArr.push(fmt(beforeTax))
    detail.monthlyTotals.push(fmt(monthTotal))

    energy += en
    gihu += gi
    fuel += fu
    gonggong += gg
    fund += fu2
    totalKwh += kwhUsed

    // 기본요금·TV는 1번만
    if (basicPrice === 0) basicPrice = s.basic_price || 0
    if (tv === 0) tv = s.tv || 0
  })

  const vat = Math.floor((basicPrice + energy + gihu + fuel + gonggong) * 0.1)
  // 10원 단위 절사
  const finalTotal = Math.floor(
    (basicPrice + energy + gihu + fuel + gonggong + vat + fund + tv) / 10
  ) * 10

  return {
    totalKwh,
    basicPrice,
    energy,
    gihu,
    fuel,
    gonggong,
    fund,
    vat,
    tv,
    finalTotal,
    detail,
    months: months.map(([m]) => `${m}월`),
  }
}

/**
 * withDetail: 합계 뒤에 (월1+월2) 형태로 표시
 */
export function withDetail(total, arr) {
  if (arr && arr.length > 1) return `${fmt(total)} (${arr.join('+')})`
  return fmt(total)
}
