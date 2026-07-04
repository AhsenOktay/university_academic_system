import { useState, useEffect } from 'react'
import { Select } from 'antd'
import { TeamOutlined } from '@ant-design/icons'
import Header from '../../components/Header.jsx'

const { Option } = Select

const t = {
  tr: {
    title: 'Üyelikler', subtitle: 'Üniversitemizdeki akademik üyelikleri inceleyin',
    searchPlaceholder: 'Kurum, dernek ara...',
    allTypes: 'Tüm Türler', results: 'sonuç',
    loading: 'Yükleniyor...', noData: 'Henüz üyelik eklenmemiş.',
    types: { association: 'Dernek', journal: 'Dergi', committee: 'Komite', board: 'Yönetim Kurulu', other: 'Diğer' },
    active: 'Aktif',
  },
  en: {
    title: 'Memberships', subtitle: 'Browse academic memberships at our university',
    searchPlaceholder: 'Search organization...',
    allTypes: 'All Types', results: 'results',
    loading: 'Loading...', noData: 'No memberships yet.',
    types: { association: 'Association', journal: 'Journal', committee: 'Committee', board: 'Board', other: 'Other' },
    active: 'Active',
  }
}

const typeColors = { association: '#8B0000', journal: '#1a5276', committee: '#1e8449', board: '#6c3483', other: '#784212' }

export default function MembershipsPage() {
  const [lang, setLang] = useState(() => localStorage.getItem('lang') || 'tr')
  const [memberships, setMemberships] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [typeFilter, setTypeFilter] = useState('all')
  const [total, setTotal] = useState(0)
  const tx = t[lang]

  useEffect(() => { fetchMemberships() }, [search, typeFilter])

  const fetchMemberships = async () => {
    setIsLoading(true)
    try {
      let url = `/api/v1/memberships/?`
      if (search) url += `&search=${encodeURIComponent(search)}`
      if (typeFilter !== 'all') url += `&membership_type=${typeFilter}`
      const res = await fetch(url)
      const data = await res.json()
      setMemberships(data.results || [])
      setTotal(data.count || 0)
    } catch { setMemberships([]) }
    setIsLoading(false)
  }

  return (
    <div style={{ fontFamily: "'Georgia', serif", background: '#f8f8f6', minHeight: '100vh' }}>
      <Header lang={lang} setLang={setLang} />

      <div style={{ background: 'linear-gradient(135deg, #6B0000, #8B0000)', padding: '40px 48px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', alignItems: 'center', gap: 12 }}>
          <TeamOutlined style={{ color: '#fff', fontSize: 24 }} />
          <div>
            <h1 style={{ color: '#fff', fontSize: 28, fontWeight: 700, margin: 0 }}>{tx.title}</h1>
            <p style={{ color: 'rgba(255,255,255,0.75)', fontFamily: 'Arial', fontSize: 14, margin: 0 }}>{tx.subtitle}</p>
          </div>
        </div>
      </div>

      <div style={{ background: '#fff', borderBottom: '1px solid #f0f0f0', padding: '16px 48px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', gap: 16, alignItems: 'center', flexWrap: 'wrap' }}>
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder={tx.searchPlaceholder} style={{ height: 36, borderRadius: 8, border: '1px solid #d9d9d9', padding: '0 12px', fontSize: 14, fontFamily: 'Arial', outline: 'none', width: 280 }} />
          <Select value={typeFilter} onChange={v => setTypeFilter(v)} style={{ width: 160 }}>
            <Option value="all">{tx.allTypes}</Option>
            {Object.entries(tx.types).map(([k, v]) => <Option key={k} value={k}>{v}</Option>)}
          </Select>
          <span style={{ marginLeft: 'auto', fontSize: 13, color: '#888', fontFamily: 'Arial' }}>
            <b style={{ color: '#8B0000' }}>{total}</b> {tx.results}
          </span>
        </div>
      </div>

      <div style={{ maxWidth: 1200, margin: '32px auto 64px', padding: '0 48px' }}>
        {isLoading ? (
          <div style={{ textAlign: 'center', padding: 64, color: '#888', fontFamily: 'Arial' }}>{tx.loading}</div>
        ) : memberships.length === 0 ? (
          <div style={{ textAlign: 'center', padding: 64, color: '#888', fontFamily: 'Arial' }}>{tx.noData}</div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 20 }}>
            {memberships.map(m => (
              <a key={m.id} href={`/memberships/${m.id}`} style={{ background: '#fff', borderRadius: 12, padding: '24px 28px', boxShadow: '0 2px 12px rgba(0,0,0,0.06)', borderLeft: `4px solid ${typeColors[m.membership_type] || '#6c3483'}`, textDecoration: 'none', display: 'block' }}
                onMouseEnter={e => e.currentTarget.style.boxShadow = '0 4px 24px rgba(108,52,131,0.12)'}
                onMouseLeave={e => e.currentTarget.style.boxShadow = '0 2px 12px rgba(0,0,0,0.06)'}
              >
                <div style={{ display: 'flex', gap: 8, marginBottom: 8, alignItems: 'center' }}>
                  <span style={{ background: typeColors[m.membership_type] || '#6c3483', color: '#fff', padding: '2px 10px', borderRadius: 20, fontSize: 11, fontFamily: 'Arial', fontWeight: 600 }}>{tx.types[m.membership_type] || m.membership_type}</span>
                  {m.is_active && <span style={{ background: '#1e8449', color: '#fff', padding: '2px 10px', borderRadius: 20, fontSize: 11, fontFamily: 'Arial' }}>{tx.active}</span>}
                </div>
                <h3 style={{ fontSize: 16, fontWeight: 700, color: '#1a1a1a', margin: '0 0 4px' }}>{m.organization}</h3>
                {m.role && <div style={{ fontSize: 13, color: '#666', fontFamily: 'Arial' }}>{m.role}</div>}
                <div style={{ fontSize: 12, color: '#aaa', fontFamily: 'Arial', marginTop: 4 }}>{m.start_year}{m.end_year ? ` — ${m.end_year}` : ' — ...'}</div>
              </a>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}