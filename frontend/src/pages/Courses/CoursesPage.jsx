import { useState, useEffect } from 'react'
import { Select } from 'antd'
import { ReadOutlined } from '@ant-design/icons'
import Header from '../../components/Header.jsx'

const { Option } = Select

const t = {
  tr: {
    title: 'Dersler', subtitle: 'Üniversitemizdeki akademik dersleri inceleyin',
    searchPlaceholder: 'Ders adı, kod ara...',
    allLevels: 'Tüm Seviyeler', allYears: 'Tüm Yıllar', results: 'sonuç',
    loading: 'Yükleniyor...', noData: 'Henüz ders eklenmemiş.',
    levels: { undergraduate: 'Lisans', graduate: 'Yüksek Lisans', doctorate: 'Doktora' },
    semesters: { fall: 'Güz', spring: 'Bahar', summer: 'Yaz' },
  },
  en: {
    title: 'Courses', subtitle: 'Browse academic courses at our university',
    searchPlaceholder: 'Search course name, code...',
    allLevels: 'All Levels', allYears: 'All Years', results: 'results',
    loading: 'Loading...', noData: 'No courses yet.',
    levels: { undergraduate: 'Undergraduate', graduate: 'Graduate', doctorate: 'Doctorate' },
    semesters: { fall: 'Fall', spring: 'Spring', summer: 'Summer' },
  }
}

const levelColors = { undergraduate: '#1a5276', graduate: '#6c3483', doctorate: '#8B0000' }

export default function CoursesPage() {
  const [lang, setLang] = useState(() => localStorage.getItem('lang') || 'tr')
  const [courses, setCourses] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [levelFilter, setLevelFilter] = useState('all')
  const [yearFilter, setYearFilter] = useState('all')
  const [total, setTotal] = useState(0)
  const tx = t[lang]

  useEffect(() => { fetchCourses() }, [search, levelFilter, yearFilter])

  const fetchCourses = async () => {
    setIsLoading(true)
    try {
      let url = `/api/v1/courses/?`
      if (search) url += `&search=${encodeURIComponent(search)}`
      if (levelFilter !== 'all') url += `&level=${levelFilter}`
      if (yearFilter !== 'all') url += `&year=${yearFilter}`
      const res = await fetch(url)
      const data = await res.json()
      setCourses(data.results || [])
      setTotal(data.count || 0)
    } catch { setCourses([]) }
    setIsLoading(false)
  }

  return (
    <div style={{ fontFamily: "'Georgia', serif", background: '#f8f8f6', minHeight: '100vh' }}>
      <Header lang={lang} setLang={setLang} />

      <div style={{ background: 'linear-gradient(135deg, #6B0000, #8B0000)', padding: '40px 48px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', alignItems: 'center', gap: 12 }}>
          <ReadOutlined style={{ color: '#fff', fontSize: 24 }} />
          <div>
            <h1 style={{ color: '#fff', fontSize: 28, fontWeight: 700, margin: 0 }}>{tx.title}</h1>
            <p style={{ color: 'rgba(255,255,255,0.75)', fontFamily: 'Arial', fontSize: 14, margin: 0 }}>{tx.subtitle}</p>
          </div>
        </div>
      </div>

      <div style={{ background: '#fff', borderBottom: '1px solid #f0f0f0', padding: '16px 48px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', gap: 16, alignItems: 'center', flexWrap: 'wrap' }}>
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder={tx.searchPlaceholder} style={{ height: 36, borderRadius: 8, border: '1px solid #d9d9d9', padding: '0 12px', fontSize: 14, fontFamily: 'Arial', outline: 'none', width: 280 }} />
          <Select value={levelFilter} onChange={v => setLevelFilter(v)} style={{ width: 160 }}>
            <Option value="all">{tx.allLevels}</Option>
            {Object.entries(tx.levels).map(([k, v]) => <Option key={k} value={k}>{v}</Option>)}
          </Select>
          <Select value={yearFilter} onChange={v => setYearFilter(v)} style={{ width: 120 }}>
            <Option value="all">{tx.allYears}</Option>
            {Array.from({length: 20}, (_, i) => new Date().getFullYear() - i).map(y => <Option key={y} value={String(y)}>{y}</Option>)}
          </Select>
          <span style={{ marginLeft: 'auto', fontSize: 13, color: '#888', fontFamily: 'Arial' }}>
            <b style={{ color: '#8B0000' }}>{total}</b> {tx.results}
          </span>
        </div>
      </div>

      <div style={{ maxWidth: 1200, margin: '32px auto 64px', padding: '0 48px' }}>
        {isLoading ? (
          <div style={{ textAlign: 'center', padding: 64, color: '#888', fontFamily: 'Arial' }}>{tx.loading}</div>
        ) : courses.length === 0 ? (
          <div style={{ textAlign: 'center', padding: 64, color: '#888', fontFamily: 'Arial' }}>{tx.noData}</div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 20 }}>
            {courses.map(course => (
              <a key={course.id} href={`/courses/${course.id}`} style={{ background: '#fff', borderRadius: 12, padding: '24px 28px', boxShadow: '0 2px 12px rgba(0,0,0,0.06)', borderLeft: `4px solid ${levelColors[course.level] || '#1a5276'}`, textDecoration: 'none', display: 'block' }}
                onMouseEnter={e => e.currentTarget.style.boxShadow = '0 4px 24px rgba(26,82,118,0.12)'}
                onMouseLeave={e => e.currentTarget.style.boxShadow = '0 2px 12px rgba(0,0,0,0.06)'}
              >
                <div style={{ display: 'flex', gap: 8, marginBottom: 8, alignItems: 'center' }}>
                  <span style={{ background: levelColors[course.level] || '#1a5276', color: '#fff', padding: '2px 10px', borderRadius: 20, fontSize: 11, fontFamily: 'Arial', fontWeight: 600 }}>{tx.levels[course.level] || course.level}</span>
                  {course.semester && <span style={{ fontSize: 12, color: '#aaa', fontFamily: 'Arial' }}>{tx.semesters[course.semester]} {course.year}</span>}
                </div>
                <h3 style={{ fontSize: 16, fontWeight: 700, color: '#1a1a1a', margin: '0 0 4px' }}>{course.code ? `${course.code} - ` : ''}{course.name}</h3>
                {course.name_en && <div style={{ fontSize: 13, color: '#888', fontFamily: 'Arial', fontStyle: 'italic' }}>{course.name_en}</div>}
              </a>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}