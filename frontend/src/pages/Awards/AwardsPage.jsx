import { useState, useEffect } from 'react'
import { Select } from 'antd'
import { TrophyOutlined } from '@ant-design/icons'
import Header from '../../components/Header.jsx'

const { Option } = Select

const t = {
  tr: {
    title: 'Ödüller', subtitle: 'Üniversitemizdeki akademik ödülleri inceleyin',
    searchPlaceholder: 'Ödül adı, kurum ara...',
    allYears: 'Tüm Yıllar', results: 'sonuç',
    loading: 'Yükleniyor...', noData: 'Henüz ödül eklenmemiş.',
  },
  en: {
    title: 'Awards', subtitle: 'Browse academic awards at our university',
    searchPlaceholder: 'Search award name, organization...',
    allYears: 'All Years', results: 'results',
    loading: 'Loading...', noData: 'No awards yet.',
  }
}

export default function AwardsPage() {
  const [lang, setLang] = useState(() => localStorage.getItem('lang') || 'tr')
  const [awards, setAwards] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [yearFilter, setYearFilter] = useState('all')
  const [total, setTotal] = useState(0)
  const tx = t[lang]

  useEffect(() => { fetchAwards() }, [search, yearFilter])

  const fetchAwards = async () => {
    setIsLoading(true)
    try {
      let url = `/api/v1/awards/?`
      if (search) url += `&search=${encodeURIComponent(search)}`
      if (yearFilter !== 'all') url += `&year=${yearFilter}`
      const res = await fetch(url)
      const data = await res.json()
      setAwards(data.results || [])
      setTotal(data.count || 0)
    } catch { setAwards([]) }
    setIsLoading(false)
  }

  return (
    <div style={{ fontFamily: "'Georgia', serif", background: '#f8f8f6', minHeight: '100vh' }}>
      <Header lang={lang} setLang={setLang} />

      <div style={{ background: 'linear-gradient(135deg, #6B0000, #8B0000)', padding: '40px 48px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', alignItems: 'center', gap: 12 }}>
          <TrophyOutlined style={{ color: '#fff', fontSize: 24 }} />
          <div>
            <h1 style={{ color: '#fff', fontSize: 28, fontWeight: 700, margin: 0 }}>{tx.title}</h1>
            <p style={{ color: 'rgba(255,255,255,0.75)', fontFamily: 'Arial', fontSize: 14, margin: 0 }}>{tx.subtitle}</p>
          </div>
        </div>
      </div>

      <div style={{ background: '#fff', borderBottom: '1px solid #f0f0f0', padding: '16px 48px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', gap: 16, alignItems: 'center', flexWrap: 'wrap' }}>
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder={tx.searchPlaceholder} style={{ height: 36, borderRadius: 8, border: '1px solid #d9d9d9', padding: '0 12px', fontSize: 14, fontFamily: 'Arial', outline: 'none', width: 280 }} />
          <Select value={yearFilter} onChange={v => setYearFilter(v)} style={{ width: 120 }}>
            <Option value="all">{tx.allYears}</Option>
            {Array.from({length: 30}, (_, i) => new Date().getFullYear() - i).map(y => <Option key={y} value={String(y)}>{y}</Option>)}
          </Select>
          <span style={{ marginLeft: 'auto', fontSize: 13, color: '#888', fontFamily: 'Arial' }}>
            <b style={{ color: '#8B0000' }}>{total}</b> {tx.results}
          </span>
        </div>
      </div>

      <div style={{ maxWidth: 1200, margin: '32px auto 64px', padding: '0 48px' }}>
        {isLoading ? (
          <div style={{ textAlign: 'center', padding: 64, color: '#888', fontFamily: 'Arial' }}>{tx.loading}</div>
        ) : awards.length === 0 ? (
          <div style={{ textAlign: 'center', padding: 64, color: '#888', fontFamily: 'Arial' }}>{tx.noData}</div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 20 }}>
            {awards.map(award => (
              <a key={award.id} href={`/awards/${award.id}`} style={{ background: '#fff', borderRadius: 12, padding: '24px 28px', boxShadow: '0 2px 12px rgba(0,0,0,0.06)', borderLeft: '4px solid #784212', textDecoration: 'none', display: 'block' }}
                onMouseEnter={e => e.currentTarget.style.boxShadow = '0 4px 24px rgba(120,66,18,0.12)'}
                onMouseLeave={e => e.currentTarget.style.boxShadow = '0 2px 12px rgba(0,0,0,0.06)'}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
                  <TrophyOutlined style={{ color: '#784212', fontSize: 20 }} />
                  <span style={{ fontSize: 12, color: '#aaa', fontFamily: 'Arial' }}>{award.year}</span>
                </div>
                <h3 style={{ fontSize: 16, fontWeight: 700, color: '#1a1a1a', margin: '0 0 4px' }}>{award.title}</h3>
                {award.given_by && <div style={{ fontSize: 13, color: '#666', fontFamily: 'Arial' }}>{award.given_by}</div>}
              </a>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}