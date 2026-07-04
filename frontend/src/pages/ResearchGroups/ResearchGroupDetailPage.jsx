import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { TeamOutlined, ExperimentOutlined, BookOutlined, ProjectOutlined, BulbOutlined } from '@ant-design/icons'
import { Tag } from 'antd'
import Header from '../../components/Header.jsx'

const t = {
  tr: { loading: 'Yükleniyor...', notFound: 'Grup bulunamadı.', members: 'Üyeler', collaborations: 'Ortak Çalışmalar', noData: 'Henüz veri yok.', back: '← Araştırma Grupları', active: 'Aktif', publications: 'Yayınlar', projects: 'Projeler', patents: 'Patentler' },
  en: { loading: 'Loading...', notFound: 'Group not found.', members: 'Members', collaborations: 'Joint Works', noData: 'No data yet.', back: '← Research Groups', active: 'Active', publications: 'Publications', projects: 'Projects', patents: 'Patents' }
}

const pubTypeColors = { article: '#8B0000', book: '#1a5276', book_chapter: '#1e8449', conference: '#6c3483', other: '#784212' }
const pubTypeLabels = { article: 'Makale', book: 'Kitap', book_chapter: 'Kitap Bölümü', conference: 'Bildiri', other: 'Diğer' }
const statusLabels = { ongoing: 'Devam Ediyor', completed: 'Tamamlandı', cancelled: 'İptal' }
const statusColors = { ongoing: '#1e8449', completed: '#888', cancelled: '#cf1322' }

