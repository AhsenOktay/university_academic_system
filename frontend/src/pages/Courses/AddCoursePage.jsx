import { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import Header from '../../components/Header.jsx'

const translations = {
  tr: {
    title: 'Ders Ekle',
    fields: { code: 'Ders Kodu', name: 'Ders Adı', name_en: 'İngilizce Ders Adı', level: 'Seviye', semester: 'Dönem', year: 'Yıl', credits: 'Kredi' },
    levels: { undergraduate: 'Lisans', graduate: 'Yüksek Lisans', doctorate: 'Doktora' },
    semesters: { fall: 'Güz', spring: 'Bahar', summer: 'Yaz' },
    submit: 'Kaydet', cancel: 'İptal', success: 'Ders başarıyla eklendi!', error: 'Bir hata oluştu.',
  },
  en: {
    title: 'Add Course',
    fields: { code: 'Course Code', name: 'Course Name', name_en: 'English Course Name', level: 'Level', semester: 'Semester', year: 'Year', credits: 'Credits' },
    levels: { undergraduate: 'Undergraduate', graduate: 'Graduate', doctorate: 'Doctorate' },
    semesters: { fall: 'Fall', spring: 'Spring', summer: 'Summer' },
    submit: 'Save', cancel: 'Cancel', success: 'Course added successfully!', error: 'An error occurred.',
  }
}

export default function AddCoursePage() {
  const [lang] = useState(() => localStorage.getItem('lang') || 'tr')
  const [loading, setLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')
  const [successMsg, setSuccessMsg] = useState('')
  const [level, setLevel] = useState('undergraduate')
  const [semester, setSemester] = useState('fall')
  const navigate = useNavigate()
  const tx = translations[lang]
  const codeRef = useRef(); const nameRef = useRef(); const nameEnRef = useRef()
  const yearRef = useRef(); const creditsRef = useRef()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true); setErrorMsg('')
    try {
      const token = localStorage.getItem('access')
      const user = JSON.parse(localStorage.getItem('user') || '{}')
      const res = await fetch('/api/v1/courses/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({
          code: codeRef.current.value,
          name: nameRef.current.value,
          name_en: nameEnRef.current.value,
          level,
          semester,
          year: parseInt(yearRef.current.value),
          credits: creditsRef.current.value ? parseInt(creditsRef.current.value) : null,
          instructor: user.id,
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
              <div><label style={labelStyle}>{tx.fields.code}</label><input ref={codeRef} type="text" style={inputStyle} onFocus={e => e.target.style.borderColor = '#8B0000'} onBlur={e => e.target.style.borderColor = '#d9d9d9'} /></div>
              <div><label style={labelStyle}>{tx.fields.year} *</label><input ref={yearRef} type="number" required min="2000" max="2030" defaultValue={new Date().getFullYear()} style={inputStyle} onFocus={e => e.target.style.borderColor = '#8B0000'} onBlur={e => e.target.style.borderColor = '#d9d9d9'} /></div>
              <div style={{ gridColumn: '1 / -1' }}><label style={labelStyle}>{tx.fields.name} *</label><input ref={nameRef} type="text" required style={inputStyle} onFocus={e => e.target.style.borderColor = '#8B0000'} onBlur={e => e.target.style.borderColor = '#d9d9d9'} /></div>
              <div style={{ gridColumn: '1 / -1' }}><label style={labelStyle}>{tx.fields.name_en}</label><input ref={nameEnRef} type="text" style={inputStyle} onFocus={e => e.target.style.borderColor = '#8B0000'} onBlur={e => e.target.style.borderColor = '#d9d9d9'} /></div>
              <div><label style={labelStyle}>{tx.fields.level}</label><select value={level} onChange={e => setLevel(e.target.value)} style={inputStyle}>{Object.entries(tx.levels).map(([k, v]) => <option key={k} value={k}>{v}</option>)}</select></div>
              <div><label style={labelStyle}>{tx.fields.semester}</label><select value={semester} onChange={e => setSemester(e.target.value)} style={inputStyle}>{Object.entries(tx.semesters).map(([k, v]) => <option key={k} value={k}>{v}</option>)}</select></div>
              <div><label style={labelStyle}>{tx.fields.credits}</label><input ref={creditsRef} type="number" min="0" max="30" style={inputStyle} onFocus={e => e.target.style.borderColor = '#8B0000'} onBlur={e => e.target.style.borderColor = '#d9d9d9'} /></div>
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