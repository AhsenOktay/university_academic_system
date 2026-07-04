import { useState, useEffect } from 'react'
import { Input, Select, Tag, Pagination } from 'antd'
import { SearchOutlined, ProjectOutlined, CalendarOutlined, DollarOutlined } from '@ant-design/icons'
import Header from '../../components/Header.jsx'

const { Search } = Input
const { Option } = Select

const t = {
  tr: {
    title: 'Projeler', subtitle: 'Tüm araştırma projelerini inceleyin',
    searchPlaceholder: 'Proje adı ara...',
    allTypes: 'Tüm Türler', allStatuses: 'Tüm Durumlar', results: 'sonuç',
    types: { tubitak: 'TÜBİTAK', bap: 'BAP', eu: 'AB Projesi', industry: 'Sanayi', other: 'Diğer' },
    statuses: { ongoing: 'Devam Ediyor', completed: 'Tamamlandı', cancelled: 'İptal' },
    loading: 'Yükleniyor...', noData: 'Henüz proje eklenmemiş.',
  },
  en: {
    title: 'Projects', subtitle: 'Browse all research projects',
    searchPlaceholder: 'Search project name...',
    allTypes: 'All Types', allStatuses: 'All Statuses', results: 'results',
    types: { tubitak: 'TÜBİTAK', bap: 'BAP', eu: 'EU Project', industry: 'Industry', other: 'Other' },
    statuses: { ongoing: 'Ongoing', completed: 'Completed', cancelled: 'Cancelled' },
    loading: 'Loading...', noData: 'No projects yet.',
  }
}

const statusColors = { ongoing: '#27ae60', completed: '#2980b9', cancelled: '#e74c3c' }
const typeColors = { tubitak: '#8B0000', bap: '#1a5276', eu: '#1e8449', industry: '#6c3483', other: '#784212' }

export default function ProjectsPage() {
  const [lang, setLang] = useState(() => localStorage.getItem('lang') || 'tr')
  const [projects, setProjects] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [typeFilter, setTypeFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')
  const [page, setPage] = useState(1)
  const [total, setTotal] = useState(0)
  const tx = t[lang]
  const pageSize = 10

  useEffect(() => { fetchProjects() }, [search, typeFilter, statusFilter, page])

  const fetchProjects = async () => {
    setIsLoading(true)
    try {
      let url = `/api/v1/projects/?page=${page}&page_size=${pageSize}`
      if (search) url += `&search=${encodeURIComponent(search)}`
      if (typeFilter !== 'all') url += `&project_type=${typeFilter}`
      if (statusFilter !== 'all') url += `&status=${statusFilter}`
      const res = await fetch(url)
      const data = await res.json()
      setProjects(data.results || [])
      setTotal(data.count || 0)
    } catch { setProjects([]) }
    setIsLoading(false)
  }

  return (
    <div style={{ fontFamily: "'Georgia', serif", background: '#f8f8f6', minHeight: '100vh' }}>
      <Header activeIndex={1} lang={lang} setLang={setLang} />

      <div style={{ background: 'linear-gradient(135deg, #6B0000, #8B0000)', padding: '40px 48px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
            <ProjectOutlined style={{ color: '#fff', fontSize: 24 }} />
            <h1 style={{ color: '#fff', fontSize: 28, fontWeight: 700, margin: 0 }}>{tx.title}</h1>
          </div>
          <p style={{ color: 'rgba(255,255,255,0.75)', fontFamily: 'Arial', fontSize: 14, margin: 0 }}>{tx.subtitle}</p>
        </div>
      </div>

      <div style={{ background: '#fff', borderBottom: '1px solid #f0f0f0', padding: '16px 48px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', gap: 16, alignItems: 'center', flexWrap: 'wrap' }}>
          <Search placeholder={tx.searchPlaceholder} value={search} onChange={e => { setSearch(e.target.value); setPage(1) }} style={{ width: 300 }} allowClear />
          <Select value={typeFilter} onChange={v => { setTypeFilter(v); setPage(1) }} style={{ width: 160 }}>
            <Option value="all">{tx.allTypes}</Option>
            {Object.entries(tx.types).map(([k, v]) => <Option key={k} value={k}>{v}</Option>)}
          </Select>
          <Select value={statusFilter} onChange={v => { setStatusFilter(v); setPage(1) }} style={{ width: 160 }}>
            <Option value="all">{tx.allStatuses}</Option>
            {Object.entries(tx.statuses).map(([k, v]) => <Option key={k} value={k}>{v}</Option>)}
          </Select>
          <span style={{ marginLeft: 'auto', fontSize: 13, color: '#888', fontFamily: 'Arial' }}>
            <b style={{ color: '#8B0000' }}>{total}</b> {tx.results}
          </span>
        </div>
      </div>

      <div style={{ maxWidth: 1200, margin: '32px auto', padding: '0 48px' }}>
        {isLoading ? (
          <div style={{ textAlign: 'center', padding: '64px', color: '#888', fontFamily: 'Arial' }}>{tx.loading}</div>
        ) : projects.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '64px', color: '#888', fontFamily: 'Arial' }}>{tx.noData}</div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {projects.map(project => (
              <div key={project.id} style={{ background: '#fff', borderRadius: 12, padding: '24px 28px', boxShadow: '0 2px 12px rgba(0,0,0,0.06)', borderLeft: `4px solid ${typeColors[project.project_type] || '#8B0000'}`, transition: 'box-shadow 0.2s' }}
                onMouseEnter={e => e.currentTarget.style.boxShadow = '0 4px 24px rgba(139,0,0,0.12)'}
                onMouseLeave={e => e.currentTarget.style.boxShadow = '0 2px 12px rgba(0,0,0,0.06)'}
              >
                <div style={{ display: 'flex', gap: 8, marginBottom: 10 }}>
                  <Tag color={typeColors[project.project_type] || '#8B0000'} style={{ fontSize: 11, fontFamily: 'Arial', borderRadius: 4 }}>{tx.types[project.project_type] || project.project_type}</Tag>
                  <Tag color={statusColors[project.status] || '#888'} style={{ fontSize: 11, fontFamily: 'Arial', borderRadius: 4 }}>{tx.statuses[project.status] || project.status}</Tag>
                </div>
                <h3 style={{ fontSize: 16, fontWeight: 700, color: '#1a1a1a', margin: '0 0 12px', lineHeight: 1.4 }}>{project.title}</h3>
                <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap' }}>
                  {project.start_date && <span style={{ fontSize: 13, color: '#666', fontFamily: 'Arial', display: 'flex', alignItems: 'center', gap: 4 }}><CalendarOutlined style={{ color: '#8B0000' }} /> {project.start_date} – {project.end_date || '...'}</span>}
                  {project.budget && <span style={{ fontSize: 13, color: '#666', fontFamily: 'Arial', display: 'flex', alignItems: 'center', gap: 4 }}><DollarOutlined style={{ color: '#8B0000' }} /> {Number(project.budget).toLocaleString()} ₺</span>}
                </div>
              </div>
            ))}
          </div>
        )}
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: 32, marginBottom: 64 }}>
          <Pagination current={page} total={total} pageSize={pageSize} onChange={setPage} showSizeChanger={false} />
        </div>
      </div>
    </div>
  )
}

