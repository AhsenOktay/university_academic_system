import { useState, useEffect } from 'react'
import { Select } from 'antd'
import { CalendarOutlined } from '@ant-design/icons'
import Header from '../../components/Header.jsx'

const { Option } = Select

const t = {
  tr: {
    title: 'Etkinlikler', subtitle: 'Üniversitemizdeki akademik etkinlikleri inceleyin',
    searchPlaceholder: 'Etkinlik adı, yer ara...',
    allTypes: 'Tüm Türler', results: 'sonuç',
    loading: 'Yükleniyor...', noData: 'Henüz etkinlik eklenmemiş.',
    types: { conference: 'Konferans', seminar: 'Seminer', workshop: 'Workshop', panel: 'Panel', symposium: 'Sempozyum', other: 'Diğer' },
  },
  en: {
    title: 'Events', subtitle: 'Browse academic events at our university',
    searchPlaceholder: 'Search event name, location...',
    allTypes: 'All Types', results: 'results',
    loading: 'Loading...', noData: 'No events yet.',
    types: { conference: 'Conference', seminar: 'Seminar', workshop: 'Workshop', panel: 'Panel', symposium: 'Symposium', other: 'Other' },
  }
}

const typeColors = { conference: '#8B0000', seminar: '#1a5276', workshop: '#1e8449', panel: '#6c3483', symposium: '#784212', other: '#0e6655' }

export default function EventsPage() {
  const [lang, setLang] = useState(() => localStorage.getItem('lang') || 'tr')
  const [events, setEvents] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [typeFilter, setTypeFilter] = useState('all')
  const [total, setTotal] = useState(0)
  const tx = t[lang]

  useEffect(() => { fetchEvents() }, [search, typeFilter])

  const fetchEvents = async () => {
    setIsLoading(true)
    try {
      let url = `/api/v1/events/?`
      if (search) url += `&search=${encodeURIComponent(search)}`
      if (typeFilter !== 'all') url += `&event_type=${typeFilter}`
      const res = await fetch(url)
      const data = await res.json()
      setEvents(data.results || [])
      setTotal(data.count || 0)
    } catch { setEvents([]) }
    setIsLoading(false)
  }

  return (
    <div style={{ fontFamily: "'Georgia', serif", background: '#f8f8f6', minHeight: '100vh' }}>
      <Header lang={lang} setLang={setLang} />

      <div style={{ background: 'linear-gradient(135deg, #6B0000, #8B0000)', padding: '40px 48px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', alignItems: 'center', gap: 12 }}>
          <CalendarOutlined style={{ color: '#fff', fontSize: 24 }} />
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
        ) : events.length === 0 ? (
          <div style={{ textAlign: 'center', padding: 64, color: '#888', fontFamily: 'Arial' }}>{tx.noData}</div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {events.map(event => (
              <a key={event.id} href={`/events/${event.id}`} style={{ background: '#fff', borderRadius: 12, padding: '24px 28px', boxShadow: '0 2px 12px rgba(0,0,0,0.06)', borderLeft: `4px solid ${typeColors[event.event_type] || '#8B0000'}`, textDecoration: 'none', display: 'block' }}
                onMouseEnter={e => e.currentTarget.style.boxShadow = '0 4px 24px rgba(139,0,0,0.12)'}
                onMouseLeave={e => e.currentTarget.style.boxShadow = '0 2px 12px rgba(0,0,0,0.06)'}
              >
                <div style={{ display: 'flex', gap: 8, marginBottom: 8, alignItems: 'center' }}>
                  <span style={{ background: typeColors[event.event_type] || '#8B0000', color: '#fff', padding: '2px 10px', borderRadius: 20, fontSize: 11, fontFamily: 'Arial', fontWeight: 600 }}>{tx.types[event.event_type] || event.event_type}</span>
                  {event.start_date && <span style={{ fontSize: 12, color: '#aaa', fontFamily: 'Arial' }}>{event.start_date}</span>}
                </div>
                <h3 style={{ fontSize: 16, fontWeight: 700, color: '#1a1a1a', margin: '0 0 4px' }}>{event.title}</h3>
                {event.location && <div style={{ fontSize: 13, color: '#666', fontFamily: 'Arial' }}>{event.location}</div>}
              </a>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}