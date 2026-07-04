import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { Tag } from 'antd'
import { CalendarOutlined, EnvironmentOutlined } from '@ant-design/icons'
import Header from '../../components/Header.jsx'

const t = {
  tr: {
    loading: 'Yükleniyor...', notFound: 'Etkinlik bulunamadı.', back: '← Etkinlikler',
    description: 'Açıklama', organizer: 'Organizatör', period: 'Tarih', location: 'Yer', role: 'Rol',
    types: { conference: 'Konferans', seminar: 'Seminer', workshop: 'Workshop', panel: 'Panel', symposium: 'Sempozyum', other: 'Diğer' },
  },
  en: {
    loading: 'Loading...', notFound: 'Event not found.', back: '← Events',
    description: 'Description', organizer: 'Organizer', period: 'Date', location: 'Location', role: 'Role',
    types: { conference: 'Conference', seminar: 'Seminar', workshop: 'Workshop', panel: 'Panel', symposium: 'Symposium', other: 'Other' },
  }
}

const typeColors = { conference: '#8B0000', seminar: '#1a5276', workshop: '#1e8449', panel: '#6c3483', symposium: '#784212', other: '#0e6655' }

function Avatar({ name, photo, size = 40 }) {
  if (photo) return <img src={photo} alt={name} style={{ width: size, height: size, borderRadius: '50%', objectFit: 'cover', flexShrink: 0 }} />
  const initials = (name || '').split(' ').filter(w => !w.includes('.')).slice(0, 2).map(w => w[0]).join('')
  return <div style={{ width: size, height: size, borderRadius: '50%', background: 'linear-gradient(135deg, #8B0000, #C0392B)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: size / 3, fontWeight: 700, flexShrink: 0 }}>{initials}</div>
}

export default function EventDetailPage() {
  const [lang, setLang] = useState(() => localStorage.getItem('lang') || 'tr')
  const [event, setEvent] = useState(null)
  const [organizerDetail, setOrganizerDetail] = useState(null)
  const [loading, setLoading] = useState(true)
  const { id } = useParams()
  const tx = t[lang]

  useEffect(() => {
    fetch(`/api/v1/events/${id}/`)
      .then(r => r.ok ? r.json() : null)
      .then(async d => {
        if (d) {
          setEvent(d)
          if (d.organizer) {
            const org = await fetch(`/api/v1/users/${d.organizer}/`).then(r => r.ok ? r.json() : null)
            setOrganizerDetail(org)
          }
        }
        setLoading(false)
      })
  }, [id])

  if (loading) return <div style={{ textAlign: 'center', padding: 64, fontFamily: 'Arial' }}>{tx.loading}</div>
  if (!event) return <div style={{ textAlign: 'center', padding: 64, fontFamily: 'Arial' }}>{tx.notFound}</div>

  return (
    <div style={{ fontFamily: "'Georgia', serif", background: '#f8f8f6', minHeight: '100vh' }}>
      <Header lang={lang} setLang={setLang} />

      <div style={{ background: 'linear-gradient(135deg, #6B0000, #8B0000)', padding: '40px 48px' }}>
        <div style={{ maxWidth: 900, margin: '0 auto' }}>
          <a href="/events" style={{ color: 'rgba(255,255,255,0.7)', fontFamily: 'Arial', fontSize: 13, textDecoration: 'none', display: 'block', marginBottom: 20 }}>{tx.back}</a>
          <div style={{ marginBottom: 12 }}>
            <Tag color={typeColors[event.event_type] || '#8B0000'} style={{ fontSize: 12, borderRadius: 4 }}>{tx.types[event.event_type] || event.event_type}</Tag>
          </div>
          <h1 style={{ color: '#fff', fontSize: 28, fontWeight: 700, margin: '0 0 8px' }}>{event.title}</h1>
          {event.title_en && <div style={{ color: 'rgba(255,255,255,0.7)', fontFamily: 'Arial', fontSize: 15, fontStyle: 'italic' }}>{event.title_en}</div>}
        </div>
      </div>

      <div style={{ maxWidth: 900, margin: '40px auto 64px', padding: '0 48px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 24 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            {event.description && (
              <div style={{ background: '#fff', borderRadius: 12, padding: '28px', boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
                <h3 style={{ fontSize: 16, fontWeight: 700, color: '#1a1a1a', margin: '0 0 16px' }}>{tx.description}</h3>
                <p style={{ fontSize: 14, color: '#555', fontFamily: 'Arial', lineHeight: 1.8, margin: 0 }}>{event.description}</p>
              </div>
            )}
            {organizerDetail && (
              <div style={{ background: '#fff', borderRadius: 12, padding: '28px', boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
                <h3 style={{ fontSize: 16, fontWeight: 700, color: '#1a1a1a', margin: '0 0 16px' }}>{tx.organizer}</h3>
                <a href={`/researcher/${organizerDetail.id}`} style={{ display: 'flex', alignItems: 'center', gap: 12, textDecoration: 'none' }}>
                  <Avatar name={`${organizerDetail.first_name} ${organizerDetail.last_name}`} photo={organizerDetail.profile_image_url} />
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 600, color: '#1a1a1a' }}>{organizerDetail.title ? `${organizerDetail.title} ` : ''}{organizerDetail.first_name} {organizerDetail.last_name}</div>
                    {organizerDetail.department && <div style={{ fontSize: 12, color: '#888', fontFamily: 'Arial' }}>{organizerDetail.department}</div>}
                  </div>
                </a>
              </div>
            )}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {(event.start_date || event.end_date) && (
              <div style={{ background: '#fff', borderRadius: 12, padding: '24px', boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
                <h4 style={{ fontSize: 14, fontWeight: 700, color: '#888', fontFamily: 'Arial', margin: '0 0 12px', textTransform: 'uppercase', letterSpacing: 1 }}>{tx.period}</h4>
                <div style={{ fontSize: 14, color: '#555', fontFamily: 'Arial', display: 'flex', alignItems: 'center', gap: 6 }}>
                  <CalendarOutlined style={{ color: '#8B0000' }} /> {event.start_date}{event.end_date && event.end_date !== event.start_date ? ` — ${event.end_date}` : ''}
                </div>
              </div>
            )}
            {event.location && (
              <div style={{ background: '#fff', borderRadius: 12, padding: '24px', boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
                <h4 style={{ fontSize: 14, fontWeight: 700, color: '#888', fontFamily: 'Arial', margin: '0 0 12px', textTransform: 'uppercase', letterSpacing: 1 }}>{tx.location}</h4>
                <div style={{ fontSize: 14, color: '#555', fontFamily: 'Arial', display: 'flex', alignItems: 'center', gap: 6 }}>
                  <EnvironmentOutlined style={{ color: '#8B0000' }} /> {event.location}
                </div>
              </div>
            )}
            {event.role && (
              <div style={{ background: '#fff', borderRadius: 12, padding: '24px', boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
                <h4 style={{ fontSize: 14, fontWeight: 700, color: '#888', fontFamily: 'Arial', margin: '0 0 12px', textTransform: 'uppercase', letterSpacing: 1 }}>{tx.role}</h4>
                <div style={{ fontSize: 14, color: '#555', fontFamily: 'Arial' }}>{event.role}</div>
              </div>
            )}

            {event.url && (
              <div style={{ background: '#fff', borderRadius: 12, padding: '24px', boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
                <h4 style={{ fontSize: 14, fontWeight: 700, color: '#888', fontFamily: 'Arial', margin: '0 0 12px', textTransform: 'uppercase', letterSpacing: 1 }}>Bağlantı</h4>
                <a href={event.url} target="_blank" rel="noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: '#8B0000', color: '#fff', padding: '8px 16px', borderRadius: 8, fontFamily: 'Arial', fontSize: 13, fontWeight: 600, textDecoration: 'none' }}>
                    Etkinliğe Git →
                </a>
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  )
}