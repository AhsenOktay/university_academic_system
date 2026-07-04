import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { Tag } from 'antd'
import { CalendarOutlined, DollarOutlined } from '@ant-design/icons'
import Header from '../../components/Header.jsx'

const t = {
  tr: {
    loading: 'Yükleniyor...', notFound: 'Proje bulunamadı.', back: '← Projeler',
    description: 'Açıklama', members: 'Proje Üyeleri', budget: 'Bütçe', period: 'Süre',
    types: { tubitak: 'TÜBİTAK', bap: 'BAP', eu: 'AB Projesi', industry: 'Sanayi', other: 'Diğer' },
    statuses: { ongoing: 'Devam Ediyor', completed: 'Tamamlandı', cancelled: 'İptal' },
  },
  en: {
    loading: 'Loading...', notFound: 'Project not found.', back: '← Projects',
    description: 'Description', members: 'Project Members', budget: 'Budget', period: 'Period',
    types: { tubitak: 'TÜBİTAK', bap: 'BAP', eu: 'EU Project', industry: 'Industry', other: 'Other' },
    statuses: { ongoing: 'Ongoing', completed: 'Completed', cancelled: 'Cancelled' },
  }
}

const typeColors = { tubitak: '#8B0000', bap: '#1a5276', eu: '#1e8449', industry: '#6c3483', other: '#784212' }
const statusColors = { ongoing: '#27ae60', completed: '#2980b9', cancelled: '#e74c3c' }

function Avatar({ name, photo, size = 40 }) {
  if (photo) return <img src={photo} alt={name} style={{ width: size, height: size, borderRadius: '50%', objectFit: 'cover', flexShrink: 0 }} />
  const initials = name.split(' ').filter(w => !w.includes('.')).slice(0, 2).map(w => w[0]).join('')
  return <div style={{ width: size, height: size, borderRadius: '50%', background: 'linear-gradient(135deg, #8B0000, #C0392B)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: size / 3, fontWeight: 700, flexShrink: 0 }}>{initials}</div>
}

export default function ProjectDetailPage() {
  const [lang, setLang] = useState(() => localStorage.getItem('lang') || 'tr')
  const [project, setProject] = useState(null)
  const [memberDetails, setMemberDetails] = useState([])
  const [loading, setLoading] = useState(true)
  const { id } = useParams()
  const tx = t[lang]

  useEffect(() => {
    fetch(`/api/v1/projects/${id}/`)
      .then(r => r.ok ? r.json() : null)
      .then(async d => {
        if (d) {
          setProject(d)
          if (d.members && d.members.length > 0) {
            const details = await Promise.all(
              d.members.map(mid => fetch(`/api/v1/users/${mid}/`).then(r => r.ok ? r.json() : null))
            )
            setMemberDetails(details.filter(Boolean))
          }
        }
        setLoading(false)
      })
  }, [id])

  if (loading) return <div style={{ textAlign: 'center', padding: 64, fontFamily: 'Arial' }}>{tx.loading}</div>
  if (!project) return <div style={{ textAlign: 'center', padding: 64, fontFamily: 'Arial' }}>{tx.notFound}</div>

  return (
    <div style={{ fontFamily: "'Georgia', serif", background: '#f8f8f6', minHeight: '100vh' }}>
      <Header activeIndex={1} lang={lang} setLang={setLang} />

      <div style={{ background: 'linear-gradient(135deg, #6B0000, #8B0000)', padding: '40px 48px' }}>
        <div style={{ maxWidth: 900, margin: '0 auto' }}>
          <a href="/projects" style={{ color: 'rgba(255,255,255,0.7)', fontFamily: 'Arial', fontSize: 13, textDecoration: 'none', display: 'block', marginBottom: 20 }}>{tx.back}</a>
          <div style={{ display: 'flex', gap: 12, marginBottom: 16 }}>
            <Tag color={typeColors[project.project_type] || '#8B0000'} style={{ fontSize: 12, borderRadius: 4 }}>{tx.types[project.project_type] || project.project_type}</Tag>
            <Tag color={statusColors[project.status] || '#888'} style={{ fontSize: 12, borderRadius: 4 }}>{tx.statuses[project.status] || project.status}</Tag>
          </div>
          <h1 style={{ color: '#fff', fontSize: 28, fontWeight: 700, margin: '0 0 8px', lineHeight: 1.3 }}>{project.title}</h1>
          {project.title_en && <div style={{ color: 'rgba(255,255,255,0.7)', fontFamily: 'Arial', fontSize: 15, fontStyle: 'italic' }}>{project.title_en}</div>}
        </div>
      </div>

      <div style={{ maxWidth: 900, margin: '40px auto 64px', padding: '0 48px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 24 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            {project.description && (
              <div style={{ background: '#fff', borderRadius: 12, padding: '28px', boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
                <h3 style={{ fontSize: 16, fontWeight: 700, color: '#1a1a1a', margin: '0 0 16px' }}>{tx.description}</h3>
                <p style={{ fontSize: 14, color: '#555', fontFamily: 'Arial', lineHeight: 1.8, margin: 0 }}>{project.description}</p>
              </div>
            )}
            {memberDetails.length > 0 && (
              <div style={{ background: '#fff', borderRadius: 12, padding: '28px', boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
                <h3 style={{ fontSize: 16, fontWeight: 700, color: '#1a1a1a', margin: '0 0 16px' }}>{tx.members}</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {memberDetails.map(member => (
                    <a key={member.id} href={`/researcher/${member.id}`} style={{ display: 'flex', alignItems: 'center', gap: 12, textDecoration: 'none' }}>
                      <Avatar name={`${member.first_name} ${member.last_name}`} photo={member.profile_image_url} />
                      <div>
                        <div style={{ fontSize: 14, fontWeight: 600, color: '#1a1a1a' }}>
                          {member.title ? `${member.title} ` : ''}{member.first_name} {member.last_name}
                        </div>
                        {member.department && <div style={{ fontSize: 12, color: '#888', fontFamily: 'Arial' }}>{member.department}</div>}
                      </div>
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {project.start_date && (
              <div style={{ background: '#fff', borderRadius: 12, padding: '24px', boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
                <h4 style={{ fontSize: 14, fontWeight: 700, color: '#888', fontFamily: 'Arial', margin: '0 0 12px', textTransform: 'uppercase', letterSpacing: 1 }}>{tx.period}</h4>
                <div style={{ fontSize: 14, color: '#555', fontFamily: 'Arial', display: 'flex', alignItems: 'center', gap: 6 }}>
                  <CalendarOutlined style={{ color: '#8B0000' }} /> {project.start_date} – {project.end_date || '...'}
                </div>
              </div>
            )}
            {project.budget && (
              <div style={{ background: '#fff', borderRadius: 12, padding: '24px', boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
                <h4 style={{ fontSize: 14, fontWeight: 700, color: '#888', fontFamily: 'Arial', margin: '0 0 12px', textTransform: 'uppercase', letterSpacing: 1 }}>{tx.budget}</h4>
                <div style={{ fontSize: 18, fontWeight: 700, color: '#1a1a1a', display: 'flex', alignItems: 'center', gap: 6 }}>
                  <DollarOutlined style={{ color: '#8B0000' }} /> {Number(project.budget).toLocaleString()} ₺
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}