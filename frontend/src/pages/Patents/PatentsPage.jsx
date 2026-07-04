import { useState, useEffect } from 'react'
import { Select } from 'antd'
import { BulbOutlined } from '@ant-design/icons'
import Header from '../../components/Header.jsx'

const { Option } = Select

const t = {
  tr: {
    title: 'Patentler', subtitle: 'Üniversitemizdeki patent çalışmalarını inceleyin',
    searchPlaceholder: 'Patent adı, numara ara...',
    allStatuses: 'Tüm Durumlar', results: 'sonuç',
    loading: 'Yükleniyor...', noData: 'Henüz patent eklenmemiş.',
    statuses: { applied: 'Başvuru Yapıldı', pending: 'İncelemede', granted: 'Onaylandı', rejected: 'Reddedildi' },
  },
  en: {
    title: 'Patents', subtitle: 'Browse patent studies at our university',
    searchPlaceholder: 'Search patent name, number...',
    allStatuses: 'All Statuses', results: 'results',
    loading: 'Loading...', noData: 'No patents yet.',
    statuses: { applied: 'Applied', pending: 'Pending', granted: 'Granted', rejected: 'Rejected' },
  }
}

const statusColors = { applied: '#1a5276', pending: '#784212', granted: '#1e8449', rejected: '#cf1322' }

export default function PatentsPage() {
  const [lang, setLang] = useState(() => localStorage.getItem('lang') || 'tr')
  const [patents, setPatents] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [total, setTotal] = useState(0)
  const tx = t[lang]

  useEffect(() => { fetchPatents() }, [search, statusFilter])

  const fetchPatents = async () => {
    setIsLoading(true)
    try {
      let url = `/api/v1/patents/?`
      if (search) url += `&search=${encodeURIComponent(search)}`
      if (statusFilter !== 'all') url += `&status=${statusFilter}`
      const res = await fetch(url)
      const data = await res.json()
      setPatents(data.results || [])
      setTotal(data.count || 0)
    } catch { setPatents([]) }
    setIsLoading(false)
  }

  return (
    <div style={{ fontFamily: "'Georgia', serif", background: '#f8f8f6', minHeight: '100vh' }}>
      <Header lang={lang} setLang={setLang} />

      <div style={{ background: 'linear-gradient(135deg, #6B0000, #8B0000)', padding: '40px 48px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', alignItems: 'center', gap: 12 }}>
          <BulbOutlined style={{ color: '#fff', fontSize: 24 }} />
          <div>
            <h1 style={{ color: '#fff', fontSize: 28, fontWeight: 700, margin: 0 }}>{tx.title}</h1>
            <p style={{ color: 'rgba(255,255,255,0.75)', fontFamily: 'Arial', fontSize: 14, margin: 0 }}>{tx.subtitle}</p>
          </div>
        </div>
      </div>

      <div style={{ background: '#fff', borderBottom: '1px solid #f0f0f0', padding: '16px 48px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', gap: 16, alignItems: 'center', flexWrap: 'wrap' }}>
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder={tx.searchPlaceholder} style={{ height: 36, borderRadius: 8, border: '1px solid #d9d9d9', padding: '0 12px', fontSize: 14, fontFamily: 'Arial', outline: 'none', width: 280 }} />
          <Select value={statusFilter} onChange={v => setStatusFilter(v)} style={{ width: 160 }}>
            <Option value="all">{tx.allStatuses}</Option>
            {Object.entries(tx.statuses).map(([k, v]) => <Option key={k} value={k}>{v}</Option>)}
          </Select>
          <span style={{ marginLeft: 'auto', fontSize: 13, color: '#888', fontFamily: 'Arial' }}>
            <b style={{ color: '#8B0000' }}>{total}</b> {tx.results}
          </span>
        </div>
      </div>

      <div style={{ maxWidth: 1200, margin: '32px auto 64px', padding: '0 48px' }}>
        {isLoading ? (
          <div style={{ textAlign: 'center', padding: 64, color: '#888', fontFamily: 'Arial' }}>{tx.loading}</div>
        ) : patents.length === 0 ? (
          <div style={{ textAlign: 'center', padding: 64, color: '#888', fontFamily: 'Arial' }}>{tx.noData}</div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 20 }}>
            {patents.map(patent => (
              <a key={patent.id} href={`/patents/${patent.id}`} style={{ background: '#fff', borderRadius: 12, padding: '24px 28px', boxShadow: '0 2px 12px rgba(0,0,0,0.06)', borderLeft: '4px solid #6c3483', textDecoration: 'none', display: 'block' }}
                onMouseEnter={e => e.currentTarget.style.boxShadow = '0 4px 24px rgba(108,52,131,0.12)'}
                onMouseLeave={e => e.currentTarget.style.boxShadow = '0 2px 12px rgba(0,0,0,0.06)'}
              >
                <div style={{ display: 'flex', gap: 8, marginBottom: 8, alignItems: 'center' }}>
                  <BulbOutlined style={{ color: '#6c3483', fontSize: 18 }} />
                  {patent.status && <span style={{ background: statusColors[patent.status] || '#6c3483', color: '#fff', padding: '2px 10px', borderRadius: 20, fontSize: 11, fontFamily: 'Arial' }}>{tx.statuses[patent.status] || patent.status}</span>}
                </div>
                <h3 style={{ fontSize: 16, fontWeight: 700, color: '#1a1a1a', margin: '0 0 4px' }}>{patent.title}</h3>
                {patent.patent_no && <div style={{ fontSize: 13, color: '#666', fontFamily: 'Arial' }}>No: {patent.patent_no}</div>}
              </a>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}