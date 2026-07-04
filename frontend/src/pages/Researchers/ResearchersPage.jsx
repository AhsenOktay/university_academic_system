import { useState, useEffect } from 'react'
import { Input, Select } from 'antd'
import Header from '../../components/Header.jsx'

const { Option } = Select

const departments = [
  'Yazılım Mühendisliği',
  'Bilgisayar Mühendisliği',
  'Elektrik-Elektronik Mühendisliği',
  'Endüstri Mühendisliği',
  'Mimarlık',
  'İç Mimarlık',
  'Psikoloji',
  'İşletme',
  'Ekonomi',
  'Uluslararası İlişkiler',
  'Hukuk',
  'Hemşirelik',
  'Fizyoterapi ve Rehabilitasyon',
  'Gastronomi ve Mutfak Sanatları',
  'Turizm İşletmeciliği',
  'İngiliz Dili ve Edebiyatı',
]

const faculties = [
  'Mühendislik-Mimarlık Fakültesi',
  'İktisadi ve İdari Bilimler Fakültesi',
  'Fen-Edebiyat Fakültesi',
  'Hukuk Fakültesi',
  'Sağlık Bilimleri Fakültesi',
  'Turizm Fakültesi',
  'Güzel Sanatlar ve Tasarım Fakültesi',
]

const t = {
  tr: {
    title: 'Akademisyenler', subtitle: 'Tüm akademik personeli inceleyin',
    searchPlaceholder: 'İsim ara...',
    allDepts: 'Tüm Bölümler', allFaculties: 'Tüm Fakülteler',
    results: 'akademisyen', loading: 'Yükleniyor...', noData: 'Akademisyen bulunamadı.',
  },
  en: {
    title: 'Researchers', subtitle: 'Browse all academic staff',
    searchPlaceholder: 'Search name...',
    allDepts: 'All Departments', allFaculties: 'All Faculties',
    results: 'researchers', loading: 'Loading...', noData: 'No researchers found.',
  }
}

function Avatar({ name, photo }) {
  if (photo) return <img src={photo} alt={name} style={{ width: 64, height: 64, borderRadius: '50%', objectFit: 'cover' }} />
  const initials = name.split(' ').filter(w => !w.includes('.')).slice(0, 2).map(w => w[0]).join('')
  return (
    <div style={{ width: 64, height: 64, borderRadius: '50%', background: 'linear-gradient(135deg, #8B0000, #C0392B)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 20, fontWeight: 700, flexShrink: 0 }}>{initials}</div>
  )
}

export default function ResearchersPage() {
  const [lang, setLang] = useState(() => localStorage.getItem('lang') || 'tr')
  const [researchers, setResearchers] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [deptFilter, setDeptFilter] = useState('all')
  const [facultyFilter, setFacultyFilter] = useState('all')
  const [total, setTotal] = useState(0)
  const tx = t[lang]

  useEffect(() => { fetchResearchers() }, [search, deptFilter, facultyFilter])

  const fetchResearchers = async () => {
    setIsLoading(true)
    try {
      let url = `/api/v1/users/?user_type=academic&page_size=100`
      if (search) url += `&search=${encodeURIComponent(search)}`
      const res = await fetch(url)
      const data = await res.json()
      let results = data.results || []

      if (deptFilter !== 'all') results = results.filter(r => r.department === deptFilter)
      if (facultyFilter !== 'all') results = results.filter(r => r.faculty === facultyFilter)

      setResearchers(results)
      setTotal(results.length)
    } catch { setResearchers([]) }
    setIsLoading(false)
  }

  return (
    <div style={{ fontFamily: "'Georgia', serif", background: '#f8f8f6', minHeight: '100vh' }}>
      <Header activeIndex={2} lang={lang} setLang={setLang} />

      <div style={{ background: 'linear-gradient(135deg, #6B0000, #8B0000)', padding: '40px 48px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <h1 style={{ color: '#fff', fontSize: 28, fontWeight: 700, margin: '0 0 8px' }}>{tx.title}</h1>
          <p style={{ color: 'rgba(255,255,255,0.75)', fontFamily: 'Arial', fontSize: 14, margin: 0 }}>{tx.subtitle}</p>
        </div>
      </div>

      <div style={{ background: '#fff', borderBottom: '1px solid #f0f0f0', padding: '16px 48px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', gap: 16, alignItems: 'center', flexWrap: 'wrap' }}>
          <Input placeholder={tx.searchPlaceholder} value={search} onChange={e => setSearch(e.target.value)} style={{ width: 240 }} allowClear />
          <Select value={facultyFilter} onChange={v => { setFacultyFilter(v); setDeptFilter('all') }} style={{ width: 260 }}>
            <Option value="all">{tx.allFaculties}</Option>
            {faculties.map(f => <Option key={f} value={f}>{f}</Option>)}
          </Select>
          <Select value={deptFilter} onChange={v => setDeptFilter(v)} style={{ width: 240 }}>
            <Option value="all">{tx.allDepts}</Option>
            {departments.map(d => <Option key={d} value={d}>{d}</Option>)}
          </Select>
          <span style={{ marginLeft: 'auto', fontSize: 13, color: '#888', fontFamily: 'Arial' }}>
            <b style={{ color: '#8B0000' }}>{total}</b> {tx.results}
          </span>
        </div>
      </div>

      <div style={{ maxWidth: 1200, margin: '32px auto 64px', padding: '0 48px' }}>
        {isLoading ? (
          <div style={{ textAlign: 'center', padding: '64px', color: '#888', fontFamily: 'Arial' }}>{tx.loading}</div>
        ) : researchers.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '64px', color: '#888', fontFamily: 'Arial' }}>{tx.noData}</div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 20 }}>
            {researchers.map(r => (
              <a href={`/researcher/${r.id}`} key={r.id} style={{ background: '#fff', borderRadius: 12, padding: '24px 28px', boxShadow: '0 2px 12px rgba(0,0,0,0.06)', display: 'flex', gap: 20, cursor: 'pointer', textDecoration: 'none' }}
                onMouseEnter={e => e.currentTarget.style.boxShadow = '0 4px 24px rgba(139,0,0,0.12)'}
                onMouseLeave={e => e.currentTarget.style.boxShadow = '0 2px 12px rgba(0,0,0,0.06)'}
              >
                <Avatar name={(r.first_name || '') + ' ' + (r.last_name || '')} photo={r.profile_image_url} />
                <div style={{ flex: 1 }}>
                  {r.title && <div style={{ fontSize: 12, color: '#8B0000', fontFamily: 'Arial', fontWeight: 600, marginBottom: 4 }}>{r.title}</div>}
                  <div style={{ fontSize: 16, fontWeight: 700, color: '#1a1a1a', marginBottom: 2 }}>{r.first_name} {r.last_name}</div>
                  {r.department && <div style={{ fontSize: 13, color: '#888', fontFamily: 'Arial', marginBottom: 2 }}>{r.department}</div>}
                  {r.faculty && <div style={{ fontSize: 12, color: '#aaa', fontFamily: 'Arial' }}>{r.faculty}</div>}
                </div>
              </a>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}