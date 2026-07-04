import { useState, useEffect, useRef } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import Header from '../../components/Header.jsx'

const translations = {
  tr: {
    title: 'Tez Düzenle',
    fields: { title: 'Tez Başlığı', title_en: 'İngilizce Başlık', abstract: 'Özet', thesis_type: 'Tez Türü', year: 'Yıl', student_name: 'Öğrenci Adı Soyadı' },
    types: { masters: 'Yüksek Lisans', phd: 'Doktora' },
    abstractHint: 'YÖK Tez Merkezi linkini eklemek için özet başına "YÖK Linki: https://tez.yok.gov.tr/..." şeklinde yazın.',
    submit: 'Güncelle', cancel: 'İptal', success: 'Tez güncellendi!', error: 'Bir hata oluştu.', loading: 'Yükleniyor...',
  },
  en: {
    title: 'Edit Thesis',
    fields: { title: 'Thesis Title', title_en: 'English Title', abstract: 'Abstract', thesis_type: 'Thesis Type', year: 'Year', student_name: 'Student Full Name' },
    types: { masters: "Master's Thesis", phd: 'PhD Dissertation' },
    abstractHint: 'To add YÖK link, start with "YÖK Linki: https://tez.yok.gov.tr/..."',
    submit: 'Update', cancel: 'Cancel', success: 'Thesis updated!', error: 'An error occurred.', loading: 'Loading...',
  }
}

export default function EditThesisPage() {
  const [lang] = useState(() => localStorage.getItem('lang') || 'tr')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')
  const [successMsg, setSuccessMsg] = useState('')
  const [thesisType, setThesisType] = useState('masters')
  const [data, setData] = useState(null)
  const navigate = useNavigate()
  const { id } = useParams()
  const tx = translations[lang]
  const titleRef = useRef(); const titleEnRef = useRef(); const abstractRef = useRef()
  const yearRef = useRef(); const studentNameRef = useRef()

  useEffect(() => {
    const token = localStorage.getItem('access')
    fetch(`/api/v1/theses/${id}/`, { headers: { 'Authorization': `Bearer ${token}` } })
      .then(r => r.ok ? r.json() : null)
      .then(d => {
        if (d) { setData(d); setThesisType(d.thesis_type || 'masters') }
        setLoading(false)
      })
  }, [id])

  const handleSubmit = async (e) => {
    e.preventDefault(); setSaving(true); setErrorMsg('')
    try {
      const token = localStorage.getItem('access')
      const res = await fetch(`/api/v1/theses/${id}/`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({
          title: titleRef.current.value,
          title_en: titleEnRef.current.value,
          abstract: abstractRef.current.value,
          thesis_type: thesisType,
          year: parseInt(yearRef.current.value),
          student_name: studentNameRef.current.value,
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
              <div><label style={labelStyle}>{tx.fields.thesis_type}</label><select value={thesisType} onChange={e => setThesisType(e.target.value)} style={inputStyle}>{Object.entries(tx.types).map(([k, v]) => <option key={k} value={k}>{v}</option>)}</select></div>
              <div><label style={labelStyle}>{tx.fields.year}</label><input ref={yearRef} type="number" min="1900" max="2030" defaultValue={data?.year} style={inputStyle} onFocus={e => e.target.style.borderColor = '#8B0000'} onBlur={e => e.target.style.borderColor = '#d9d9d9'} /></div>
              <div style={{ gridColumn: '1 / -1' }}><label style={labelStyle}>{tx.fields.student_name}</label><input ref={studentNameRef} type="text" defaultValue={data?.student_name} style={inputStyle} onFocus={e => e.target.style.borderColor = '#8B0000'} onBlur={e => e.target.style.borderColor = '#d9d9d9'} /></div>
              <div style={{ gridColumn: '1 / -1' }}>
                <label style={labelStyle}>{tx.fields.abstract}</label>
                <div style={{ fontSize: 12, color: '#888', fontFamily: 'Arial', marginBottom: 6 }}>{tx.abstractHint}</div>
                <textarea ref={abstractRef} rows={7} defaultValue={data?.abstract} style={{ ...inputStyle, height: 'auto', padding: '12px 16px', resize: 'vertical' }} onFocus={e => e.target.style.borderColor = '#8B0000'} onBlur={e => e.target.style.borderColor = '#d9d9d9'} />
              </div>
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