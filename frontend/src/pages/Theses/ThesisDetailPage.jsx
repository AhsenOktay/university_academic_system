import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { Tag } from 'antd'
import { CalendarOutlined, LinkOutlined } from '@ant-design/icons'
import Header from '../../components/Header.jsx'

const t = {
  tr: {
    loading: 'Yükleniyor...', notFound: 'Tez bulunamadı.', back: '← Tezler',
    abstract: 'Özet', advisor: 'Danışman', year: 'Yıl',
    yokBtn: 'Teze Erişin',
    types: { masters: 'Yüksek Lisans', phd: 'Doktora' },
  },
  en: {
    loading: 'Loading...', notFound: 'Thesis not found.', back: '← Theses',
    abstract: 'Abstract', advisor: 'Advisor', year: 'Year',
    yokBtn: 'Access Thesis',
    types: { masters: "Master's Thesis", phd: 'PhD Dissertation' },
  }
}

const typeColors = { masters: '#1a5276', phd: '#6c3483' }

function Avatar({ name, photo, size = 40 }) {
  if (photo) return <img src={photo} alt={name} style={{ width: size, height: size, borderRadius: '50%', objectFit: 'cover', flexShrink: 0 }} />
  const initials = (name || '').split(' ').filter(w => !w.includes('.')).slice(0, 2).map(w => w[0]).join('')
  return <div style={{ width: size, height: size, borderRadius: '50%', background: 'linear-gradient(135deg, #8B0000, #C0392B)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: size / 3, fontWeight: 700, flexShrink: 0 }}>{initials}</div>
}

export default function ThesisDetailPage() {
  const [lang, setLang] = useState(() => localStorage.getItem('lang') || 'tr')
  const [thesis, setThesis] = useState(null)
  const [advisorDetail, setAdvisorDetail] = useState(null)
  const [loading, setLoading] = useState(true)
  const { id } = useParams()
  const tx = t[lang]

  useEffect(() => {
    fetch(`/api/v1/theses/${id}/`)
      .then(r => r.ok ? r.json() : null)
      .then(async d => {
        if (d) {
          setThesis(d)
          if (d.advisor) {
            const adv = await fetch(`/api/v1/users/${d.advisor}/`).then(r => r.ok ? r.json() : null)
            setAdvisorDetail(adv)
          }
        }
        setLoading(false)
      })
  }, [id])

  if (loading) return <div style={{ textAlign: 'center', padding: 64, fontFamily: 'Arial' }}>{tx.loading}</div>
  if (!thesis) return <div style={{ textAlign: 'center', padding: 64, fontFamily: 'Arial' }}>{tx.notFound}</div>

  const renderAbstract = (text) => {
    if (!text) return null
    return text.split('\n').map((line, i) => {
      if (line.startsWith('YÖK Linki:')) {
        const url = line.replace('YÖK Linki:', '').trim()
        return (
          <div key={i} style={{ marginBottom: 12 }}>
            <a href={url} target="_blank" rel="noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: '#8B0000', color: '#fff', padding: '8px 16px', borderRadius: 8, fontFamily: 'Arial', fontSize: 13, fontWeight: 600, textDecoration: 'none' }}>
              <LinkOutlined /> {tx.yokBtn}
            </a>
          </div>
        )
      }
      return line ? <p key={i} style={{ fontSize: 14, color: '#555', fontFamily: 'Arial', lineHeight: 1.8, margin: '0 0 8px' }}>{line}</p> : null
    })
  }

  return (
    <div style={{ fontFamily: "'Georgia', serif", background: '#f8f8f6', minHeight: '100vh' }}>
      <Header lang={lang} setLang={setLang} />

      <div style={{ background: 'linear-gradient(135deg, #6B0000, #8B0000)', padding: '40px 48px' }}>
        <div style={{ maxWidth: 900, margin: '0 auto' }}>
          <a href="/theses" style={{ color: 'rgba(255,255,255,0.7)', fontFamily: 'Arial', fontSize: 13, textDecoration: 'none', display: 'block', marginBottom: 20 }}>{tx.back}</a>
          <div style={{ marginBottom: 16 }}>
            <Tag color={typeColors[thesis.thesis_type] || '#8B0000'} style={{ fontSize: 12, borderRadius: 4 }}>{tx.types[thesis.thesis_type] || thesis.thesis_type}</Tag>
          </div>
          <h1 style={{ color: '#fff', fontSize: 28, fontWeight: 700, margin: '0 0 8px', lineHeight: 1.3 }}>{thesis.title}</h1>
          {thesis.title_en && <div style={{ color: 'rgba(255,255,255,0.7)', fontFamily: 'Arial', fontSize: 15, fontStyle: 'italic' }}>{thesis.title_en}</div>}
        </div>
      </div>

      <div style={{ maxWidth: 900, margin: '40px auto 64px', padding: '0 48px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 24 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            {thesis.abstract && (
              <div style={{ background: '#fff', borderRadius: 12, padding: '28px', boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
                <h3 style={{ fontSize: 16, fontWeight: 700, color: '#1a1a1a', margin: '0 0 16px' }}>{tx.abstract}</h3>
                {renderAbstract(thesis.abstract)}
              </div>
            )}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div style={{ background: '#fff', borderRadius: 12, padding: '24px', boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
              <h4 style={{ fontSize: 14, fontWeight: 700, color: '#888', fontFamily: 'Arial', margin: '0 0 12px', textTransform: 'uppercase', letterSpacing: 1 }}>{tx.year}</h4>
              <div style={{ fontSize: 20, fontWeight: 700, color: '#1a1a1a', display: 'flex', alignItems: 'center', gap: 6 }}>
                <CalendarOutlined style={{ color: '#8B0000' }} /> {thesis.year}
              </div>
            </div>

            {advisorDetail && (
              <div style={{ background: '#fff', borderRadius: 12, padding: '24px', boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
                <h4 style={{ fontSize: 14, fontWeight: 700, color: '#888', fontFamily: 'Arial', margin: '0 0 12px', textTransform: 'uppercase', letterSpacing: 1 }}>{tx.advisor}</h4>
                <a href={`/researcher/${advisorDetail.id}`} style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
                  <Avatar name={`${advisorDetail.first_name} ${advisorDetail.last_name}`} photo={advisorDetail.profile_image_url} />
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 600, color: '#1a1a1a' }}>
                      {advisorDetail.title ? `${advisorDetail.title} ` : ''}{advisorDetail.first_name} {advisorDetail.last_name}
                    </div>
                    {advisorDetail.department && <div style={{ fontSize: 12, color: '#888', fontFamily: 'Arial' }}>{advisorDetail.department}</div>}
                  </div>
                </a>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}