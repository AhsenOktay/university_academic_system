import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Header from '../../components/Header.jsx'

const translations = {
  tr: {
    title: 'Yayın Ekle',
    fields: {
      title: 'Yayın Başlığı', title_en: 'İngilizce Başlık', abstract: 'Özet',
      pub_type: 'Yayın Türü', journal: 'Dergi / Yayınevi', year: 'Yıl',
      doi: 'DOI', url: 'URL', keywords: 'Anahtar Kelimeler', authors: 'Yazarlar',
    },
    types: { article: 'Makale', book: 'Kitap', book_chapter: 'Kitap Bölümü', conference: 'Bildiri', other: 'Diğer' },
    keywordsPlaceholder: 'Virgülle ayırın (örn: yapay zeka, makine öğrenmesi)',
    authorsHint: 'Ortak yazarları seçin. Siz otomatik olarak eklenmektesiniz.',
    submit: 'Kaydet', cancel: 'İptal',
    success: 'Yayın başarıyla eklendi!', error: 'Bir hata oluştu.', required: 'Bu alan zorunludur.',
  },
  en: {
    title: 'Add Publication',
    fields: {
      title: 'Publication Title', title_en: 'English Title', abstract: 'Abstract',
      pub_type: 'Publication Type', journal: 'Journal / Publisher', year: 'Year',
      doi: 'DOI', url: 'URL', keywords: 'Keywords', authors: 'Authors',
    },
    types: { article: 'Article', book: 'Book', book_chapter: 'Book Chapter', conference: 'Conference Paper', other: 'Other' },
    keywordsPlaceholder: 'Separate with commas',
    authorsHint: 'Select co-authors. You are automatically added.',
    submit: 'Save', cancel: 'Cancel',
    success: 'Publication added successfully!', error: 'An error occurred.', required: 'This field is required.',
  }
}

