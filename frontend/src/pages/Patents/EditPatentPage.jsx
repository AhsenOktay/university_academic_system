import { useState, useEffect, useRef } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import Header from '../../components/Header.jsx'

const translations = {
  tr: {
    title: 'Patent Düzenle',
    fields: { title: 'Patent Adı', patent_no: 'Patent No', application_date: 'Başvuru Tarihi', grant_date: 'Onay Tarihi', status: 'Durum', description: 'Açıklama', inventors: 'Ortak Mucitler' },
    statuses: { applied: 'Başvuru Yapıldı', pending: 'İncelemede', granted: 'Onaylandı', rejected: 'Reddedildi' },
    inventorsHint: 'Siz otomatik mucit olarak ekleniyorsunuz.',
    submit: 'Güncelle', cancel: 'İptal', success: 'Patent güncellendi!', error: 'Bir hata oluştu.', loading: 'Yükleniyor...',
  },
  en: {
    title: 'Edit Patent',
    fields: { title: 'Patent Title', patent_no: 'Patent No', application_date: 'Application Date', grant_date: 'Grant Date', status: 'Status', description: 'Description', inventors: 'Co-Inventors' },
    statuses: { applied: 'Applied', pending: 'Pending', granted: 'Granted', rejected: 'Rejected' },
    inventorsHint: 'You are automatically added as an inventor.',
    submit: 'Update', cancel: 'Cancel', success: 'Patent updated!', error: 'An error occurred.', loading: 'Loading...',
  }
}

export default function EditPatentPage() {
  const [lang] = useState(() => localStorage.getItem('lang') || 'tr')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')
  const [successMsg, setSuccessMsg] = useState('')
  const [status, setStatus] = useState('applied')
  const [data, setData] = useState(null)
  const [academics, setAcademics] = useState([])
  const [selectedInventors, setSelectedInventors] = useState([])
  const navigate = useNavigate()
  const { id } = useParams()
  const tx = translations[lang]
  const titleRef = useRef(); const patentNoRef = useRef(); const applicationDateRef = useRef()
  const grantDateRef = useRef(); const descriptionRef = useRef()
  const currentUser = JSON.parse(localStorage.getItem('user') || '{}')

  useEffect(() => {
    const token = localStorage.getItem('access')
    fetch(`/api/v1/patents/${id}/`, { headers: { 'Authorization': `Bearer ${token}` } })
      .then(r => r.ok ? r.json() : null)
      .then(d => {
        if (d) {
          setData(d)
          setStatus(d.status || 'applied')
          const others = (d.inventors || []).filter(i => i !== currentUser.id)
          setSelectedInventors(others)
        }
        setLoading(false)
      })
    fetch('/api/v1/users/?user_type=academic&page_size=100', { headers: { 'Authorization': `Bearer ${token}` } })
      .then(r => r.json()).then(d => setAcademics(d.results || [])).catch(() => {})
  }, [id])

  const toggleInventor = (iid) => setSelectedInventors(prev => prev.includes(iid) ? prev.filter(a => a !== iid) : [...prev, iid])

  const handleSubmit = async (e) => {
    e.preventDefault(); setSaving(true); setErrorMsg('')
    try {
      const token = localStorage.getItem('access')
      const allInventors = currentUser.id ? [currentUser.id, ...selectedInventors.filter(i => i !== currentUser.id)] : selectedInventors
      const res = await fetch(`/api/v1/patents/${id}/`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({
          title: titleRef.current.value,
          patent_no: patentNoRef.current.value,
          application_date: applicationDateRef.current.value,
          grant_date: grantDateRef.current.value || null,
          status,
          description: descriptionRef.current.value,
          inventors: allInventors,
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
              <div><label style={labelStyle}>{tx.fields.patent_no}</label><input ref={patentNoRef} type="text" defaultValue={data?.patent_no} style={inputStyle} onFocus={e => e.target.style.borderColor = '#8B0000'} onBlur={e => e.target.style.borderColor = '#d9d9d9'} /></div>
              <div><label style={labelStyle}>{tx.fields.status}</label><select value={status} onChange={e => setStatus(e.target.value)} style={inputStyle}>{Object.entries(tx.statuses).map(([k, v]) => <option key={k} value={k}>{v}</option>)}</select></div>
              <div><label style={labelStyle}>{tx.fields.application_date}</label><input ref={applicationDateRef} type="date" defaultValue={data?.application_date} style={inputStyle} onFocus={e => e.target.style.borderColor = '#8B0000'} onBlur={e => e.target.style.borderColor = '#d9d9d9'} /></div>
              <div><label style={labelStyle}>{tx.fields.grant_date}</label><input ref={grantDateRef} type="date" defaultValue={data?.grant_date} style={inputStyle} onFocus={e => e.target.style.borderColor = '#8B0000'} onBlur={e => e.target.style.borderColor = '#d9d9d9'} /></div>
              <div style={{ gridColumn: '1 / -1' }}>
                <label style={labelStyle}>{tx.fields.inventors}</label>
                <div style={{ fontSize: 12, color: '#888', fontFamily: 'Arial', marginBottom: 8 }}>{tx.inventorsHint}</div>
                <div style={{ border: '1px solid #d9d9d9', borderRadius: 8, maxHeight: 200, overflowY: 'auto', padding: 8 }}>
                  {academics.map(a => {
                    const isMe = a.id === currentUser.id
                    return (
                      <div key={a.id} onClick={() => !isMe && toggleInventor(a.id)} style={{ padding: '8px 12px', borderRadius: 6, cursor: isMe ? 'default' : 'pointer', display: 'flex', alignItems: 'center', gap: 10, background: isMe || selectedInventors.includes(a.id) ? '#fff0f0' : 'transparent' }}>
                        <input type="checkbox" readOnly checked={isMe || selectedInventors.includes(a.id)} disabled={isMe} style={{ cursor: isMe ? 'default' : 'pointer' }} />
                        <span style={{ fontFamily: 'Arial', fontSize: 14, color: isMe || selectedInventors.includes(a.id) ? '#8B0000' : '#333' }}>
                          {a.title ? `${a.title} ` : ''}{a.first_name} {a.last_name}
                          {isMe && <span style={{ fontSize: 11, color: '#888', marginLeft: 6 }}>(Sen)</span>}
                        </span>
                      </div>
                    )
                  })}
                </div>
              </div>
              <div style={{ gridColumn: '1 / -1' }}><label style={labelStyle}>{tx.fields.description}</label><textarea ref={descriptionRef} rows={4} defaultValue={data?.description} style={{ ...inputStyle, height: 'auto', padding: '12px 16px', resize: 'vertical' }} onFocus={e => e.target.style.borderColor = '#8B0000'} onBlur={e => e.target.style.borderColor = '#d9d9d9'} /></div>
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