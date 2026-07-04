import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Header from '../../components/Header.jsx'

const translations = {
  tr: { title: 'Patent Ekle', fields: { title: 'Patent Adı', patent_no: 'Patent No', application_date: 'Başvuru Tarihi', grant_date: 'Onay Tarihi', status: 'Durum', description: 'Açıklama', inventors: 'Ortak Mucitler' }, statuses: { applied: 'Başvuru Yapıldı', pending: 'İncelemede', granted: 'Onaylandı', rejected: 'Reddedildi' }, inventorsHint: 'Siz otomatik mucit olarak ekleniyorsunuz.', submit: 'Kaydet', cancel: 'İptal', success: 'Patent başarıyla eklendi!', error: 'Bir hata oluştu.' },
  en: { title: 'Add Patent', fields: { title: 'Patent Title', patent_no: 'Patent No', application_date: 'Application Date', grant_date: 'Grant Date', status: 'Status', description: 'Description', inventors: 'Co-Inventors' }, statuses: { applied: 'Applied', pending: 'Pending', granted: 'Granted', rejected: 'Rejected' }, inventorsHint: 'You are automatically added as an inventor.', submit: 'Save', cancel: 'Cancel', success: 'Patent added successfully!', error: 'An error occurred.' }
}

export default function AddPatentPage() {
  const [lang] = useState(() => localStorage.getItem('lang') || 'tr')
  const [loading, setLoading] = useState(false); const [errorMsg, setErrorMsg] = useState(''); const [successMsg, setSuccessMsg] = useState(''); const [status, setStatus] = useState('applied')
  const [academics, setAcademics] = useState([]); const [selectedInventors, setSelectedInventors] = useState([])
  const navigate = useNavigate(); const tx = translations[lang]
  const titleRef = useRef(); const patentNoRef = useRef(); const applicationDateRef = useRef(); const grantDateRef = useRef(); const descriptionRef = useRef()

  useEffect(() => {
    const token = localStorage.getItem('access')
    fetch('/api/v1/users/?user_type=academic&page_size=100', { headers: { 'Authorization': `Bearer ${token}` } })
      .then(r => r.json()).then(d => setAcademics(d.results || [])).catch(() => {})
  }, [])

  const toggleInventor = (id) => setSelectedInventors(prev => prev.includes(id) ? prev.filter(a => a !== id) : [...prev, id])

  const handleSubmit = async (e) => {
    e.preventDefault(); setLoading(true); setErrorMsg('')
    try {
      const token = localStorage.getItem('access')
      const user = JSON.parse(localStorage.getItem('user') || '{}')
      const allInventors = user.id ? [user.id, ...selectedInventors.filter(a => a !== user.id)] : selectedInventors
      const res = await fetch('/api/v1/patents/', { method: 'POST', headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` }, body: JSON.stringify({ title: titleRef.current.value, patent_no: patentNoRef.current.value, application_date: applicationDateRef.current.value, grant_date: grantDateRef.current.value || null, status, description: descriptionRef.current.value, inventors: allInventors }) })
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
      <div style={{ background: 'linear-gradient(135deg, #6B0000, #8B0000)', padding: '40px 48px' }}><div style={{ maxWidth: 800, margin: '0 auto' }}><a href="/dashboard" style={{ color: 'rgba(255,255,255,0.7)', fontFamily: 'Arial', fontSize: 13, textDecoration: 'none', display: 'block', marginBottom: 16 }}>← Dashboard</a><h1 style={{ color: '#fff', fontSize: 28, fontWeight: 700, margin: 0 }}>{tx.title}</h1></div></div>
      <div style={{ maxWidth: 800, margin: '40px auto 64px', padding: '0 48px' }}>
        <div style={{ background: '#fff', borderRadius: 12, padding: '40px', boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
          {errorMsg && <div style={{ background: '#fff2f0', border: '1px solid #ffccc7', borderRadius: 8, padding: '10px 16px', marginBottom: 24, color: '#cf1322', fontFamily: 'Arial', fontSize: 14 }}>{errorMsg}</div>}
          {successMsg && <div style={{ background: '#f6ffed', border: '1px solid #b7eb8f', borderRadius: 8, padding: '10px 16px', marginBottom: 24, color: '#389e0d', fontFamily: 'Arial', fontSize: 14 }}>{successMsg}</div>}
          <form onSubmit={handleSubmit}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 20 }}>
              <div style={{ gridColumn: '1 / -1' }}><label style={labelStyle}>{tx.fields.title} *</label><input ref={titleRef} type="text" required style={inputStyle} onFocus={e => e.target.style.borderColor = '#8B0000'} onBlur={e => e.target.style.borderColor = '#d9d9d9'} /></div>
              <div><label style={labelStyle}>{tx.fields.patent_no}</label><input ref={patentNoRef} type="text" style={inputStyle} onFocus={e => e.target.style.borderColor = '#8B0000'} onBlur={e => e.target.style.borderColor = '#d9d9d9'} /></div>
              <div><label style={labelStyle}>{tx.fields.status}</label><select value={status} onChange={e => setStatus(e.target.value)} style={inputStyle}>{Object.entries(tx.statuses).map(([k, v]) => <option key={k} value={k}>{v}</option>)}</select></div>
              <div><label style={labelStyle}>{tx.fields.application_date} *</label><input ref={applicationDateRef} type="date" required style={inputStyle} onFocus={e => e.target.style.borderColor = '#8B0000'} onBlur={e => e.target.style.borderColor = '#d9d9d9'} /></div>
              <div><label style={labelStyle}>{tx.fields.grant_date}</label><input ref={grantDateRef} type="date" style={inputStyle} onFocus={e => e.target.style.borderColor = '#8B0000'} onBlur={e => e.target.style.borderColor = '#d9d9d9'} /></div>
              <div style={{ gridColumn: '1 / -1' }}>
                <label style={labelStyle}>{tx.fields.inventors}</label>
                <div style={{ fontSize: 12, color: '#888', fontFamily: 'Arial', marginBottom: 8 }}>{tx.inventorsHint}</div>
                <div style={{ border: '1px solid #d9d9d9', borderRadius: 8, maxHeight: 200, overflowY: 'auto', padding: 8 }}>
                  {academics.map(a => (
                    <div key={a.id} onClick={() => toggleInventor(a.id)} style={{ padding: '8px 12px', borderRadius: 6, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 10, background: selectedInventors.includes(a.id) ? '#fff0f0' : 'transparent' }}>
                      <input type="checkbox" readOnly checked={selectedInventors.includes(a.id)} style={{ cursor: 'pointer' }} />
                      <span style={{ fontFamily: 'Arial', fontSize: 14, color: selectedInventors.includes(a.id) ? '#8B0000' : '#333' }}>{a.title ? `${a.title} ` : ''}{a.first_name} {a.last_name}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div style={{ gridColumn: '1 / -1' }}><label style={labelStyle}>{tx.fields.description}</label><textarea ref={descriptionRef} rows={4} style={{ ...inputStyle, height: 'auto', padding: '12px 16px', resize: 'vertical' }} onFocus={e => e.target.style.borderColor = '#8B0000'} onBlur={e => e.target.style.borderColor = '#d9d9d9'} /></div>
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