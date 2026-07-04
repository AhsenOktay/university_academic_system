import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { Tag } from 'antd'
import { BookOutlined, ProjectOutlined, FileDoneOutlined, TrophyOutlined, BulbOutlined, MailOutlined, BankOutlined, CalendarOutlined, ReadOutlined, TeamOutlined } from '@ant-design/icons'
import Header from '../../components/Header.jsx'

const t = {
  tr: {
    publications: 'Yayınlar', projects: 'Projeler', theses: 'Tezler', awards: 'Ödüller', patents: 'Patentler', events: 'Etkinlikler', courses: 'Dersler', memberships: 'Üyelikler',
    loading: 'Yükleniyor...', notFound: 'Akademisyen bulunamadı.',
    pubTypes: { article: 'Makale', book: 'Kitap', book_chapter: 'Kitap Bölümü', conference: 'Bildiri', other: 'Diğer' },
    thesisTypes: { masters: 'Yüksek Lisans', phd: 'Doktora' },
    eventTypes: { conference: 'Konferans', seminar: 'Seminer', workshop: 'Workshop', panel: 'Panel', symposium: 'Sempozyum', other: 'Diğer' },
    levels: { undergraduate: 'Lisans', graduate: 'Yüksek Lisans', doctorate: 'Doktora' },
    semesters: { fall: 'Güz', spring: 'Bahar', summer: 'Yaz' },
    membershipTypes: { association: 'Dernek', journal: 'Dergi', committee: 'Komite', board: 'Yönetim Kurulu', other: 'Diğer' },
    noData: 'Henüz veri yok.', back: '← Akademisyenler', active: 'Aktif',
  },
  en: {
    publications: 'Publications', projects: 'Projects', theses: 'Theses', awards: 'Awards', patents: 'Patents', events: 'Events', courses: 'Courses', memberships: 'Memberships',
    loading: 'Loading...', notFound: 'Researcher not found.',
    pubTypes: { article: 'Article', book: 'Book', book_chapter: 'Book Chapter', conference: 'Conference Paper', other: 'Other' },
    thesisTypes: { masters: "Master's", phd: 'PhD' },
    eventTypes: { conference: 'Conference', seminar: 'Seminar', workshop: 'Workshop', panel: 'Panel', symposium: 'Symposium', other: 'Other' },
    levels: { undergraduate: 'Undergraduate', graduate: 'Graduate', doctorate: 'Doctorate' },
    semesters: { fall: 'Fall', spring: 'Spring', summer: 'Summer' },
    membershipTypes: { association: 'Association', journal: 'Journal', committee: 'Committee', board: 'Board', other: 'Other' },
    noData: 'No data yet.', back: '← Researchers', active: 'Active',
  }
}

const typeColors = { article: '#8B0000', book: '#1a5276', book_chapter: '#1e8449', conference: '#6c3483', other: '#784212' }

