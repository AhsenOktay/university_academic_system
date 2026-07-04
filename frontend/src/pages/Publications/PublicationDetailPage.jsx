import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { Tag } from 'antd'
import { FileTextOutlined, LinkOutlined, CalendarOutlined, UserOutlined } from '@ant-design/icons'
import Header from '../../components/Header.jsx'

const t = {
  tr: {
    loading: 'Yükleniyor...', notFound: 'Yayın bulunamadı.', back: '← Yayınlar',
    abstract: 'Özet', authors: 'Yazarlar', journal: 'Dergi / Yayınevi', year: 'Yıl',
    doi: 'DOI', keywords: 'Anahtar Kelimeler', url: 'Bağlantı',
    types: { article: 'Makale', book: 'Kitap', book_chapter: 'Kitap Bölümü', conference: 'Bildiri', other: 'Diğer' },
  },
  en: {
    loading: 'Loading...', notFound: 'Publication not found.', back: '← Publications',
    abstract: 'Abstract', authors: 'Authors', journal: 'Journal / Publisher', year: 'Year',
    doi: 'DOI', keywords: 'Keywords', url: 'Link',
    types: { article: 'Article', book: 'Book', book_chapter: 'Book Chapter', conference: 'Conference Paper', other: 'Other' },
  }
}

const typeColors = { article: '#8B0000', book: '#1a5276', book_chapter: '#1e8449', conference: '#6c3483', other: '#784212' }

