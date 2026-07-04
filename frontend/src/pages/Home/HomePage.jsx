import { useState, useEffect } from 'react'
import { Input } from 'antd'
import { BookOutlined, ProjectOutlined, ExperimentOutlined, TeamOutlined, FileDoneOutlined, PhoneOutlined, MailOutlined, EnvironmentOutlined, LeftOutlined, RightOutlined } from '@ant-design/icons'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts'
import Header from '../../components/Header.jsx'

const { Search } = Input

const eventTypeLabels = { conference: 'Konferans', seminar: 'Seminer', workshop: 'Workshop', panel: 'Panel', symposium: 'Sempozyum', other: 'Etkinlik' }

function Slider({ recentPub, recentAward, recentEvent }) {
  const [current, setCurrent] = useState(0)

  const slides = [
    recentAward ? {
      id: 1, tag: 'Ödül',
      title: recentAward.title,
      subtitle: recentAward.given_by ? `${recentAward.given_by} tarafından verildi • ${recentAward.year}` : String(recentAward.year),
      href: `/awards/${recentAward.id}`,
    } : null,
    {
      id: 2, tag: 'Çalışma Grupları',
      title: 'Çalışma Gruplarımızı İnceleyin',
      subtitle: 'Disiplinlerarası araştırma gruplarımız akademisyenlerimizi bir araya getiriyor.',
      href: '/groups',
    },
    recentPub ? {
      id: 3, tag: recentPub.pub_type === 'article' ? 'Makale' : recentPub.pub_type === 'book' ? 'Kitap' : recentPub.pub_type === 'conference' ? 'Bildiri' : 'Yayın',
      title: recentPub.title,
      subtitle: `Son yayınlanan ${recentPub.pub_type === 'article' ? 'makale' : 'yayın'} • ${recentPub.year}`,
      href: `/publications/${recentPub.id}`,
    } : null,
    recentEvent ? {
      id: 4, tag: eventTypeLabels[recentEvent.event_type] || 'Etkinlik',
      title: recentEvent.title,
      subtitle: recentEvent.location ? `${recentEvent.location}${recentEvent.start_date ? ' • ' + recentEvent.start_date : ''}` : recentEvent.start_date || '',
      href: `/events/${recentEvent.id}`,
    } : null,
  ].filter(Boolean)

  useEffect(() => {
    if (slides.length === 0) return
    const timer = setInterval(() => setCurrent(prev => (prev + 1) % slides.length), 4500)
    return () => clearInterval(timer)
  }, [slides.length])

  if (slides.length === 0) return null
  const slide = slides[current % slides.length]

  return (
    <div style={{ background: 'rgba(140, 154, 156, 0.48)', padding: '52px 48px' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', alignItems: 'center', gap: 24 }}>
        <button onClick={() => setCurrent(prev => (prev - 1 + slides.length) % slides.length)} style={{ background: 'rgba(255,255,255,0.2)', border: 'none', borderRadius: '50%', width: 36, height: 36, color: '#fff', cursor: 'pointer', fontSize: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}><LeftOutlined /></button>
        <div style={{ flex: 1, textAlign: 'center' }}>
          <div style={{ display: 'inline-block', background: 'rgba(255,255,255,0.2)', color: '#fff', fontSize: 11, fontFamily: 'Arial', padding: '2px 12px', borderRadius: 20, marginBottom: 10 }}>{slide.tag}</div>
          <a href={slide.href} style={{ display: 'block', fontSize: 18, fontWeight: 700, color: '#fff', marginBottom: 6, textDecoration: 'none', lineHeight: 1.3 }}>{slide.title}</a>
          <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.7)', fontFamily: 'Arial' }}>{slide.subtitle}</div>
          <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginTop: 14 }}>
            {slides.map((_, i) => (
              <div key={i} onClick={() => setCurrent(i)} style={{ width: i === current ? 24 : 8, height: 8, borderRadius: 4, background: i === current ? '#fff' : 'rgba(255,255,255,0.4)', cursor: 'pointer', transition: 'all 0.3s' }} />
            ))}
          </div>
        </div>
        <button onClick={() => setCurrent(prev => (prev + 1) % slides.length)} style={{ background: 'rgba(255,255,255,0.2)', border: 'none', borderRadius: '50%', width: 36, height: 36, color: '#fff', cursor: 'pointer', fontSize: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}><RightOutlined /></button>
      </div>
    </div>
  )
}

const t = {
  tr: {
    searchPlaceholder: 'Yayın, araştırmacı, proje ara...',
    searchBtn: 'Ara',
    heroLine1: 'Antalya Belek Üniversitesi',
    heroLine2: 'Akademik Veri Sistemi',
    statsLabels: ['Yayın', 'Proje', 'Tez', 'Araştırmacı'],
    annualStats: 'Yıllık İstatistikler',
    recentPubs: 'Son Yayınlar',
    viewAll: 'Tümünü Gör →',
    researchGroups: 'Araştırma Grupları',
    members: 'üye',
    pubTypes: { article: 'Makale', book: 'Kitap', book_chapter: 'Kitap Bölümü', conference: 'Bildiri', other: 'Diğer' },
    contact: 'İletişim', links: 'Bağlantılar',
  },
  en: {
    searchPlaceholder: 'Search publications, researchers, projects...',
    searchBtn: 'Search',
    heroLine1: 'Antalya Belek University',
    heroLine2: 'Academic Data System',
    statsLabels: ['Publications', 'Projects', 'Theses', 'Researchers'],
    annualStats: 'Annual Statistics',
    recentPubs: 'Recent Publications',
    viewAll: 'View all →',
    researchGroups: 'Research Groups',
    members: 'members',
    pubTypes: { article: 'Article', book: 'Book', book_chapter: 'Book Chapter', conference: 'Conference Paper', other: 'Other' },
    contact: 'Contact', links: 'Links',
  }
}

export default function HomePage() {
  const [lang, setLang] = useState(() => localStorage.getItem('lang') || 'tr')
  const [chartType, setChartType] = useState('publications')
  const [animatedStats, setAnimatedStats] = useState({ publications: 0, projects: 0, theses: 0, researchers: 0 })
  const [recentPubs, setRecentPubs] = useState([])
  const [recentPub, setRecentPub] = useState(null)
  const [recentAward, setRecentAward] = useState(null)
  const [recentEvent, setRecentEvent] = useState(null)
  const [groups, setGroups] = useState([])
  const [chartData, setChartData] = useState([])
  const tx = t[lang]

  useEffect(() => {
    Promise.all([
      fetch('/api/v1/publications/?page_size=1').then(r => r.json()),
      fetch('/api/v1/projects/?page_size=1').then(r => r.json()),
      fetch('/api/v1/theses/?page_size=1').then(r => r.json()),
      fetch('/api/v1/users/?user_type=academic&page_size=1').then(r => r.json()),
      fetch('/api/v1/publications/?page_size=4&ordering=-created_at').then(r => r.json()),
      fetch('/api/v1/research-groups/?page_size=4').then(r => r.json()),
      fetch('/api/v1/publications/stats-by-year/').then(r => r.json()),
      fetch('/api/v1/projects/stats-by-year/').then(r => r.json()),
      fetch('/api/v1/awards/?page_size=1&ordering=-created_at').then(r => r.json()),
      fetch('/api/v1/events/?page_size=1&ordering=-created_at').then(r => r.json()),
    ]).then(([pubs, projs, theses, users, recentPubsRes, groupsRes, pubStats, projStats, awardsRes, eventsRes]) => {
      const newStats = { publications: pubs.count || 0, projects: projs.count || 0, theses: theses.count || 0, researchers: users.count || 0 }
      setRecentPubs(recentPubsRes.results || [])
      setGroups(groupsRes.results || [])
      if (recentPubsRes.results?.[0]) setRecentPub(recentPubsRes.results[0])
      if (awardsRes.results?.[0]) setRecentAward(awardsRes.results[0])
      if (eventsRes.results?.[0]) setRecentEvent(eventsRes.results[0])
      const currentYear = new Date().getFullYear()
      const years = [currentYear-5, currentYear-4, currentYear-3, currentYear-2, currentYear-1, currentYear]
      setChartData(years.map(year => ({
        year: String(year),
        publications: (pubStats || []).find(p => p.year === year)?.count || 0,
        projects: (projStats || []).find(p => p.year === year)?.count || 0,
      })))
      const duration = 1500; const steps = 60; let step = 0
      const timer = setInterval(() => {
        step++
        setAnimatedStats({
          publications: Math.floor((newStats.publications * step) / steps),
          projects: Math.floor((newStats.projects * step) / steps),
          theses: Math.floor((newStats.theses * step) / steps),
          researchers: Math.floor((newStats.researchers * step) / steps),
        })
        if (step >= steps) clearInterval(timer)
      }, duration / steps)
      return () => clearInterval(timer)
    }).catch(() => {})
  }, [])

  const statsDisplay = [
    { key: 'publications', count: animatedStats.publications, icon: <BookOutlined />, color: '#8B0000' },
    { key: 'projects', count: animatedStats.projects, icon: <ProjectOutlined />, color: '#A50000' },
    { key: 'theses', count: animatedStats.theses, icon: <FileDoneOutlined />, color: '#C0392B' },
    { key: 'researchers', count: animatedStats.researchers, icon: <TeamOutlined />, color: '#E74C3C' },
  ]

  const handleSearch = (value) => {
    if (!value) return
    window.location.href = `/publications?search=${encodeURIComponent(value)}`
  }

  return (
    <div style={{ fontFamily: "'Georgia', serif", background: '#f8f8f6', minHeight: '100vh' }}>
      <Header lang={lang} setLang={setLang} />

      <section style={{ background: 'linear-gradient(135deg, #6B0000 0%, #8B0000 40%, #A50000 70%, #C0392B 100%)', padding: '80px 48px 60px', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(circle at 20% 50%, rgba(255,255,255,0.05) 0%, transparent 50%)' }} />
        <div style={{ maxWidth: 900, margin: '0 auto', position: 'relative', textAlign: 'center' }}>
          <h1 style={{ color: '#fff', fontWeight: 700, lineHeight: 1.2, margin: '0 0 40px', textShadow: '0 2px 20px rgba(0,0,0,0.3)' }}>
            <span style={{ display: 'block', fontSize: 42 }}>{tx.heroLine1}</span>
            <span style={{ display: 'block', fontSize: 42 }}>{tx.heroLine2}</span>
          </h1>
          <div style={{ maxWidth: 640, margin: '0 auto' }}>
            <Search placeholder={tx.searchPlaceholder} size="large" enterButton={<span style={{ fontFamily: 'Arial' }}>{tx.searchBtn}</span>} style={{ width: '100%' }} onSearch={handleSearch} />
          </div>
        </div>
      </section>

      <Slider recentPub={recentPub} recentAward={recentAward} recentEvent={recentEvent} />

      <section style={{ maxWidth: 1200, margin: '32px auto 0', padding: '0 48px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 20 }}>
          {statsDisplay.map((s) => (
            <div key={s.key} style={{ background: '#fff', borderRadius: 12, padding: '28px 24px', boxShadow: '0 4px 24px rgba(0,0,0,0.08)', borderTop: `4px solid ${s.color}`, transition: 'transform 0.2s, box-shadow 0.2s', cursor: 'pointer' }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 8px 32px rgba(139,0,0,0.15)' }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 24px rgba(0,0,0,0.08)' }}
            >
              <div style={{ fontSize: 28, color: s.color, marginBottom: 12 }}>{s.icon}</div>
              <div style={{ fontSize: 38, fontWeight: 800, color: '#1a1a1a', lineHeight: 1 }}>{s.count.toLocaleString()}</div>
              <div style={{ fontSize: 13, color: '#888', marginTop: 6, fontFamily: 'Arial' }}>{tx.statsLabels[statsDisplay.indexOf(s)]}</div>
            </div>
          ))}
        </div>
      </section>

      <section style={{ maxWidth: 1200, margin: '48px auto', padding: '0 48px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
          <div style={{ background: '#fff', borderRadius: 12, padding: 28, boxShadow: '0 4px 24px rgba(0,0,0,0.06)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
              <h3 style={{ fontSize: 16, fontWeight: 700, color: '#1a1a1a', margin: 0 }}>{tx.annualStats}</h3>
              <div style={{ display: 'flex', gap: 8 }}>
                {['publications', 'projects'].map(tp => (
                  <button key={tp} onClick={() => setChartType(tp)} style={{ background: chartType === tp ? '#8B0000' : '#f5f5f5', color: chartType === tp ? '#fff' : '#666', border: 'none', borderRadius: 4, padding: '4px 12px', cursor: 'pointer', fontSize: 12, fontFamily: 'Arial' }}>
                    {lang === 'tr' ? (tp === 'publications' ? 'Yayın' : 'Proje') : tp}
                  </button>
                ))}
              </div>
            </div>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={chartData}>
                <XAxis dataKey="year" tick={{ fontSize: 12, fontFamily: 'Arial' }} />
                <YAxis tick={{ fontSize: 12, fontFamily: 'Arial' }} />
                <Tooltip contentStyle={{ fontFamily: 'Arial', fontSize: 13, borderRadius: 8 }} />
                <Bar dataKey={chartType} radius={[4, 4, 0, 0]}>
                  {chartData.map((_, i) => <Cell key={i} fill={i === chartData.length - 1 ? '#8B0000' : '#dba8a8'} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div style={{ background: '#fff', borderRadius: 12, padding: 28, boxShadow: '0 4px 24px rgba(0,0,0,0.06)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <h3 style={{ fontSize: 16, fontWeight: 700, color: '#1a1a1a', margin: 0 }}>{tx.recentPubs}</h3>
              <a href="/publications" style={{ fontSize: 13, color: '#8B0000', textDecoration: 'none', fontFamily: 'Arial' }}>{tx.viewAll}</a>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {recentPubs.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '32px 0', color: '#aaa', fontFamily: 'Arial', fontSize: 14 }}>
                  {lang === 'tr' ? 'Henüz yayın eklenmemiş.' : 'No publications yet.'}
                </div>
              ) : recentPubs.map(pub => (
                <a key={pub.id} href={`/publications/${pub.id}`} style={{ padding: '12px 0', borderBottom: '1px solid #f0f0f0', cursor: 'pointer', textDecoration: 'none' }}>
                  <div style={{ fontSize: 14, fontWeight: 600, color: '#1a1a1a', lineHeight: 1.4, marginBottom: 4 }}>{pub.title}</div>
                  <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                    <span style={{ fontSize: 11, color: '#8B0000', background: '#fff0f0', padding: '2px 8px', borderRadius: 10, fontFamily: 'Arial' }}>{tx.pubTypes[pub.pub_type] || pub.pub_type}</span>
                    <span style={{ fontSize: 12, color: '#aaa', fontFamily: 'Arial', marginLeft: 'auto' }}>{pub.year}</span>
                  </div>
                </a>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section style={{ maxWidth: 1200, margin: '0 auto 64px', padding: '0 48px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
          <h2 style={{ fontSize: 22, fontWeight: 700, color: '#1a1a1a', margin: 0 }}>{tx.researchGroups}</h2>
          <a href="/groups" style={{ fontSize: 14, color: '#8B0000', textDecoration: 'none', fontFamily: 'Arial' }}>{tx.viewAll}</a>
        </div>
        {groups.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '32px 0', color: '#aaa', fontFamily: 'Arial' }}>
            {lang === 'tr' ? 'Henüz araştırma grubu eklenmemiş.' : 'No research groups yet.'}
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 20 }}>
            {groups.map(group => (
              <a key={group.id} href={`/groups/${group.id}`} style={{ background: '#fff', borderRadius: 12, padding: '24px 20px', boxShadow: '0 4px 24px rgba(0,0,0,0.06)', cursor: 'pointer', transition: 'transform 0.2s', borderLeft: '3px solid #8B0000', textDecoration: 'none' }}
                onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-3px)'}
                onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
              >
                <div style={{ width: 40, height: 40, background: '#fff0f0', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 14 }}>
                  <ExperimentOutlined style={{ color: '#8B0000', fontSize: 18 }} />
                </div>
                <div style={{ fontSize: 14, fontWeight: 700, color: '#1a1a1a', lineHeight: 1.3, marginBottom: 8 }}>{lang === 'tr' ? group.name : (group.name_en || group.name)}</div>
                {group.members_count > 0 && <div style={{ fontSize: 12, color: '#8B0000', fontFamily: 'Arial', fontWeight: 600 }}>{group.members_count} {tx.members}</div>}
              </a>
            ))}
          </div>
        )}
      </section>

      <footer style={{ background: '#555', color: '#ccc', fontFamily: 'Arial', fontSize: 13 }}>
        <div style={{ borderBottom: '1px solid #666', padding: '40px 48px' }}>
          <div style={{ maxWidth: 1200, margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 48 }}>
            <div>
              <h4 style={{ color: '#fff', fontSize: 15, fontWeight: 700, marginBottom: 16 }}>{tx.contact}</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                <a href="tel:4441264" style={{ color: '#ccc', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 10 }}><PhoneOutlined style={{ color: '#e87474' }} /> 444 1 264</a>
                <a href="mailto:info@belek.edu.tr" style={{ color: '#ccc', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 10 }}><MailOutlined style={{ color: '#e87474' }} /> info@belek.edu.tr</a>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}><EnvironmentOutlined style={{ color: '#e87474', marginTop: 2 }} /><span>Kadriye Mah. Celal Bayar Cad. No:5-6<br />Serik/ANTALYA, 07525</span></div>
              </div>
            </div>
            <div>
              <h4 style={{ color: '#fff', fontSize: 15, fontWeight: 700, marginBottom: 16 }}>{tx.links}</h4>
              <a href="https://www.belek.edu.tr" target="_blank" rel="noreferrer" style={{ color: '#ccc', textDecoration: 'none' }}
                onMouseEnter={e => e.target.style.color = '#fff'} onMouseLeave={e => e.target.style.color = '#ccc'}
              >belek.edu.tr</a>
            </div>
          </div>
        </div>
        <div style={{ padding: '16px 48px', textAlign: 'center', color: '#999', fontSize: 12, background: '#444' }}>
          © {new Date().getFullYear()} Antalya Belek Üniversitesi
        </div>
      </footer>
    </div>
  )
}