import { useState, useEffect, useRef } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import Header from '../../components/Header.jsx'

const translations = {
  tr: {
    title: 'Yayın Düzenle',
    fields: { title: 'Yayın Başlığı', title_en: 'İngilizce Başlık', abstract: 'Özet', pub_type: 'Yayın Türü', journal: 'Dergi / Yayınevi', year: 'Yıl', doi: 'DOI', url: 'URL', keywords: 'Anahtar Kelimeler', authors: 'Ortak Yazarlar' },
    types: { article: 'Makale', book: 'Kitap', book_chapter: 'Kitap Bölümü', conference: 'Bildiri', other: 'Diğer' },
    authorsHint: 'Siz otomatik yazar olarak ekleniyorsunuz. Ortak yazarları seçin.',
    submit: 'Güncelle', cancel: 'İptal', success: 'Yayın güncellendi!', error: 'Bir hata oluştu.', loading: 'Yükleniyor...',
  },
  en: {
    title: 'Edit Publication',
    fields: { title: 'Publication Title', title_en: 'English Title', abstract: 'Abstract', pub_type: 'Publication Type', journal: 'Journal / Publisher', year: 'Year', doi: 'DOI', url: 'URL', keywords: 'Keywords', authors: 'Co-Authors' },
    types: { article: 'Article', book: 'Book', book_chapter: 'Book Chapter', conference: 'Conference Paper', other: 'Other' },
    authorsHint: 'You are automatically added as an author. Select co-authors.',
    submit: 'Update', cancel: 'Cancel', success: 'Publication updated!', error: 'An error occurred.', loading: 'Loading...',
  }
}

