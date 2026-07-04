import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { TrophyOutlined, CalendarOutlined } from '@ant-design/icons'
import Header from '../../components/Header.jsx'

const t = {
  tr: { loading: 'Yükleniyor...', notFound: 'Ödül bulunamadı.', back: '← Ödüller', givenBy: 'Veren Kurum', year: 'Yıl', description: 'Açıklama', recipient: 'Sahibi' },
  en: { loading: 'Loading...', notFound: 'Award not found.', back: '← Awards', givenBy: 'Given By', year: 'Year', description: 'Description', recipient: 'Recipient' }
}

function Avatar({ name, photo, size = 40 }) {
  if (photo) return <img src={photo} alt={name} style={{ width: size, height: size, borderRadius: '50%', objectFit: 'cover', flexShrink: 0 }} />
  const initials = (name || '').split(' ').filter(w => !w.includes('.')).slice(0, 2).map(w => w[0]).join('')
  return <div style={{ width: size, height: size, borderRadius: '50%', background: 'linear-gradient(135deg, #8B0000, #C0392B)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: size / 3, fontWeight: 700, flexShrink: 0 }}>{initials}</div>
}

export default function AwardDetailPage() {
  const [lang, setLang] = useState(() => localStorage.getItem('lang') || 'tr')
  const [award, setAward] = useState(null)
  const [recipientDetail, setRecipientDetail] = useState(null)
  const [loading, setLoading] = useState(true)
  const { id } = useParams()
  const tx = t[lang]

  useEffect(() => {
    fetch(`/api/v1/awards/${id}/`)
      .then(r => r.ok ? r.json() : null)
      .then(async d => {
        if (d) {
          setAward(d)
          if (d.recipient) {
            const rec = await fetch(`/api/v1/users/${d.recipient}/`).then(r => r.ok ? r.json() : null)
            setRecipientDetail(rec)
          }
        }
        setLoading(false)
      })
  }, [id])

  if (loading) return <div style={{ textAlign: 'center', padding: 64, fontFamily: 'Arial' }}>{tx.loading}</div>
  if (!award) return <div style={{ textAlign: 'center', padding: 64, fontFamily: 'Arial' }}>{tx.notFound}</div>

  return (
    <div style={{ fontFamily: "'Georgia', serif", background: '#f8f8f6', minHeight: '100vh' }}>
      <Header lang={lang} setLang={setLang} />

      <div style={{ background: 'linear-gradient(135deg, #6B0000, #8B0000)', padding: '40px 48px' }}>
        <div style={{ maxWidth: 900, margin: '0 auto' }}>
          <a href="/awards" style={{ color: 'rgba(255,255,255,0.7)', fontFamily: 'Arial', fontSize: 13, textDecoration: 'none', display: 'block', marginBottom: 20 }}>{tx.back}</a>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 12 }}>
            <TrophyOutlined style={{ color: '#fff', fontSize: 32 }} />
            <div>
              <h1 style={{ color: '#fff', fontSize: 28, fontWeight: 700, margin: 0 }}>{award.title}</h1>
              {award.given_by && <div style={{ color: 'rgba(255,255,255,0.8)', fontFamily: 'Arial', fontSize: 14, marginTop: 4 }}>{award.given_by}</div>}
            </div>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 900, margin: '40px auto 64px', padding: '0 48px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 24 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            {award.description && (
              <div style={{ background: '#fff', borderRadius: 12, padding: '28px', boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
                <h3 style={{ fontSize: 16, fontWeight: 700, color: '#1a1a1a', margin: '0 0 16px' }}>{tx.description}</h3>
                <p style={{ fontSize: 14, color: '#555', fontFamily: 'Arial', lineHeight: 1.8, margin: 0 }}>{award.description}</p>
              </div>
            )}
            {recipientDetail && (
              <div style={{ background: '#fff', borderRadius: 12, padding: '28px', boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
                <h3 style={{ fontSize: 16, fontWeight: 700, color: '#1a1a1a', margin: '0 0 16px' }}>{tx.recipient}</h3>
                <a href={`/researcher/${recipientDetail.id}`} style={{ display: 'flex', alignItems: 'center', gap: 12, textDecoration: 'none' }}>
                  <Avatar name={`${recipientDetail.first_name} ${recipientDetail.last_name}`} photo={recipientDetail.profile_image_url} />
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 600, color: '#1a1a1a' }}>{recipientDetail.title ? `${recipientDetail.title} ` : ''}{recipientDetail.first_name} {recipientDetail.last_name}</div>
                    {recipientDetail.department && <div style={{ fontSize: 12, color: '#888', fontFamily: 'Arial' }}>{recipientDetail.department}</div>}
                  </div>
                </a>
              </div>
            )}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div style={{ background: '#fff', borderRadius: 12, padding: '24px', boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
              <h4 style={{ fontSize: 14, fontWeight: 700, color: '#888', fontFamily: 'Arial', margin: '0 0 12px', textTransform: 'uppercase', letterSpacing: 1 }}>{tx.year}</h4>
              <div style={{ fontSize: 20, fontWeight: 700, color: '#1a1a1a', display: 'flex', alignItems: 'center', gap: 6 }}>
                <CalendarOutlined style={{ color: '#8B0000' }} /> {award.year}
              </div>
            </div>
            {award.given_by && (
              <div style={{ background: '#fff', borderRadius: 12, padding: '24px', boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
                <h4 style={{ fontSize: 14, fontWeight: 700, color: '#888', fontFamily: 'Arial', margin: '0 0 12px', textTransform: 'uppercase', letterSpacing: 1 }}>{tx.givenBy}</h4>
                <div style={{ fontSize: 14, color: '#555', fontFamily: 'Arial' }}>{award.given_by}</div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}