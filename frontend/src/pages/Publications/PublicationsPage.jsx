import { useState, useEffect } from 'react'
import { Input, Select, Tag, Pagination } from 'antd'
import { SearchOutlined, BookOutlined, FileTextOutlined } from '@ant-design/icons'
import Header from '../../components/Header.jsx'

const { Search } = Input
const { Option } = Select

const t = {
  tr: {
    title: 'Yayınlar', subtitle: 'Tüm akademik yayınları inceleyin',
    searchPlaceholder: 'Yayın, yazar, dergi ara...',
    allTypes: 'Tüm Türler', allYears: 'Tüm Yıllar', results: 'sonuç',
    types: { article: 'Makale', book: 'Kitap', book_chapter: 'Kitap Bölümü', conference: 'Bildiri', other: 'Diğer' },
    loading: 'Yükleniyor...', noData: 'Henüz yayın eklenmemiş.',
  },
  en: {
    title: 'Publications', subtitle: 'Browse all academic publications',
    searchPlaceholder: 'Search publication, author, journal...',
    allTypes: 'All Types', allYears: 'All Years', results: 'results',
    types: { article: 'Article', book: 'Book', book_chapter: 'Book Chapter', conference: 'Conference Paper', other: 'Other' },
    loading: 'Loading...', noData: 'No publications yet.',
  }
}

const typeColors = { article: '#8B0000', book: '#1a5276', book_chapter: '#1e8449', conference: '#6c3483', other: '#784212' }

export default function PublicationsPage() {
  const [lang, setLang] = useState(() => localStorage.getItem('lang') || 'tr')
  const [publications, setPublications] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [typeFilter, setTypeFilter] = useState('all')
  const [yearFilter, setYearFilter] = useState('all')
  const [page, setPage] = useState(1)
  const [total, setTotal] = useState(0)
  const tx = t[lang]
  const pageSize = 10

  useEffect(() => { fetchPublications() }, [search, typeFilter, yearFilter, page])

  const fetchPublications = async () => {
    setIsLoading(true)
    try {
      let url = `/api/v1/publications/?page=${page}&page_size=${pageSize}`
      if (search) url += `&search=${encodeURIComponent(search)}`
      if (typeFilter !== 'all') url += `&pub_type=${typeFilter}`
      if (yearFilter !== 'all') url += `&year=${yearFilter}`
      const res = await fetch(url)
      const data = await res.json()
      setPublications(data.results || [])
      setTotal(data.count || 0)
    } catch { setPublications([]) }
    setIsLoading(false)
  }

  return (
    <div style={{ fontFamily: "'Georgia', serif", background: '#f8f8f6', minHeight: '100vh' }}>
      <Header activeIndex={0} lang={lang} setLang={setLang} />

      <div style={{ background: 'linear-gradient(135deg, #6B0000, #8B0000)', padding: '40px 48px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
            <BookOutlined style={{ color: '#fff', fontSize: 24 }} />
            <h1 style={{ color: '#fff', fontSize: 28, fontWeight: 700, margin: 0 }}>{tx.title}</h1>
          </div>
          <p style={{ color: 'rgba(255,255,255,0.75)', fontFamily: 'Arial', fontSize: 14, margin: 0 }}>{tx.subtitle}</p>
        </div>
      </div>

      <div style={{ background: '#fff', borderBottom: '1px solid #f0f0f0', padding: '16px 48px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', gap: 16, alignItems: 'center', flexWrap: 'wrap' }}>
          <Search placeholder={tx.searchPlaceholder} value={search} onChange={e => { setSearch(e.target.value); setPage(1) }} style={{ width: 340 }} allowClear />
          <Select value={typeFilter} onChange={v => { setTypeFilter(v); setPage(1) }} style={{ width: 160 }}>
            <Option value="all">{tx.allTypes}</Option>
            {Object.entries(tx.types).map(([k, v]) => <Option key={k} value={k}>{v}</Option>)}
          </Select>
          <Select value={yearFilter} onChange={v => { setYearFilter(v); setPage(1) }} style={{ width: 120 }}>
            <Option value="all">{tx.allYears}</Option>
            {Array.from({length: 36}, (_, i) => new Date().getFullYear() - i).map(y => <Option key={y} value={String(y)}>{y}</Option>)}
          </Select>
          <span style={{ marginLeft: 'auto', fontSize: 13, color: '#888', fontFamily: 'Arial' }}>
            <b style={{ color: '#8B0000' }}>{total}</b> {tx.results}
          </span>
        </div>
      </div>

      <div style={{ maxWidth: 1200, margin: '32px auto', padding: '0 48px' }}>
        {isLoading ? (
          <div style={{ textAlign: 'center', padding: '64px', color: '#888', fontFamily: 'Arial' }}>{tx.loading}</div>
        ) : publications.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '64px', color: '#888', fontFamily: 'Arial' }}>{tx.noData}</div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {publications.map(pub => (
              <a href={`/publications/${pub.id}`} key={pub.id} style={{ background: '#fff', borderRadius: 12, padding: '24px 28px', boxShadow: '0 2px 12px rgba(0,0,0,0.06)', borderLeft: `4px solid ${typeColors[pub.pub_type] || '#8B0000'}`, textDecoration: 'none', display: 'block', transition: 'box-shadow 0.2s' }}
                onMouseEnter={e => e.currentTarget.style.boxShadow = '0 4px 24px rgba(139,0,0,0.12)'}
                onMouseLeave={e => e.currentTarget.style.boxShadow = '0 2px 12px rgba(0,0,0,0.06)'}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 16 }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 8 }}>
                      <Tag color={typeColors[pub.pub_type] || '#8B0000'} style={{ fontSize: 11, fontFamily: 'Arial', borderRadius: 4 }}>{tx.types[pub.pub_type] || pub.pub_type}</Tag>
                      <span style={{ fontSize: 13, color: '#aaa', fontFamily: 'Arial' }}>{pub.year}</span>
                    </div>
                    <h3 style={{ fontSize: 16, fontWeight: 700, color: '#1a1a1a', margin: '0 0 6px', lineHeight: 1.4 }}>{pub.title}</h3>
                    {pub.journal && (
                      <div style={{ fontSize: 13, color: '#666', fontFamily: 'Arial', marginBottom: 4 }}>
                        <FileTextOutlined style={{ marginRight: 6, color: '#8B0000' }} />{pub.journal}
                      </div>
                    )}
                    {pub.abstract && (
                      <p style={{ fontSize: 13, color: '#888', fontFamily: 'Arial', margin: '8px 0 0', lineHeight: 1.6 }}>
                        {pub.abstract.length > 200 ? pub.abstract.substring(0, 200) + '...' : pub.abstract}
                      </p>
                    )}
                  </div>
                  {pub.doi && (
                    <span onClick={e => e.preventDefault()} style={{ display: 'inline-block' }}>
                      <a href={`https://doi.org/${pub.doi}`} target="_blank" rel="noreferrer" style={{ fontSize: 12, color: '#666', fontFamily: 'Arial', border: '1px solid #ddd', borderRadius: 4, padding: '4px 12px', textDecoration: 'none', whiteSpace: 'nowrap' }}>DOI →</a>
                    </span>
                  )}
                </div>
              </a>
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