function Avatar({ name, photo, size = 48 }) {
  if (photo) return <img src={photo} alt={name} style={{ width: size, height: size, borderRadius: '50%', objectFit: 'cover', flexShrink: 0 }} />
  const initials = name.split(' ').filter(w => !w.includes('.')).slice(0, 2).map(w => w[0]).join('')
  return <div style={{ width: size, height: size, borderRadius: '50%', background: 'linear-gradient(135deg, #8B0000, #C0392B)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: size / 3, fontWeight: 700, flexShrink: 0 }}>{initials}</div>
}

export default function ResearchGroupDetailPage() {
  const [lang, setLang] = useState(() => localStorage.getItem('lang') || 'tr')
  const [group, setGroup] = useState(null)
  const [members, setMembers] = useState([])
  const [publications, setPublications] = useState([])
  const [projects, setProjects] = useState([])
  const [patents, setPatents] = useState([])
  const [activeTab, setActiveTab] = useState('members')
  const [loading, setLoading] = useState(true)
  const { id } = useParams()
  const tx = t[lang]

  useEffect(() => { fetchData() }, [id])

  const fetchData = async () => {
    setLoading(true)
    try {
      const res = await fetch(`/api/v1/research-groups/${id}/`)
      if (res.ok) {
        const data = await res.json()
        setGroup(data)
        if (data.members && data.members.length > 0) {
          const memberDetails = await Promise.all(
            data.members.map(memberId =>
              fetch(`/api/v1/users/${memberId}/`).then(r => r.ok ? r.json() : null)
            )
          )
          setMembers(memberDetails.filter(Boolean))
        }
      }
      const pubRes = await fetch(`/api/v1/research-groups/${id}/publications/`)
      if (pubRes.ok) { const d = await pubRes.json(); setPublications(Array.isArray(d) ? d : (d.results || [])) }
      const projRes = await fetch(`/api/v1/research-groups/${id}/projects/`)
      if (projRes.ok) { const d = await projRes.json(); setProjects(Array.isArray(d) ? d : (d.results || [])) }
      const patRes = await fetch(`/api/v1/research-groups/${id}/patents/`)
      if (patRes.ok) { const d = await patRes.json(); setPatents(Array.isArray(d) ? d : (d.results || [])) }
    } catch {}
    setLoading(false)
  }

  const totalCollaborations = publications.length + projects.length + patents.length

  const tabs = [
    { key: 'members', label: tx.members, count: members.length, icon: <TeamOutlined /> },
    { key: 'collaborations', label: tx.collaborations, count: totalCollaborations, icon: <ExperimentOutlined /> },
  ]

  if (loading) return <div style={{ textAlign: 'center', padding: 64 }}>{tx.loading}</div>
  if (!group) return <div style={{ textAlign: 'center', padding: 64 }}>{tx.notFound}</div>

  return (
    <div style={{ fontFamily: "'Georgia', serif", background: '#f8f8f6', minHeight: '100vh' }}>
      <Header activeIndex={3} lang={lang} setLang={setLang} />

      <div style={{ background: 'linear-gradient(135deg, #6B0000, #8B0000)', padding: '40px 48px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <a href="/groups" style={{ color: 'rgba(255,255,255,0.7)', fontFamily: 'Arial', fontSize: 13, textDecoration: 'none', display: 'block', marginBottom: 24 }}>{tx.back}</a>
          <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
            <div style={{ width: 72, height: 72, background: 'rgba(255,255,255,0.15)', borderRadius: 16, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <ExperimentOutlined style={{ color: '#fff', fontSize: 32 }} />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
                <h1 style={{ color: '#fff', fontSize: 28, fontWeight: 700, margin: 0 }}>{lang === 'tr' ? group.name : (group.name_en || group.name)}</h1>
                {group.is_active && <span style={{ background: 'rgba(255,255,255,0.2)', color: '#fff', fontSize: 11, fontFamily: 'Arial', padding: '2px 10px', borderRadius: 10 }}>{tx.active}</span>}
              </div>
            </div>
          </div>
          {group.description && <p style={{ color: 'rgba(255,255,255,0.8)', fontFamily: 'Arial', fontSize: 14, marginTop: 20, lineHeight: 1.7, maxWidth: 800 }}>{lang === 'tr' ? group.description : (group.description_en || group.description)}</p>}
          <div style={{ display: 'flex', gap: 32, marginTop: 24 }}>
            {tabs.map(tab => (
              <div key={tab.key} style={{ textAlign: 'center' }}>
                <div style={{ color: '#fff', fontSize: 24, fontWeight: 800 }}>{tab.count}</div>
                <div style={{ color: 'rgba(255,255,255,0.7)', fontFamily: 'Arial', fontSize: 12 }}>{tab.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div style={{ background: '#fff', borderBottom: '1px solid #f0f0f0', padding: '0 48px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', display: 'flex' }}>
          {tabs.map(tab => (
            <button key={tab.key} onClick={() => setActiveTab(tab.key)} style={{ background: 'none', border: 'none', padding: '16px 24px', cursor: 'pointer', fontFamily: 'Arial', fontSize: 14, fontWeight: activeTab === tab.key ? 700 : 400, color: activeTab === tab.key ? '#8B0000' : '#666', borderBottom: activeTab === tab.key ? '2px solid #8B0000' : '2px solid transparent', display: 'flex', alignItems: 'center', gap: 8 }}>
              {tab.icon} {tab.label} ({tab.count})
            </button>
          ))}
        </div>
      </div>

      <div style={{ maxWidth: 1200, margin: '32px auto 64px', padding: '0 48px' }}>
        {activeTab === 'members' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20 }}>
            {members.length === 0 ? <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: 64, color: '#aaa', fontFamily: 'Arial' }}>{tx.noData}</div> :
              members.map(member => (
                <a key={member.id} href={`/researcher/${member.id}`} style={{ background: '#fff', borderRadius: 12, padding: '20px', boxShadow: '0 2px 12px rgba(0,0,0,0.06)', display: 'flex', gap: 16, alignItems: 'center', textDecoration: 'none' }}
                  onMouseEnter={e => e.currentTarget.style.boxShadow = '0 4px 24px rgba(139,0,0,0.12)'}
                  onMouseLeave={e => e.currentTarget.style.boxShadow = '0 2px 12px rgba(0,0,0,0.06)'}
                >
                  <Avatar name={`${member.first_name} ${member.last_name}`} photo={member.profile_image_url} />
                  <div>
                    {member.title && <div style={{ fontSize: 11, color: '#8B0000', fontFamily: 'Arial', fontWeight: 600, marginBottom: 2 }}>{member.title}</div>}
                    <div style={{ fontSize: 14, fontWeight: 700, color: '#1a1a1a' }}>{member.first_name} {member.last_name}</div>
                    {member.department && <div style={{ fontSize: 12, color: '#888', fontFamily: 'Arial' }}>{member.department}</div>}
                  </div>
                </a>
              ))
            }
          </div>
        )}

        {activeTab === 'collaborations' && (
          <div>
            {publications.length > 0 && (
              <div style={{ marginBottom: 32 }}>
                <h3 style={{ fontSize: 16, fontWeight: 700, color: '#1a1a1a', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
                  <BookOutlined style={{ color: '#8B0000' }} /> {tx.publications} ({publications.length})
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {publications.map(pub => (
                    <a key={pub.id} href={`/publications/${pub.id}`} style={{ background: '#fff', borderRadius: 12, padding: '20px 24px', boxShadow: '0 2px 12px rgba(0,0,0,0.06)', borderLeft: `4px solid ${pubTypeColors[pub.pub_type] || '#8B0000'}`, textDecoration: 'none', display: 'block' }}
                      onMouseEnter={e => e.currentTarget.style.boxShadow = '0 4px 24px rgba(139,0,0,0.12)'}
                      onMouseLeave={e => e.currentTarget.style.boxShadow = '0 2px 12px rgba(0,0,0,0.06)'}
                    >
                      <div style={{ display: 'flex', gap: 8, marginBottom: 6 }}>
                        <Tag color={pubTypeColors[pub.pub_type]} style={{ fontSize: 11 }}>{pubTypeLabels[pub.pub_type] || pub.pub_type}</Tag>
                        <span style={{ fontSize: 12, color: '#aaa', fontFamily: 'Arial' }}>{pub.year}</span>
                      </div>
                      <h4 style={{ fontSize: 15, fontWeight: 700, color: '#1a1a1a', margin: '0 0 4px' }}>{pub.title}</h4>
                      {pub.journal && <div style={{ fontSize: 13, color: '#666', fontFamily: 'Arial' }}>{pub.journal}</div>}
                    </a>
                  ))}
                </div>
              </div>
            )}

            {projects.length > 0 && (
              <div style={{ marginBottom: 32 }}>
                <h3 style={{ fontSize: 16, fontWeight: 700, color: '#1a1a1a', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
                  <ProjectOutlined style={{ color: '#1a5276' }} /> {tx.projects} ({projects.length})
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {projects.map(proj => (
                    <a key={proj.id} href={`/projects/${proj.id}`} style={{ background: '#fff', borderRadius: 12, padding: '20px 24px', boxShadow: '0 2px 12px rgba(0,0,0,0.06)', borderLeft: '4px solid #1a5276', textDecoration: 'none', display: 'block' }}
                      onMouseEnter={e => e.currentTarget.style.boxShadow = '0 4px 24px rgba(26,82,118,0.12)'}
                      onMouseLeave={e => e.currentTarget.style.boxShadow = '0 2px 12px rgba(0,0,0,0.06)'}
                    >
                      <div style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
                        <span style={{ background: '#1a5276', color: '#fff', padding: '2px 10px', borderRadius: 20, fontSize: 11, fontFamily: 'Arial', fontWeight: 600 }}>{proj.project_type?.toUpperCase()}</span>
                        <span style={{ background: statusColors[proj.status] || '#888', color: '#fff', padding: '2px 10px', borderRadius: 20, fontSize: 11, fontFamily: 'Arial' }}>{statusLabels[proj.status] || proj.status}</span>
                      </div>
                      <h4 style={{ fontSize: 15, fontWeight: 700, color: '#1a1a1a', margin: '0 0 4px' }}>{proj.title}</h4>
                      <div style={{ fontSize: 13, color: '#666', fontFamily: 'Arial' }}>{proj.start_date}{proj.end_date ? ` — ${proj.end_date}` : ''}</div>
                    </a>
                  ))}
                </div>
              </div>
            )}

            {patents.length > 0 && (
              <div>
                <h3 style={{ fontSize: 16, fontWeight: 700, color: '#1a1a1a', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
                  <BulbOutlined style={{ color: '#6c3483' }} /> {tx.patents} ({patents.length})
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {patents.map(patent => (
                    <a key={patent.id} href={`/patents/${patent.id}`} style={{ background: '#fff', borderRadius: 12, padding: '20px 24px', boxShadow: '0 2px 12px rgba(0,0,0,0.06)', borderLeft: '4px solid #6c3483', textDecoration: 'none', display: 'block' }}
                      onMouseEnter={e => e.currentTarget.style.boxShadow = '0 4px 24px rgba(108,52,131,0.12)'}
                      onMouseLeave={e => e.currentTarget.style.boxShadow = '0 2px 12px rgba(0,0,0,0.06)'}
                    >
                      <h4 style={{ fontSize: 15, fontWeight: 700, color: '#1a1a1a', margin: '0 0 4px' }}>{patent.title}</h4>
                      {patent.patent_no && <div style={{ fontSize: 13, color: '#666', fontFamily: 'Arial' }}>No: {patent.patent_no}</div>}
                    </a>
                  ))}
                </div>
              </div>
            )}

            {publications.length === 0 && projects.length === 0 && patents.length === 0 && (
              <div style={{ textAlign: 'center', padding: 64, color: '#aaa', fontFamily: 'Arial' }}>{tx.noData}</div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}