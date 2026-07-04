import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { BulbOutlined, CalendarOutlined } from '@ant-design/icons'
import Header from '../../components/Header.jsx'

const t = {
  tr: {
    loading: 'Yükleniyor...', notFound: 'Patent bulunamadı.', back: '← Patentler',
    description: 'Açıklama', inventors: 'Mucitler', patentNo: 'Patent No',
    applicationDate: 'Başvuru Tarihi', grantDate: 'Onay Tarihi', status: 'Durum',
    statuses: { applied: 'Başvuru Yapıldı', pending: 'İncelemede', granted: 'Onaylandı', rejected: 'Reddedildi' },
  },
  en: {
    loading: 'Loading...', notFound: 'Patent not found.', back: '← Patents',
    description: 'Description', inventors: 'Inventors', patentNo: 'Patent No',
    applicationDate: 'Application Date', grantDate: 'Grant Date', status: 'Status',
    statuses: { applied: 'Applied', pending: 'Pending', granted: 'Granted', rejected: 'Rejected' },
  }
}

const statusColors = { applied: '#1a5276', pending: '#784212', granted: '#1e8449', rejected: '#cf1322' }

function Avatar({ name, photo, size = 40 }) {
  if (photo) return <img src={photo} alt={name} style={{ width: size, height: size, borderRadius: '50%', objectFit: 'cover', flexShrink: 0 }} />
  const initials = (name || '').split(' ').filter(w => !w.includes('.')).slice(0, 2).map(w => w[0]).join('')
  return <div style={{ width: size, height: size, borderRadius: '50%', background: 'linear-gradient(135deg, #8B0000, #C0392B)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: size / 3, fontWeight: 700, flexShrink: 0 }}>{initials}</div>
}

export default function PatentDetailPage() {
  const [lang, setLang] = useState(() => localStorage.getItem('lang') || 'tr')
  const [patent, setPatent] = useState(null)
  const [inventorDetails, setInventorDetails] = useState([])
  const [loading, setLoading] = useState(true)
  const { id } = useParams()
  const tx = t[lang]

  useEffect(() => {
    fetch(`/api/v1/patents/${id}/`)
      .then(r => r.ok ? r.json() : null)
      .then(async d => {
        if (d) {
          setPatent(d)
          if (d.inventors && d.inventors.length > 0) {
            const details = await Promise.all(
              d.inventors.map(inv => fetch(`/api/v1/users/${inv}/`).then(r => r.ok ? r.json() : null))
            )
            setInventorDetails(details.filter(Boolean))
          }
        }
        setLoading(false)
      })
  }, [id])

  if (loading) return <div style={{ textAlign: 'center', padding: 64, fontFamily: 'Arial' }}>{tx.loading}</div>
  if (!patent) return <div style={{ textAlign: 'center', padding: 64, fontFamily: 'Arial' }}>{tx.notFound}</div>

  return (
    <div style={{ fontFamily: "'Georgia', serif", background: '#f8f8f6', minHeight: '100vh' }}>
      <Header lang={lang} setLang={setLang} />

      <div style={{ background: 'linear-gradient(135deg, #6B0000, #8B0000)', padding: '40px 48px' }}>
        <div style={{ maxWidth: 900, margin: '0 auto' }}>
          <a href="/patents" style={{ color: 'rgba(255,255,255,0.7)', fontFamily: 'Arial', fontSize: 13, textDecoration: 'none', display: 'block', marginBottom: 20 }}>{tx.back}</a>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 8 }}>
            <BulbOutlined style={{ color: '#fff', fontSize: 28 }} />
            <div>
              <h1 style={{ color: '#fff', fontSize: 28, fontWeight: 700, margin: 0 }}>{patent.title}</h1>
              {patent.patent_no && <div style={{ color: 'rgba(255,255,255,0.7)', fontFamily: 'Arial', fontSize: 14, marginTop: 4 }}>No: {patent.patent_no}</div>}
            </div>
          </div>
          {patent.status && (
            <span style={{ background: statusColors[patent.status] || '#6c3483', color: '#fff', padding: '3px 12px', borderRadius: 20, fontSize: 12, fontFamily: 'Arial', marginTop: 8, display: 'inline-block' }}>
              {tx.statuses[patent.status] || patent.status}
            </span>
          )}
        </div>
      </div>

      <div style={{ maxWidth: 900, margin: '40px auto 64px', padding: '0 48px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 24 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            {patent.description && (
              <div style={{ background: '#fff', borderRadius: 12, padding: '28px', boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
                <h3 style={{ fontSize: 16, fontWeight: 700, color: '#1a1a1a', margin: '0 0 16px' }}>{tx.description}</h3>
                <p style={{ fontSize: 14, color: '#555', fontFamily: 'Arial', lineHeight: 1.8, margin: 0 }}>{patent.description}</p>
              </div>
            )}
            {inventorDetails.length > 0 && (
              <div style={{ background: '#fff', borderRadius: 12, padding: '28px', boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
                <h3 style={{ fontSize: 16, fontWeight: 700, color: '#1a1a1a', margin: '0 0 16px' }}>{tx.inventors}</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {inventorDetails.map(inv => (
                    <a key={inv.id} href={`/researcher/${inv.id}`} style={{ display: 'flex', alignItems: 'center', gap: 12, textDecoration: 'none' }}>
                      <Avatar name={`${inv.first_name} ${inv.last_name}`} photo={inv.profile_image_url} />
                      <div>
                        <div style={{ fontSize: 14, fontWeight: 600, color: '#1a1a1a' }}>{inv.title ? `${inv.title} ` : ''}{inv.first_name} {inv.last_name}</div>
                        {inv.department && <div style={{ fontSize: 12, color: '#888', fontFamily: 'Arial' }}>{inv.department}</div>}
                      </div>
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {patent.application_date && (
              <div style={{ background: '#fff', borderRadius: 12, padding: '24px', boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
                <h4 style={{ fontSize: 14, fontWeight: 700, color: '#888', fontFamily: 'Arial', margin: '0 0 12px', textTransform: 'uppercase', letterSpacing: 1 }}>{tx.applicationDate}</h4>
                <div style={{ fontSize: 14, color: '#555', fontFamily: 'Arial', display: 'flex', alignItems: 'center', gap: 6 }}>
                  <CalendarOutlined style={{ color: '#8B0000' }} /> {patent.application_date}
                </div>
              </div>
            )}
            {patent.grant_date && (
              <div style={{ background: '#fff', borderRadius: 12, padding: '24px', boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
                <h4 style={{ fontSize: 14, fontWeight: 700, color: '#888', fontFamily: 'Arial', margin: '0 0 12px', textTransform: 'uppercase', letterSpacing: 1 }}>{tx.grantDate}</h4>
                <div style={{ fontSize: 14, color: '#555', fontFamily: 'Arial', display: 'flex', alignItems: 'center', gap: 6 }}>
                  <CalendarOutlined style={{ color: '#8B0000' }} /> {patent.grant_date}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}