export default function EditPublicationPage() {
  const [lang] = useState(() => localStorage.getItem('lang') || 'tr')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')
  const [successMsg, setSuccessMsg] = useState('')
  const [pubType, setPubType] = useState('article')
  const [data, setData] = useState(null)
  const [academics, setAcademics] = useState([])
  const [selectedAuthors, setSelectedAuthors] = useState([])
  const navigate = useNavigate()
  const { id } = useParams()
  const tx = translations[lang]
  const titleRef = useRef(); const titleEnRef = useRef(); const abstractRef = useRef()
  const journalRef = useRef(); const yearRef = useRef(); const doiRef = useRef()
  const urlRef = useRef(); const keywordsRef = useRef()

  useEffect(() => {
    const token = localStorage.getItem('access')
    const user = JSON.parse(localStorage.getItem('user') || '{}')
    fetch(`/api/v1/publications/${id}/`, { headers: { 'Authorization': `Bearer ${token}` } })
      .then(r => r.ok ? r.json() : null)
      .then(d => {
        if (d) {
          setData(d)
          setPubType(d.pub_type)
          const otherAuthors = (d.authors || []).filter(a => a !== user.id)
          setSelectedAuthors(otherAuthors)
        }
        setLoading(false)
      })
    fetch('/api/v1/users/?user_type=academic&page_size=100', { headers: { 'Authorization': `Bearer ${token}` } })
      .then(r => r.json()).then(d => setAcademics(d.results || [])).catch(() => {})
  }, [id])

  const toggleAuthor = (aid) => setSelectedAuthors(prev => prev.includes(aid) ? prev.filter(a => a !== aid) : [...prev, aid])

  const handleSubmit = async (e) => {
    e.preventDefault(); setSaving(true); setErrorMsg('')
    try {
      const token = localStorage.getItem('access')
      const user = JSON.parse(localStorage.getItem('user') || '{}')
      const allAuthors = user.id ? [user.id, ...selectedAuthors.filter(a => a !== user.id)] : selectedAuthors
      const res = await fetch(`/api/v1/publications/${id}/`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({
          title: titleRef.current.value,
          title_en: titleEnRef.current.value,
          abstract: abstractRef.current.value,
          pub_type: pubType,
          journal: journalRef.current.value,
          year: parseInt(yearRef.current.value),
          doi: doiRef.current.value,
          url: urlRef.current.value,
          keywords: keywordsRef.current.value,
          authors: allAuthors,
        })
      })
      if (res.ok) { setSuccessMsg(tx.success); setTimeout(() => navigate('/dashboard'), 1500) }
      else { const d = await res.json(); setErrorMsg(JSON.stringify(d)) }
    } catch { setErrorMsg(tx.error) }
    setSaving(false)
  }

  const inputStyle = { width: '100%', height: 48, borderRadius: 8, border: '1px solid #d9d9d9', padding: '0 16px', fontSize: 15, outline: 'none', boxSizing: 'border-box', fontFamily: 'Arial' }
  const labelStyle = { display: 'block', fontSize: 13, fontWeight: 600, color: '#444', fontFamily: 'Arial', marginBottom: 6 }

  if (loading) return <div style={{ textAlign: 'center', padding: 64, fontFamily: 'Arial' }}>{tx.loading}</div>

  return (
    <div style={{ fontFamily: "'Georgia', serif", background: '#f8f8f6', minHeight: '100vh' }}>
      <Header lang={lang} />
      <div style={{ background: 'linear-gradient(135deg, #6B0000, #8B0000)', padding: '40px 48px' }}>
        <div style={{ maxWidth: 800, margin: '0 auto' }}>
          <a href="/dashboard" style={{ color: 'rgba(255,255,255,0.7)', fontFamily: 'Arial', fontSize: 13, textDecoration: 'none', display: 'block', marginBottom: 16 }}>← Dashboard</a>
          <h1 style={{ color: '#fff', fontSize: 28, fontWeight: 700, margin: 0 }}>{tx.title}</h1>
        </div>
      </div>
      <div style={{ maxWidth: 800, margin: '40px auto 64px', padding: '0 48px' }}>
        <div style={{ background: '#fff', borderRadius: 12, padding: '40px', boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
          {errorMsg && <div style={{ background: '#fff2f0', border: '1px solid #ffccc7', borderRadius: 8, padding: '10px 16px', marginBottom: 24, color: '#cf1322', fontFamily: 'Arial', fontSize: 14 }}>{errorMsg}</div>}
          {successMsg && <div style={{ background: '#f6ffed', border: '1px solid #b7eb8f', borderRadius: 8, padding: '10px 16px', marginBottom: 24, color: '#389e0d', fontFamily: 'Arial', fontSize: 14 }}>{successMsg}</div>}
          <form onSubmit={handleSubmit}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 20 }}>
              <div style={{ gridColumn: '1 / -1' }}><label style={labelStyle}>{tx.fields.title} *</label><input ref={titleRef} type="text" required defaultValue={data?.title} style={inputStyle} onFocus={e => e.target.style.borderColor = '#8B0000'} onBlur={e => e.target.style.borderColor = '#d9d9d9'} /></div>
              <div style={{ gridColumn: '1 / -1' }}><label style={labelStyle}>{tx.fields.title_en}</label><input ref={titleEnRef} type="text" defaultValue={data?.title_en} style={inputStyle} onFocus={e => e.target.style.borderColor = '#8B0000'} onBlur={e => e.target.style.borderColor = '#d9d9d9'} /></div>
              <div><label style={labelStyle}>{tx.fields.pub_type}</label><select value={pubType} onChange={e => setPubType(e.target.value)} style={inputStyle}>{Object.entries(tx.types).map(([k, v]) => <option key={k} value={k}>{v}</option>)}</select></div>
              <div><label style={labelStyle}>{tx.fields.year}</label><input ref={yearRef} type="number" defaultValue={data?.year} style={inputStyle} onFocus={e => e.target.style.borderColor = '#8B0000'} onBlur={e => e.target.style.borderColor = '#d9d9d9'} /></div>
              <div style={{ gridColumn: '1 / -1' }}><label style={labelStyle}>{tx.fields.journal}</label><input ref={journalRef} type="text" defaultValue={data?.journal} style={inputStyle} onFocus={e => e.target.style.borderColor = '#8B0000'} onBlur={e => e.target.style.borderColor = '#d9d9d9'} /></div>
              <div><label style={labelStyle}>{tx.fields.doi}</label><input ref={doiRef} type="text" defaultValue={data?.doi} style={inputStyle} onFocus={e => e.target.style.borderColor = '#8B0000'} onBlur={e => e.target.style.borderColor = '#d9d9d9'} /></div>
              <div><label style={labelStyle}>{tx.fields.url}</label><input ref={urlRef} type="url" defaultValue={data?.url} style={inputStyle} onFocus={e => e.target.style.borderColor = '#8B0000'} onBlur={e => e.target.style.borderColor = '#d9d9d9'} /></div>
              <div style={{ gridColumn: '1 / -1' }}><label style={labelStyle}>{tx.fields.keywords}</label><input ref={keywordsRef} type="text" defaultValue={data?.keywords} placeholder="Virgülle ayırın" style={inputStyle} onFocus={e => e.target.style.borderColor = '#8B0000'} onBlur={e => e.target.style.borderColor = '#d9d9d9'} /></div>
              <div style={{ gridColumn: '1 / -1' }}>
                <label style={labelStyle}>{tx.fields.authors}</label>
                <div style={{ fontSize: 12, color: '#888', fontFamily: 'Arial', marginBottom: 8 }}>{tx.authorsHint}</div>
                <div style={{ border: '1px solid #d9d9d9', borderRadius: 8, maxHeight: 200, overflowY: 'auto', padding: 8 }}>
                     {academics.map(a => {
                        const isMe = a.id === JSON.parse(localStorage.getItem('user') || '{}').id
                        return (
                          <div key={a.id} onClick={() => !isMe && toggleAuthor(a.id)} style={{ padding: '8px 12px', borderRadius: 6, cursor: isMe ? 'default' : 'pointer', display: 'flex', alignItems: 'center', gap: 10, background: isMe || selectedAuthors.includes(a.id) ? '#fff0f0' : 'transparent' }}>
                            <input type="checkbox" readOnly checked={isMe || selectedAuthors.includes(a.id)} disabled={isMe} style={{ cursor: isMe ? 'default' : 'pointer' }} />
                            <span style={{ fontFamily: 'Arial', fontSize: 14, color: isMe || selectedAuthors.includes(a.id) ? '#8B0000' : '#333' }}>
                              {a.title ? `${a.title} ` : ''}{a.first_name} {a.last_name}
                              {isMe && <span style={{ fontSize: 11, color: '#888', marginLeft: 6 }}>(Sen)</span>}
                              {a.department && <span style={{ color: '#888', fontSize: 12 }}> • {a.department}</span>}
                            </span>
                          </div>
                        )
                      })}
                </div>
                {selectedAuthors.length > 0 && (
                  <div style={{ marginTop: 8, display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                    {selectedAuthors.map(aid => {
                      const a = academics.find(ac => ac.id === aid)
                      return a ? <span key={aid} style={{ background: '#8B0000', color: '#fff', padding: '4px 10px', borderRadius: 20, fontSize: 12, fontFamily: 'Arial' }}>{a.first_name} {a.last_name}</span> : null
                    })}
                  </div>
                )}
              </div>
              <div style={{ gridColumn: '1 / -1' }}><label style={labelStyle}>{tx.fields.abstract}</label><textarea ref={abstractRef} rows={5} defaultValue={data?.abstract} style={{ ...inputStyle, height: 'auto', padding: '12px 16px', resize: 'vertical' }} onFocus={e => e.target.style.borderColor = '#8B0000'} onBlur={e => e.target.style.borderColor = '#d9d9d9'} /></div>
            </div>
            <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end' }}>
              <button type="button" onClick={() => navigate('/dashboard')} style={{ height: 44, borderRadius: 8, padding: '0 24px', background: '#fff', border: '1px solid #d9d9d9', color: '#666', fontSize: 14, fontFamily: 'Arial', cursor: 'pointer' }}>{tx.cancel}</button>
              <button type="submit" disabled={saving} style={{ height: 44, borderRadius: 8, padding: '0 32px', background: '#8B0000', border: 'none', color: '#fff', fontSize: 14, fontWeight: 600, fontFamily: 'Arial', cursor: saving ? 'not-allowed' : 'pointer' }}>{saving ? '...' : tx.submit}</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}