export default function AddPublicationPage() {
  const [lang] = useState(() => localStorage.getItem('lang') || 'tr')
  const [loading, setLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')
  const [successMsg, setSuccessMsg] = useState('')
  const [pubType, setPubType] = useState('article')
  const [academics, setAcademics] = useState([])
  const [selectedAuthors, setSelectedAuthors] = useState([])
  const navigate = useNavigate()
  const tx = translations[lang]
  const titleRef = useRef(); const titleEnRef = useRef(); const abstractRef = useRef()
  const journalRef = useRef(); const yearRef = useRef(); const doiRef = useRef()
  const urlRef = useRef(); const keywordsRef = useRef()
  const currentUser = JSON.parse(localStorage.getItem('user') || '{}')

  useEffect(() => {
    const token = localStorage.getItem('access')
    fetch('/api/v1/users/?user_type=academic&page_size=100', {
      headers: { 'Authorization': `Bearer ${token}` }
    }).then(r => r.json()).then(d => setAcademics(d.results || [])).catch(() => {})
  }, [])

  const toggleAuthor = (id) => {
    setSelectedAuthors(prev => prev.includes(id) ? prev.filter(a => a !== id) : [...prev, id])
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!titleRef.current.value) { setErrorMsg(tx.required); return }
    setLoading(true); setErrorMsg('')
    try {
      const token = localStorage.getItem('access')
      const allAuthors = currentUser.id ? [currentUser.id, ...selectedAuthors.filter(a => a !== currentUser.id)] : selectedAuthors
      const res = await fetch('/api/v1/publications/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({
          title: titleRef.current.value, title_en: titleEnRef.current.value,
          abstract: abstractRef.current.value, pub_type: pubType,
          journal: journalRef.current.value,
          year: yearRef.current.value ? parseInt(yearRef.current.value) : new Date().getFullYear(),
          doi: doiRef.current.value, url: urlRef.current.value,
          keywords: keywordsRef.current.value, authors: allAuthors,
        }),
      })
      if (res.ok) { setSuccessMsg(tx.success); setTimeout(() => navigate('/dashboard'), 1500) }
      else { const data = await res.json(); setErrorMsg(JSON.stringify(data)) }
    } catch { setErrorMsg(tx.error) }
    setLoading(false)
  }

  const inputStyle = { width: '100%', height: 48, borderRadius: 8, border: '1px solid #d9d9d9', padding: '0 16px', fontSize: 15, outline: 'none', boxSizing: 'border-box', fontFamily: 'Arial' }
  const labelStyle = { display: 'block', fontSize: 13, fontWeight: 600, color: '#444', fontFamily: 'Arial', marginBottom: 6 }

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
              <div style={{ gridColumn: '1 / -1' }}><label style={labelStyle}>{tx.fields.title} *</label><input ref={titleRef} type="text" required style={inputStyle} onFocus={e => e.target.style.borderColor = '#8B0000'} onBlur={e => e.target.style.borderColor = '#d9d9d9'} /></div>
              <div style={{ gridColumn: '1 / -1' }}><label style={labelStyle}>{tx.fields.title_en}</label><input ref={titleEnRef} type="text" style={inputStyle} onFocus={e => e.target.style.borderColor = '#8B0000'} onBlur={e => e.target.style.borderColor = '#d9d9d9'} /></div>
              <div><label style={labelStyle}>{tx.fields.pub_type}</label><select value={pubType} onChange={e => setPubType(e.target.value)} style={inputStyle}>{Object.entries(tx.types).map(([k, v]) => <option key={k} value={k}>{v}</option>)}</select></div>
              <div><label style={labelStyle}>{tx.fields.year}</label><input ref={yearRef} type="number" min="1950" max="2030" defaultValue={new Date().getFullYear()} style={inputStyle} onFocus={e => e.target.style.borderColor = '#8B0000'} onBlur={e => e.target.style.borderColor = '#d9d9d9'} /></div>
              <div style={{ gridColumn: '1 / -1' }}><label style={labelStyle}>{tx.fields.journal}</label><input ref={journalRef} type="text" style={inputStyle} onFocus={e => e.target.style.borderColor = '#8B0000'} onBlur={e => e.target.style.borderColor = '#d9d9d9'} /></div>
              <div><label style={labelStyle}>{tx.fields.doi}</label><input ref={doiRef} type="text" placeholder="10.xxxx/xxxxx" style={inputStyle} onFocus={e => e.target.style.borderColor = '#8B0000'} onBlur={e => e.target.style.borderColor = '#d9d9d9'} /></div>
              <div><label style={labelStyle}>{tx.fields.url}</label><input ref={urlRef} type="url" placeholder="https://" style={inputStyle} onFocus={e => e.target.style.borderColor = '#8B0000'} onBlur={e => e.target.style.borderColor = '#d9d9d9'} /></div>
              <div style={{ gridColumn: '1 / -1' }}><label style={labelStyle}>{tx.fields.keywords}</label><input ref={keywordsRef} type="text" placeholder={tx.keywordsPlaceholder} style={inputStyle} onFocus={e => e.target.style.borderColor = '#8B0000'} onBlur={e => e.target.style.borderColor = '#d9d9d9'} /></div>
              <div style={{ gridColumn: '1 / -1' }}>
                <label style={labelStyle}>{tx.fields.authors}</label>
                <div style={{ fontSize: 12, color: '#888', fontFamily: 'Arial', marginBottom: 8 }}>{tx.authorsHint}</div>
                <div style={{ border: '1px solid #d9d9d9', borderRadius: 8, maxHeight: 200, overflowY: 'auto', padding: 8 }}>
                  {academics.map(a => {
                    const isMe = a.id === currentUser.id
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
              </div>
              <div style={{ gridColumn: '1 / -1' }}><label style={labelStyle}>{tx.fields.abstract}</label><textarea ref={abstractRef} rows={5} style={{ ...inputStyle, height: 'auto', padding: '12px 16px', resize: 'vertical' }} onFocus={e => e.target.style.borderColor = '#8B0000'} onBlur={e => e.target.style.borderColor = '#d9d9d9'} /></div>
            </div>
            <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end' }}>
              <button type="button" onClick={() => navigate('/dashboard')} style={{ height: 44, borderRadius: 8, padding: '0 24px', background: '#fff', border: '1px solid #d9d9d9', color: '#666', fontSize: 14, fontFamily: 'Arial', cursor: 'pointer' }}>{tx.cancel}</button>
              <button type="submit" disabled={loading} style={{ height: 44, borderRadius: 8, padding: '0 32px', background: '#8B0000', border: 'none', color: '#fff', fontSize: 14, fontWeight: 600, fontFamily: 'Arial', cursor: loading ? 'not-allowed' : 'pointer' }}>{loading ? '...' : tx.submit}</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}