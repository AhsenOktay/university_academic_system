import { useState, useEffect } from 'react'
import { Input } from 'antd'
import { ExperimentOutlined } from '@ant-design/icons'
import Header from '../../components/Header.jsx'

const t = {
  tr: {
    title: 'Araştırma Grupları', subtitle: 'Üniversitemizdeki araştırma gruplarını keşfedin',
    searchPlaceholder: 'Grup adı, lider ara...',
    results: 'grup', loading: 'Yükleniyor...', noData: 'Henüz araştırma grubu eklenmemiş.',
    founder: 'Kurucu', members: 'üye', publications: 'yayın', projects: 'proje',
    viewGroup: 'Grubu Gör →', active: 'Aktif',
  },
  en: {
    title: 'Research Groups', subtitle: 'Discover research groups at our university',
    searchPlaceholder: 'Search group name, leader...',
    results: 'groups', loading: 'Loading...', noData: 'No research groups yet.',
    founder: 'Founder', members: 'members', publications: 'publications', projects: 'projects',
    viewGroup: 'View Group →', active: 'Active',
  }
}

export default function ResearchGroupsPage() {
  const [lang, setLang] = useState(() => localStorage.getItem('lang') || 'tr')
  const [groups, setGroups] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [total, setTotal] = useState(0)
  const tx = t[lang]

  useEffect(() => { fetchGroups() }, [search])

  const fetchGroups = async () => {
    setIsLoading(true)
    try {
      let url = `/api/v1/research-groups/`
      if (search) url += `?search=${encodeURIComponent(search)}`
      const res = await fetch(url)
      const data = await res.json()
      setGroups(data.results || [])
      setTotal(data.count || 0)
    } catch { setGroups([]) }
    setIsLoading(false)
  }

  const colors = ['#8B0000', '#1a5276', '#1e8449', '#6c3483', '#784212', '#117a65']

  return (
    <div style={{ fontFamily: "'Georgia', serif", background: '#f8f8f6', minHeight: '100vh' }}>
      <Header activeIndex={3} lang={lang} setLang={setLang} />
      <div style={{ background: 'linear-gradient(135deg, #6B0000, #8B0000)', padding: '40px 48px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
            <ExperimentOutlined style={{ color: '#fff', fontSize: 24 }} />
            <h1 style={{ color: '#fff', fontSize: 28, fontWeight: 700, margin: 0 }}>{tx.title}</h1>
          </div>
          <p style={{ color: 'rgba(255,255,255,0.75)', fontFamily: 'Arial', fontSize: 14, margin: 0 }}>{tx.subtitle}</p>
        </div>
      </div>
      <div style={{ background: '#fff', borderBottom: '1px solid #f0f0f0', padding: '16px 48px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', gap: 16, alignItems: 'center' }}>
          <Input placeholder={tx.searchPlaceholder} value={search} onChange={e => setSearch(e.target.value)} style={{ width: 320 }} allowClear />
          <span style={{ marginLeft: 'auto', fontSize: 13, color: '#888', fontFamily: 'Arial' }}>
            <b style={{ color: '#8B0000' }}>{total}</b> {tx.results}
          </span>
        </div>
      </div>
      <div style={{ maxWidth: 1200, margin: '32px auto 64px', padding: '0 48px' }}>
        {isLoading ? (
          <div style={{ textAlign: 'center', padding: '64px', color: '#888', fontFamily: 'Arial' }}>{tx.loading}</div>
        ) : groups.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '64px', color: '#888', fontFamily: 'Arial' }}>{tx.noData}</div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24 }}>
            {groups.map((group, idx) => {
              const color = colors[idx % colors.length]
              return (
                <div key={group.id} style={{ background: '#fff', borderRadius: 12, boxShadow: '0 2px 12px rgba(0,0,0,0.06)', overflow: 'hidden', transition: 'box-shadow 0.2s, transform 0.2s', cursor: 'pointer' }}
                  onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 8px 32px rgba(0,0,0,0.12)'; e.currentTarget.style.transform = 'translateY(-4px)' }}
                  onMouseLeave={e => { e.currentTarget.style.boxShadow = '0 2px 12px rgba(0,0,0,0.06)'; e.currentTarget.style.transform = 'translateY(0)' }}
                >
                  <div style={{ background: color, padding: '20px 24px', position: 'relative' }}>
                    <div style={{ width: 48, height: 48, background: 'rgba(255,255,255,0.15)', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 12 }}>
                      <ExperimentOutlined style={{ color: '#fff', fontSize: 22 }} />
                    </div>
                    <h3 style={{ color: '#fff', fontSize: 16, fontWeight: 700, margin: 0, lineHeight: 1.3 }}>
                      {lang === 'tr' ? group.name : (group.name_en || group.name)}
                    </h3>
                    {group.is_active && <span style={{ position: 'absolute', top: 16, right: 16, background: 'rgba(255,255,255,0.2)', color: '#fff', fontSize: 10, fontFamily: 'Arial', padding: '2px 8px', borderRadius: 10 }}>{tx.active}</span>}
                  </div>
                  <div style={{ padding: '20px 24px' }}>
                    {group.description && (
                      <p style={{ fontSize: 13, color: '#666', fontFamily: 'Arial', lineHeight: 1.6, marginBottom: 16 }}>
                        {(lang === 'tr' ? group.description : (group.description_en || group.description)).substring(0, 120)}...
                      </p>
                    )}
                    <a href={`/groups/${group.id}`} style={{ fontSize: 13, color: color, fontFamily: 'Arial', textDecoration: 'none', fontWeight: 600 }}>{tx.viewGroup}</a>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}