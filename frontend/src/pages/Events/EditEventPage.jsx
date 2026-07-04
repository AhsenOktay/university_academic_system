import { useState, useEffect, useRef } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import Header from '../../components/Header.jsx'

const t = {
  tr: { title: 'Etkinlik Düzenle', types: { conference: 'Konferans', seminar: 'Seminer', workshop: 'Workshop', panel: 'Panel', symposium: 'Sempozyum', other: 'Diğer' }, roles: { organizer: 'Organizatör', speaker: 'Konuşmacı', participant: 'Katılımcı', chair: 'Oturum Başkanı' }, submit: 'Güncelle', cancel: 'İptal', loading: 'Yükleniyor...' },
  en: { title: 'Edit Event', types: { conference: 'Conference', seminar: 'Seminar', workshop: 'Workshop', panel: 'Panel', symposium: 'Symposium', other: 'Other' }, roles: { organizer: 'Organizer', speaker: 'Speaker', participant: 'Participant', chair: 'Session Chair' }, submit: 'Update', cancel: 'Cancel', loading: 'Loading...' }
}

export default function EditEventPage() {
  const [lang] = useState(() => localStorage.getItem('lang') || 'tr')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')
  const [successMsg, setSuccessMsg] = useState('')
  const [eventType, setEventType] = useState('conference')
  const [role, setRole] = useState('organizer')
  const [data, setData] = useState(null)
  const navigate = useNavigate(); const { id } = useParams(); const tx = t[lang]
  const titleRef = useRef(); const locationRef = useRef(); const startDateRef = useRef(); const endDateRef = useRef(); const descRef = useRef(); const urlRef = useRef()

  useEffect(() => {
    const token = localStorage.getItem('access')
    fetch(`/api/v1/events/${id}/`, { headers: { 'Authorization': `Bearer ${token}` } })
      .then(r => r.ok ? r.json() : null)
      .then(d => { if (d) { setData(d); setEventType(d.event_type); setRole(d.role) }; setLoading(false) })
  }, [id])

  const handleSubmit = async (e) => {
    e.preventDefault(); setSaving(true); setErrorMsg('')
    try {
      const token = localStorage.getItem('access')
      const res = await fetch(`/api/v1/events/${id}/`, { method: 'PATCH', headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` }, body: JSON.stringify({ title: titleRef.current.value, event_type: eventType, role, location: locationRef.current.value, start_date: startDateRef.current.value, end_date: endDateRef.current.value || null, description: descRef.current.value, url: urlRef.current.value }) })
      if (res.ok) { setSuccessMsg(lang === 'tr' ? 'Güncellendi!' : 'Updated!'); setTimeout(() => navigate('/dashboard'), 1500) }
      else { const d = await res.json(); setErrorMsg(JSON.stringify(d)) }
    } catch { setErrorMsg(lang === 'tr' ? 'Hata oluştu.' : 'Error occurred.') }
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
              <div style={{ gridColumn: '1/-1' }}><label style={labelStyle}>{lang === 'tr' ? 'Etkinlik Adı' : 'Title'} *</label><input ref={titleRef} type="text" required defaultValue={data?.title} style={inputStyle} onFocus={e => e.target.style.borderColor = '#8B0000'} onBlur={e => e.target.style.borderColor = '#d9d9d9'} /></div>
              <div><label style={labelStyle}>{lang === 'tr' ? 'Tür' : 'Type'}</label><select value={eventType} onChange={e => setEventType(e.target.value)} style={inputStyle}>{Object.entries(tx.types).map(([k,v]) => <option key={k} value={k}>{v}</option>)}</select></div>
              <div><label style={labelStyle}>{lang === 'tr' ? 'Rol' : 'Role'}</label><select value={role} onChange={e => setRole(e.target.value)} style={inputStyle}>{Object.entries(tx.roles).map(([k,v]) => <option key={k} value={k}>{v}</option>)}</select></div>
              <div style={{ gridColumn: '1/-1' }}><label style={labelStyle}>{lang === 'tr' ? 'Yer' : 'Location'}</label><input ref={locationRef} type="text" defaultValue={data?.location} style={inputStyle} onFocus={e => e.target.style.borderColor = '#8B0000'} onBlur={e => e.target.style.borderColor = '#d9d9d9'} /></div>
              <div><label style={labelStyle}>{lang === 'tr' ? 'Başlangıç' : 'Start Date'} *</label><input ref={startDateRef} type="date" required defaultValue={data?.start_date} style={inputStyle} onFocus={e => e.target.style.borderColor = '#8B0000'} onBlur={e => e.target.style.borderColor = '#d9d9d9'} /></div>
              <div><label style={labelStyle}>{lang === 'tr' ? 'Bitiş' : 'End Date'}</label><input ref={endDateRef} type="date" defaultValue={data?.end_date} style={inputStyle} onFocus={e => e.target.style.borderColor = '#8B0000'} onBlur={e => e.target.style.borderColor = '#d9d9d9'} /></div>
              <div style={{ gridColumn: '1/-1' }}><label style={labelStyle}>URL</label><input ref={urlRef} type="url" defaultValue={data?.url} style={inputStyle} onFocus={e => e.target.style.borderColor = '#8B0000'} onBlur={e => e.target.style.borderColor = '#d9d9d9'} /></div>
              <div style={{ gridColumn: '1/-1' }}><label style={labelStyle}>{lang === 'tr' ? 'Açıklama' : 'Description'}</label><textarea ref={descRef} rows={4} defaultValue={data?.description} style={{ ...inputStyle, height: 'auto', padding: '12px 16px', resize: 'vertical' }} onFocus={e => e.target.style.borderColor = '#8B0000'} onBlur={e => e.target.style.borderColor = '#d9d9d9'} /></div>
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