function Avatar({ name, photo, size = 100 }) {
  if (photo) return <img src={photo} alt={name} style={{ width: size, height: size, borderRadius: '50%', objectFit: 'cover' }} />
  const initials = name.split(' ').filter(w => !w.includes('.')).slice(0, 2).map(w => w[0]).join('')
  return <div style={{ width: size, height: size, borderRadius: '50%', background: 'linear-gradient(135deg, #8B0000, #C0392B)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: size / 3, fontWeight: 700 }}>{initials}</div>
}

const cardStyle = { background: '#fff', borderRadius: 12, padding: '20px 24px', boxShadow: '0 2px 12px rgba(0,0,0,0.06)', textDecoration: 'none', display: 'block', transition: 'box-shadow 0.2s' }

export default function ResearcherProfilePage() {
  const [lang, setLang] = useState(() => localStorage.getItem('lang') || 'tr')
  const [researcher, setResearcher] = useState(null)
  const [publications, setPublications] = useState([])
  const [projects, setProjects] = useState([])
  const [theses, setTheses] = useState([])
  const [awards, setAwards] = useState([])
  const [patents, setPatents] = useState([])
  const [events, setEvents] = useState([])
  const [courses, setCourses] = useState([])
  const [memberships, setMemberships] = useState([])
  const [activeTab, setActiveTab] = useState('publications')
  const [loading, setLoading] = useState(true)
  const { id } = useParams()
  const tx = t[lang]

  useEffect(() => {
    setLoading(true)
    Promise.all([
      fetch(`/api/v1/users/${id}/`),
      fetch(`/api/v1/publications/?authors=${id}`),
      fetch(`/api/v1/projects/?members=${id}`),
      fetch(`/api/v1/theses/?advisor=${id}`),
      fetch(`/api/v1/awards/?recipient=${id}`),
      fetch(`/api/v1/patents/?inventors=${id}`),
      fetch(`/api/v1/events/?organizer=${id}`),
      fetch(`/api/v1/courses/?instructor=${id}`),
      fetch(`/api/v1/memberships/?member=${id}`),
    ]).then(async ([u, p, pr, th, aw, pa, ev, co, me]) => {
      if (u.ok) setResearcher(await u.json())
      if (p.ok) { const d = await p.json(); setPublications(d.results || []) }
      if (pr.ok) { const d = await pr.json(); setProjects(d.results || []) }
      if (th.ok) { const d = await th.json(); setTheses(d.results || []) }
      if (aw.ok) { const d = await aw.json(); setAwards(d.results || []) }
      if (pa.ok) { const d = await pa.json(); setPatents(d.results || []) }
      if (ev.ok) { const d = await ev.json(); setEvents(d.results || []) }
      if (co.ok) { const d = await co.json(); setCourses(d.results || []) }
      if (me.ok) { const d = await me.json(); setMemberships(d.results || []) }
      setLoading(false)
    }).catch(() => setLoading(false))
  }, [id])

  const tabs = [
    { key: 'publications', label: tx.publications, count: publications.length, icon: <BookOutlined /> },
    { key: 'projects', label: tx.projects, count: projects.length, icon: <ProjectOutlined /> },
    { key: 'theses', label: tx.theses, count: theses.length, icon: <FileDoneOutlined /> },
    { key: 'awards', label: tx.awards, count: awards.length, icon: <TrophyOutlined /> },
    { key: 'patents', label: tx.patents, count: patents.length, icon: <BulbOutlined /> },
    { key: 'events', label: tx.events, count: events.length, icon: <CalendarOutlined /> },
    { key: 'courses', label: tx.courses, count: courses.length, icon: <ReadOutlined /> },
    { key: 'memberships', label: tx.memberships, count: memberships.length, icon: <TeamOutlined /> },
  ]

  if (loading) return <div style={{ textAlign: 'center', padding: 64 }}>{tx.loading}</div>
  if (!researcher) return <div style={{ textAlign: 'center', padding: 64 }}>{tx.notFound}</div>

  const noDataDiv = <div style={{ textAlign: 'center', padding: 64, color: '#aaa', fontFamily: 'Arial' }}>{tx.noData}</div>
  const hover = e => e.currentTarget.style.boxShadow = '0 4px 24px rgba(139,0,0,0.12)'
  const unhover = e => e.currentTarget.style.boxShadow = '0 2px 12px rgba(0,0,0,0.06)'
  const currentUser = JSON.parse(localStorage.getItem('user') || '{}')
  const isOwnProfile = currentUser.id === researcher.id

  const handleCVDownload = async () => {
    const token = localStorage.getItem('access')
    const res = await fetch('/api/v1/users/cv/download/', { headers: { 'Authorization': `Bearer ${token}` } })
    const blob = await res.blob()
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url; a.download = 'CV.pdf'; a.click()
  }

  return (
    <div style={{ fontFamily: "'Georgia', serif", background: '#f8f8f6', minHeight: '100vh' }}>
      <Header activeIndex={2} lang={lang} setLang={setLang} />

      <div style={{ background: 'linear-gradient(135deg, #6B0000, #8B0000)', padding: '40px 48px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <a href="/researchers" style={{ color: 'rgba(255,255,255,0.7)', fontFamily: 'Arial', fontSize: 13, textDecoration: 'none', display: 'block', marginBottom: 24 }}>{tx.back}</a>
          <div style={{ display: 'flex', gap: 32, alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', gap: 32, alignItems: 'center' }}>
              <Avatar name={`${researcher.first_name} ${researcher.last_name}`} photo={researcher.profile_image_url} size={100} />
              <div>
                <h1 style={{ color: '#fff', fontSize: 28, fontWeight: 700, margin: '0 0 8px' }}>
                  {researcher.title ? `${researcher.title} ` : ''}{researcher.first_name} {researcher.last_name}
                </h1>
                {researcher.department && <div style={{ color: 'rgba(255,255,255,0.85)', fontFamily: 'Arial', fontSize: 15, display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}><BankOutlined /> {researcher.department}</div>}
                {researcher.faculty && <div style={{ color: 'rgba(255,255,255,0.7)', fontFamily: 'Arial', fontSize: 13, marginBottom: 8 }}>{researcher.faculty}</div>}
                {researcher.email && <div style={{ color: 'rgba(255,255,255,0.7)', fontFamily: 'Arial', fontSize: 13, display: 'flex', alignItems: 'center', gap: 8 }}><MailOutlined /> {researcher.email}</div>}
              </div>
            </div>
                
          <button onClick={async () => {
                const res = await fetch(`/api/v1/users/${researcher.id}/cv/`)
                const blob = await res.blob()
                const url = window.URL.createObjectURL(blob)
                const a = document.createElement('a')
                a.href = url; a.download = `CV_${researcher.last_name}.pdf`; a.click()
              }} style={{ height: 44, padding: '0 24px', borderRadius: 8, background: 'rgba(255,255,255,0.15)', border: '1.5px solid rgba(255,255,255,0.6)', color: '#fff', fontSize: 14, fontWeight: 600, fontFamily: 'Arial', cursor: 'pointer', whiteSpace: 'nowrap', flexShrink: 0 }}>
                ⬇ CV İndir
        </button>
          </div>
          <div style={{ display: 'flex', gap: 24, marginTop: 32, flexWrap: 'wrap' }}>
            {tabs.map(tab => (
              <div key={tab.key} style={{ textAlign: 'center' }}>
                <div style={{ color: '#fff', fontSize: 20, fontWeight: 800 }}>{tab.count}</div>
                <div style={{ color: 'rgba(255,255,255,0.7)', fontFamily: 'Arial', fontSize: 11 }}>{tab.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div style={{ background: '#fff', borderBottom: '1px solid #f0f0f0', padding: '0 48px', overflowX: 'auto' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', display: 'flex' }}>
          {tabs.map(tab => (
            <button key={tab.key} onClick={() => setActiveTab(tab.key)} style={{ background: 'none', border: 'none', padding: '14px 18px', cursor: 'pointer', fontFamily: 'Arial', fontSize: 13, fontWeight: activeTab === tab.key ? 700 : 400, color: activeTab === tab.key ? '#8B0000' : '#666', borderBottom: activeTab === tab.key ? '2px solid #8B0000' : '2px solid transparent', display: 'flex', alignItems: 'center', gap: 6, whiteSpace: 'nowrap' }}>
              {tab.icon} {tab.label} ({tab.count})
            </button>
          ))}
        </div>
      </div>

      <div style={{ maxWidth: 1200, margin: '32px auto 64px', padding: '0 48px' }}>
        {activeTab === 'publications' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {publications.length === 0 ? noDataDiv : publications.map(pub => (
              <a key={pub.id} href={`/publications/${pub.id}`} style={{ ...cardStyle, borderLeft: `4px solid ${typeColors[pub.pub_type] || '#8B0000'}` }} onMouseEnter={hover} onMouseLeave={unhover}>
                <div style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
                  <Tag color={typeColors[pub.pub_type]} style={{ fontSize: 11, borderRadius: 4 }}>{tx.pubTypes[pub.pub_type] || pub.pub_type}</Tag>
                  <span style={{ fontSize: 12, color: '#aaa', fontFamily: 'Arial' }}>{pub.year}</span>
                </div>
                <h3 style={{ fontSize: 15, fontWeight: 700, color: '#1a1a1a', margin: '0 0 4px' }}>{pub.title}</h3>
                {pub.journal && <div style={{ fontSize: 13, color: '#666', fontFamily: 'Arial' }}>{pub.journal}</div>}
              </a>
            ))}
          </div>
        )}
        {activeTab === 'projects' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {projects.length === 0 ? noDataDiv : projects.map(proj => (
              <a key={proj.id} href={`/projects/${proj.id}`} style={cardStyle} onMouseEnter={hover} onMouseLeave={unhover}>
                <h3 style={{ fontSize: 15, fontWeight: 700, color: '#1a1a1a', margin: '0 0 8px' }}>{proj.title}</h3>
                <div style={{ fontSize: 13, color: '#666', fontFamily: 'Arial' }}>{proj.start_date} – {proj.end_date || '...'}</div>
              </a>
            ))}
          </div>
        )}
        {activeTab === 'theses' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {theses.length === 0 ? noDataDiv : theses.map(thesis => (
              <a key={thesis.id} href={`/theses/${thesis.id}`} style={cardStyle} onMouseEnter={hover} onMouseLeave={unhover}>
                <Tag color="#6c3483" style={{ fontSize: 11, borderRadius: 4, marginBottom: 8 }}>{tx.thesisTypes[thesis.thesis_type]}</Tag>
                <h3 style={{ fontSize: 15, fontWeight: 700, color: '#1a1a1a', margin: '0 0 4px' }}>{thesis.title}</h3>
                <div style={{ fontSize: 13, color: '#666', fontFamily: 'Arial' }}>{thesis.year}</div>
              </a>
            ))}
          </div>
        )}
        {activeTab === 'awards' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {awards.length === 0 ? noDataDiv : awards.map(award => (
              <a key={award.id} href={`/awards/${award.id}`} style={{ ...cardStyle, borderLeft: '4px solid #784212' }} onMouseEnter={hover} onMouseLeave={unhover}>
                <h3 style={{ fontSize: 15, fontWeight: 700, color: '#1a1a1a', margin: '0 0 4px' }}>{award.title}</h3>
                <div style={{ fontSize: 13, color: '#666', fontFamily: 'Arial' }}>{award.given_by} • {award.year}</div>
              </a>
            ))}
          </div>
        )}
        {activeTab === 'patents' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {patents.length === 0 ? noDataDiv : patents.map(patent => (
              <a key={patent.id} href={`/patents/${patent.id}`} style={{ ...cardStyle, borderLeft: '4px solid #6c3483' }} onMouseEnter={hover} onMouseLeave={unhover}>
                <h3 style={{ fontSize: 15, fontWeight: 700, color: '#1a1a1a', margin: '0 0 4px' }}>{patent.title}</h3>
                {patent.patent_no && <div style={{ fontSize: 13, color: '#666', fontFamily: 'Arial' }}>No: {patent.patent_no}</div>}
              </a>
            ))}
          </div>
        )}
        {activeTab === 'events' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {events.length === 0 ? noDataDiv : events.map(event => (
              <a key={event.id} href={`/events/${event.id}`} style={{ ...cardStyle, borderLeft: '4px solid #0e6655' }} onMouseEnter={hover} onMouseLeave={unhover}>
                <Tag color="#0e6655" style={{ fontSize: 11, borderRadius: 4, marginBottom: 8 }}>{tx.eventTypes[event.event_type] || event.event_type}</Tag>
                <h3 style={{ fontSize: 15, fontWeight: 700, color: '#1a1a1a', margin: '0 0 4px' }}>{event.title}</h3>
                <div style={{ fontSize: 13, color: '#666', fontFamily: 'Arial' }}>{event.location} • {event.start_date}</div>
              </a>
            ))}
          </div>
        )}
        {activeTab === 'courses' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {courses.length === 0 ? noDataDiv : courses.map(course => (
              <a key={course.id} href={`/courses/${course.id}`} style={{ ...cardStyle, borderLeft: '4px solid #1a5276' }} onMouseEnter={hover} onMouseLeave={unhover}>
                <Tag color="#1a5276" style={{ fontSize: 11, borderRadius: 4, marginBottom: 8 }}>{tx.levels[course.level] || course.level}</Tag>
                <h3 style={{ fontSize: 15, fontWeight: 700, color: '#1a1a1a', margin: '0 0 4px' }}>{course.code ? `${course.code} - ` : ''}{course.name}</h3>
                <div style={{ fontSize: 13, color: '#666', fontFamily: 'Arial' }}>{tx.semesters[course.semester]} {course.year}</div>
              </a>
            ))}
          </div>
        )}
        {activeTab === 'memberships' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {memberships.length === 0 ? noDataDiv : memberships.map(m => (
              <a key={m.id} href={`/memberships/${m.id}`} style={{ ...cardStyle, borderLeft: '4px solid #6c3483' }} onMouseEnter={hover} onMouseLeave={unhover}>
                <Tag color="#6c3483" style={{ fontSize: 11, borderRadius: 4, marginBottom: 8 }}>{tx.membershipTypes[m.membership_type] || m.membership_type}</Tag>
                <h3 style={{ fontSize: 15, fontWeight: 700, color: '#1a1a1a', margin: '0 0 4px' }}>{m.organization}</h3>
                {m.role && <div style={{ fontSize: 13, color: '#666', fontFamily: 'Arial' }}>{m.role}</div>}
                <div style={{ fontSize: 13, color: '#aaa', fontFamily: 'Arial' }}>{m.start_year}{m.end_year ? ` – ${m.end_year}` : ' – ...'}</div>
              </a>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}