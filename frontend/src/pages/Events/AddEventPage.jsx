import { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import Header from '../../components/Header.jsx'

const translations = {
  tr: {
    title: 'Etkinlik Ekle',
    fields: { title: 'Etkinlik Adı', title_en: 'İngilizce Ad', event_type: 'Etkinlik Türü', role: 'Rolünüz', location: 'Yer', start_date: 'Başlangıç Tarihi', end_date: 'Bitiş Tarihi', description: 'Açıklama', url: 'URL' },
    types: { conference: 'Konferans', seminar: 'Seminer', workshop: 'Workshop', panel: 'Panel', symposium: 'Sempozyum', other: 'Diğer' },
    roles: { organizer: 'Organizatör', speaker: 'Konuşmacı', participant: 'Katılımcı', chair: 'Oturum Başkanı' },
    submit: 'Kaydet', cancel: 'İptal', success: 'Etkinlik başarıyla eklendi!', error: 'Bir hata oluştu.',
  },
  en: {
    title: 'Add Event',
    fields: { title: 'Event Title', title_en: 'English Title', event_type: 'Event Type', role: 'Your Role', location: 'Location', start_date: 'Start Date', end_date: 'End Date', description: 'Description', url: 'URL' },
    types: { conference: 'Conference', seminar: 'Seminar', workshop: 'Workshop', panel: 'Panel', symposium: 'Symposium', other: 'Other' },
    roles: { organizer: 'Organizer', speaker: 'Speaker', participant: 'Participant', chair: 'Session Chair' },
    submit: 'Save', cancel: 'Cancel', success: 'Event added successfully!', error: 'An error occurred.',
  }
}

export default function AddEventPage() {
  const [lang] = useState(() => localStorage.getItem('lang') || 'tr')
  const [loading, setLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')
  const [successMsg, setSuccessMsg] = useState('')
  const [eventType, setEventType] = useState('conference')
  const [role, setRole] = useState('organizer')
  const navigate = useNavigate()
  const tx = translations[lang]
  const titleRef = useRef(); const titleEnRef = useRef(); const locationRef = useRef()
  const startDateRef = useRef(); const endDateRef = useRef(); const descriptionRef = useRef(); const urlRef = useRef()

  const handleSubmit = async (e) => {
    e.preventDefault(); setLoading(true); setErrorMsg('')
    try {
      const token = localStorage.getItem('access')
      const res = await fetch('/api/v1/events/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({
          title: titleRef.current.value,
          title_en: titleEnRef.current.value,
          event_type: eventType,
          role,
          location: locationRef.current.value,
          start_date: startDateRef.current.value,
          end_date: endDateRef.current.value || null,
          description: descriptionRef.current.value,
          url: urlRef.current.value,
        }),
      })
      if (res.ok) { setSuccessMsg(tx.success); setTimeout(() => navigate('/dashboard'), 1500) }
      else { const d = await res.json(); setErrorMsg(JSON.stringify(d)) }
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
              <div><label style={labelStyle}>{tx.fields.event_type}</label><select value={eventType} onChange={e => setEventType(e.target.value)} style={inputStyle}>{Object.entries(tx.types).map(([k, v]) => <option key={k} value={k}>{v}</option>)}</select></div>
              <div><label style={labelStyle}>{tx.fields.role}</label><select value={role} onChange={e => setRole(e.target.value)} style={inputStyle}>{Object.entries(tx.roles).map(([k, v]) => <option key={k} value={k}>{v}</option>)}</select></div>
              <div style={{ gridColumn: '1 / -1' }}><label style={labelStyle}>{tx.fields.location}</label><input ref={locationRef} type="text" style={inputStyle} onFocus={e => e.target.style.borderColor = '#8B0000'} onBlur={e => e.target.style.borderColor = '#d9d9d9'} /></div>
              <div><label style={labelStyle}>{tx.fields.start_date} *</label><input ref={startDateRef} type="date" required style={inputStyle} onFocus={e => e.target.style.borderColor = '#8B0000'} onBlur={e => e.target.style.borderColor = '#d9d9d9'} /></div>
              <div><label style={labelStyle}>{tx.fields.end_date}</label><input ref={endDateRef} type="date" style={inputStyle} onFocus={e => e.target.style.borderColor = '#8B0000'} onBlur={e => e.target.style.borderColor = '#d9d9d9'} /></div>
              <div style={{ gridColumn: '1 / -1' }}><label style={labelStyle}>{tx.fields.url}</label><input ref={urlRef} type="url" placeholder="https://" style={inputStyle} onFocus={e => e.target.style.borderColor = '#8B0000'} onBlur={e => e.target.style.borderColor = '#d9d9d9'} /></div>
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