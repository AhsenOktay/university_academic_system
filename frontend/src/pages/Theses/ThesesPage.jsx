import { useState, useEffect } from 'react'
import { Select } from 'antd'
import Header from '../../components/Header.jsx'

const { Option } = Select

const t = {
  tr: {
    title: 'Tezler', subtitle: 'Üniversitemizdeki tez çalışmalarını inceleyin',
    searchPlaceholder: 'Tez başlığı, öğrenci ara...',
    allTypes: 'Tüm Türler', allYears: 'Tüm Yıllar', results: 'sonuç',
    loading: 'Yükleniyor...', noData: 'Henüz tez eklenmemiş.',
    types: { masters: 'Yüksek Lisans', phd: 'Doktora' },
  },
  en: {
    title: 'Theses', subtitle: 'Browse thesis studies at our university',
    searchPlaceholder: 'Search thesis title, student...',
    allTypes: 'All Types', allYears: 'All Years', results: 'results',
    loading: 'Loading...', noData: 'No theses yet.',
    types: { masters: "Master's", phd: 'PhD' },
  }
}

const typeColors = { masters: '#1a5276', phd: '#6c3483' }

export default function ThesesPage() {
  const [lang, setLang] = useState(() => localStorage.getItem('lang') || 'tr')
  const [theses, setTheses] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [typeFilter, setTypeFilter] = useState('all')
  const [yearFilter, setYearFilter] = useState('all')
  const [total, setTotal] = useState(0)
  const tx = t[lang]

  useEffect(() => { fetchTheses() }, [search, typeFilter, yearFilter])

  const fetchTheses = async () => {
    setIsLoading(true)
    try {
      let url = `/api/v1/theses/?`
      if (search) url += `&search=${encodeURIComponent(search)}`
      if (typeFilter !== 'all') url += `&thesis_type=${typeFilter}`
      if (yearFilter !== 'all') url += `&year=${yearFilter}`
      const res = await fetch(url)
      const data = await res.json()
      setTheses(data.results || [])
      setTotal(data.count || 0)
    } catch { setTheses([]) }
    setIsLoading(false)
  }

  return (
    <div style={{ fontFamily: "'Georgia', serif", background: '#f8f8f6', minHeight: '100vh' }}>
      <Header lang={lang} setLang={setLang} />

      <div style={{ background: 'linear-gradient(135deg, #6B0000, #8B0000)', padding: '40px 48px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <h1 style={{ color: '#fff', fontSize: 28, fontWeight: 700, margin: '0 0 8px' }}>{tx.title}</h1>
          <p style={{ color: 'rgba(255,255,255,0.75)', fontFamily: 'Arial', fontSize: 14, margin: 0 }}>{tx.subtitle}</p>
        </div>
      </div>

      <div style={{ background: '#fff', borderBottom: '1px solid #f0f0f0', padding: '16px 48px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', gap: 16, alignItems: 'center', flexWrap: 'wrap' }}>
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder={tx.searchPlaceholder} style={{ height: 36, borderRadius: 8, border: '1px solid #d9d9d9', padding: '0 12px', fontSize: 14, fontFamily: 'Arial', outline: 'none', width: 280 }} />
          <Select value={typeFilter} onChange={v => setTypeFilter(v)} style={{ width: 150 }}>
            <Option value="all">{tx.allTypes}</Option>
            {Object.entries(tx.types).map(([k, v]) => <Option key={k} value={k}>{v}</Option>)}
          </Select>
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
        ) : theses.length === 0 ? (
          <div style={{ textAlign: 'center', padding: 64, color: '#888', fontFamily: 'Arial' }}>{tx.noData}</div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {theses.map(thesis => (
              <a key={thesis.id} href={`/theses/${thesis.id}`} style={{ background: '#fff', borderRadius: 12, padding: '24px 28px', boxShadow: '0 2px 12px rgba(0,0,0,0.06)', borderLeft: `4px solid ${typeColors[thesis.thesis_type] || '#8B0000'}`, textDecoration: 'none', display: 'block' }}
                onMouseEnter={e => e.currentTarget.style.boxShadow = '0 4px 24px rgba(139,0,0,0.12)'}
                onMouseLeave={e => e.currentTarget.style.boxShadow = '0 2px 12px rgba(0,0,0,0.06)'}
              >
                <div style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
                  <span style={{ background: typeColors[thesis.thesis_type] || '#8B0000', color: '#fff', padding: '2px 10px', borderRadius: 20, fontSize: 11, fontFamily: 'Arial', fontWeight: 600 }}>{tx.types[thesis.thesis_type] || thesis.thesis_type}</span>
                  <span style={{ fontSize: 12, color: '#aaa', fontFamily: 'Arial', alignSelf: 'center' }}>{thesis.year}</span>
                </div>
                <h3 style={{ fontSize: 16, fontWeight: 700, color: '#1a1a1a', margin: '0 0 4px' }}>{thesis.title}</h3>
                {thesis.title_en && <div style={{ fontSize: 13, color: '#888', fontFamily: 'Arial', fontStyle: 'italic', marginBottom: 4 }}>{thesis.title_en}</div>}
                
              </a>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}