export default function PublicationDetailPage() {
  const [lang, setLang] = useState(() => localStorage.getItem('lang') || 'tr')
  const [pub, setPub] = useState(null)
  const [loading, setLoading] = useState(true)
  const { id } = useParams()
  const tx = t[lang]

  useEffect(() => {
    fetch(`/api/v1/publications/${id}/`)
      .then(r => r.ok ? r.json() : null)
      .then(d => { setPub(d); setLoading(false) })
  }, [id])

  if (loading) return <div style={{ textAlign: 'center', padding: 64, fontFamily: 'Arial' }}>{tx.loading}</div>
  if (!pub) return <div style={{ textAlign: 'center', padding: 64, fontFamily: 'Arial' }}>{tx.notFound}</div>

  return (
    <div style={{ fontFamily: "'Georgia', serif", background: '#f8f8f6', minHeight: '100vh' }}>
      <Header activeIndex={0} lang={lang} setLang={setLang} />

      <div style={{ background: 'linear-gradient(135deg, #6B0000, #8B0000)', padding: '40px 48px' }}>
        <div style={{ maxWidth: 900, margin: '0 auto' }}>
          <a href="/publications" style={{ color: 'rgba(255,255,255,0.7)', fontFamily: 'Arial', fontSize: 13, textDecoration: 'none', display: 'block', marginBottom: 20 }}>{tx.back}</a>
          <div style={{ display: 'flex', gap: 12, marginBottom: 16 }}>
            <Tag color={typeColors[pub.pub_type] || '#8B0000'} style={{ fontSize: 12, borderRadius: 4 }}>{tx.types[pub.pub_type] || pub.pub_type}</Tag>
            <span style={{ color: 'rgba(255,255,255,0.7)', fontFamily: 'Arial', fontSize: 13, display: 'flex', alignItems: 'center', gap: 6 }}><CalendarOutlined /> {pub.year}</span>
          </div>
          <h1 style={{ color: '#fff', fontSize: 28, fontWeight: 700, margin: '0 0 8px', lineHeight: 1.3 }}>{pub.title}</h1>
          {pub.title_en && <div style={{ color: 'rgba(255,255,255,0.7)', fontFamily: 'Arial', fontSize: 15, fontStyle: 'italic', marginBottom: 8 }}>{pub.title_en}</div>}
          {pub.journal && <div style={{ color: 'rgba(255,255,255,0.8)', fontFamily: 'Arial', fontSize: 15 }}>{pub.journal}</div>}
        </div>
      </div>

      <div style={{ maxWidth: 900, margin: '40px auto 64px', padding: '0 48px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 24 }}>
          <div>
            {pub.abstract && (
              <div style={{ background: '#fff', borderRadius: 12, padding: '28px', boxShadow: '0 2px 12px rgba(0,0,0,0.06)', marginBottom: 20 }}>
                <h3 style={{ fontSize: 16, fontWeight: 700, color: '#1a1a1a', margin: '0 0 16px' }}>{tx.abstract}</h3>
                <p style={{ fontSize: 14, color: '#555', fontFamily: 'Arial', lineHeight: 1.8, margin: 0 }}>{pub.abstract}</p>
              </div>
            )}
            {pub.keywords && (
              <div style={{ background: '#fff', borderRadius: 12, padding: '28px', boxShadow: '0 2px 12px rgba(0,0,0,0.06)', marginBottom: 20 }}>
                <h3 style={{ fontSize: 16, fontWeight: 700, color: '#1a1a1a', margin: '0 0 16px' }}>{tx.keywords}</h3>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                  {pub.keywords.split(',').map((kw, i) => (
                    <span key={i} style={{ background: '#fff0f0', color: '#8B0000', padding: '4px 12px', borderRadius: 20, fontSize: 13, fontFamily: 'Arial' }}>{kw.trim()}</span>
                  ))}
                </div>
              </div>
            )}
            {pub.authors_detail && pub.authors_detail.length > 0 && (
              <div style={{ background: '#fff', borderRadius: 12, padding: '28px', boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
                <h3 style={{ fontSize: 16, fontWeight: 700, color: '#1a1a1a', margin: '0 0 16px' }}>{tx.authors}</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {pub.authors_detail.map(author => (
                    <a key={author.id} href={`/researcher/${author.id}`} style={{ display: 'flex', alignItems: 'center', gap: 12, textDecoration: 'none' }}>
                      <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'linear-gradient(135deg, #8B0000, #C0392B)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 14, fontWeight: 700, flexShrink: 0, overflow: 'hidden' }}>
                        {author.profile_image_url
                          ? <img src={author.profile_image_url} alt={author.full_name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                          : <>{author.first_name?.[0]}{author.last_name?.[0]}</>
                        }
                      </div>
                      <div>
                        <div style={{ fontSize: 14, fontWeight: 600, color: '#1a1a1a' }}>
                          {author.title ? `${author.title} ` : ''}{author.first_name} {author.last_name}
                        </div>
                        {author.department && <div style={{ fontSize: 12, color: '#888', fontFamily: 'Arial' }}>{author.department}</div>}
                      </div>
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div style={{ background: '#fff', borderRadius: 12, padding: '24px', boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
              <h4 style={{ fontSize: 14, fontWeight: 700, color: '#888', fontFamily: 'Arial', margin: '0 0 12px', textTransform: 'uppercase', letterSpacing: 1 }}>{tx.year}</h4>
              <div style={{ fontSize: 20, fontWeight: 700, color: '#1a1a1a' }}>{pub.year}</div>
            </div>

            {pub.journal && (
              <div style={{ background: '#fff', borderRadius: 12, padding: '24px', boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
                <h4 style={{ fontSize: 14, fontWeight: 700, color: '#888', fontFamily: 'Arial', margin: '0 0 12px', textTransform: 'uppercase', letterSpacing: 1 }}>{tx.journal}</h4>
                <div style={{ fontSize: 14, color: '#555', fontFamily: 'Arial', display: 'flex', alignItems: 'center', gap: 6 }}>
                  <FileTextOutlined style={{ color: '#8B0000' }} /> {pub.journal}
                </div>
              </div>
            )}

            {pub.doi && (
              <div style={{ background: '#fff', borderRadius: 12, padding: '24px', boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
                <h4 style={{ fontSize: 14, fontWeight: 700, color: '#888', fontFamily: 'Arial', margin: '0 0 12px', textTransform: 'uppercase', letterSpacing: 1 }}>{tx.doi}</h4>
                <a href={`https://doi.org/${pub.doi}`} target="_blank" rel="noreferrer" style={{ color: '#8B0000', fontFamily: 'Arial', fontSize: 14, wordBreak: 'break-all', display: 'flex', alignItems: 'center', gap: 6 }}>
                  <LinkOutlined /> Makaleye Erişin
                </a>
              </div>
            )}

            {pub.url && (
              <div style={{ background: '#fff', borderRadius: 12, padding: '24px', boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
                <h4 style={{ fontSize: 14, fontWeight: 700, color: '#888', fontFamily: 'Arial', margin: '0 0 12px', textTransform: 'uppercase', letterSpacing: 1 }}>{tx.url}</h4>
                <a href={pub.url} target="_blank" rel="noreferrer" style={{ color: '#8B0000', fontFamily: 'Arial', fontSize: 14, wordBreak: 'break-all', display: 'flex', alignItems: 'center', gap: 6 }}>
                  <LinkOutlined /> {pub.url}
                </a>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}