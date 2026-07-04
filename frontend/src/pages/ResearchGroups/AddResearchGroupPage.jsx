import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import Header from '../../components/Header.jsx'

const translations = {
  tr: {
    title: 'Araştırma Grubu Oluştur',
    fields: { name: 'Grup Adı', name_en: 'Grup Adı (İngilizce)', description: 'Açıklama', description_en: 'Açıklama (İngilizce)', founder: 'Grup Lideri', members: 'Üyeler', is_active: 'Aktif' },
    selectFounder: 'Lider seçin...',
    selectMembers: 'Üye eklemek için tıklayın',
    submit: 'Oluştur', cancel: 'İptal', success: 'Araştırma grubu oluşturuldu!', error: 'Bir hata oluştu.', loading: 'Yükleniyor...',
    selectedMembers: 'Seçilen Üyeler',
    remove: 'Kaldır',
  },
  en: {
    title: 'Create Research Group',
    fields: { name: 'Group Name', name_en: 'Group Name (English)', description: 'Description', description_en: 'Description (English)', founder: 'Group Leader', members: 'Members', is_active: 'Active' },
    selectFounder: 'Select leader...',
    selectMembers: 'Click to add members',
    submit: 'Create', cancel: 'Cancel', success: 'Research group created!', error: 'An error occurred.', loading: 'Loading...',
    selectedMembers: 'Selected Members',
    remove: 'Remove',
  }
}

export default function AddResearchGroupPage() {
  const [lang] = useState(() => localStorage.getItem('lang') || 'tr')
  const [loading, setLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')
  const [successMsg, setSuccessMsg] = useState('')
  const [isActive, setIsActive] = useState(true)
  const [academics, setAcademics] = useState([])
  const [founder, setFounder] = useState('')
  const [selectedMembers, setSelectedMembers] = useState([])
  const navigate = useNavigate()
  const tx = translations[lang]
  const nameRef = useRef(); const nameEnRef = useRef(); const descRef = useRef(); const descEnRef = useRef()

  useEffect(() => {
    fetch('/api/v1/users/?role=academic&page_size=100')
      .then(r => r.json())
      .then(d => setAcademics(d.results || []))
      .catch(() => {})
  }, [])

  const toggleMember = (id) => {
    setSelectedMembers(prev => prev.includes(id) ? prev.filter(m => m !== id) : [...prev, id])
  }

  const handleSubmit = async (e) => {
    e.preventDefault(); setLoading(true); setErrorMsg('')
    try {
      const token = localStorage.getItem('access')
      const res = await fetch('/api/v1/research-groups/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({
          name: nameRef.current.value,
          name_en: nameEnRef.current.value,
          description: descRef.current.value,
          description_en: descEnRef.current.value,
          founder: founder || null,
          members: selectedMembers,
          is_active: isActive,
        })
      })
      if (res.ok) { setSuccessMsg(tx.success); setTimeout(() => navigate('/groups'), 1500) }
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
          <a href="/groups" style={{ color: 'rgba(255,255,255,0.7)', fontFamily: 'Arial', fontSize: 13, textDecoration: 'none', display: 'block', marginBottom: 16 }}>← {lang === 'tr' ? 'Araştırma Grupları' : 'Research Groups'}</a>
          <h1 style={{ color: '#fff', fontSize: 28, fontWeight: 700, margin: 0 }}>{tx.title}</h1>
        </div>
      </div>
      <div style={{ maxWidth: 800, margin: '40px auto 64px', padding: '0 48px' }}>
        <div style={{ background: '#fff', borderRadius: 12, padding: '40px', boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
          {errorMsg && <div style={{ background: '#fff2f0', border: '1px solid #ffccc7', borderRadius: 8, padding: '10px 16px', marginBottom: 24, color: '#cf1322', fontFamily: 'Arial', fontSize: 14 }}>{errorMsg}</div>}
          {successMsg && <div style={{ background: '#f6ffed', border: '1px solid #b7eb8f', borderRadius: 8, padding: '10px 16px', marginBottom: 24, color: '#389e0d', fontFamily: 'Arial', fontSize: 14 }}>{successMsg}</div>}
          <form onSubmit={handleSubmit}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20, marginBottom: 20 }}>
              <div><label style={labelStyle}>{tx.fields.name} *</label><input ref={nameRef} type="text" required style={inputStyle} onFocus={e => e.target.style.borderColor = '#8B0000'} onBlur={e => e.target.style.borderColor = '#d9d9d9'} /></div>
              <div><label style={labelStyle}>{tx.fields.name_en}</label><input ref={nameEnRef} type="text" style={inputStyle} onFocus={e => e.target.style.borderColor = '#8B0000'} onBlur={e => e.target.style.borderColor = '#d9d9d9'} /></div>
              <div><label style={labelStyle}>{tx.fields.description}</label><textarea ref={descRef} rows={3} style={{ ...inputStyle, height: 'auto', padding: '12px 16px', resize: 'vertical' }} onFocus={e => e.target.style.borderColor = '#8B0000'} onBlur={e => e.target.style.borderColor = '#d9d9d9'} /></div>
              <div><label style={labelStyle}>{tx.fields.description_en}</label><textarea ref={descEnRef} rows={3} style={{ ...inputStyle, height: 'auto', padding: '12px 16px', resize: 'vertical' }} onFocus={e => e.target.style.borderColor = '#8B0000'} onBlur={e => e.target.style.borderColor = '#d9d9d9'} /></div>

              <div>
                <label style={labelStyle}>{tx.fields.founder}</label>
                <select value={founder} onChange={e => setFounder(e.target.value)} style={inputStyle}>
                  <option value="">{tx.selectFounder}</option>
                  {academics.map(a => <option key={a.id} value={a.id}>{a.title ? `${a.title} ` : ''}{a.first_name} {a.last_name}</option>)}
                </select>
              </div>

              <div>
                <label style={labelStyle}>{tx.fields.members}</label>
                <div style={{ border: '1px solid #d9d9d9', borderRadius: 8, maxHeight: 200, overflowY: 'auto', padding: 8 }}>
                  {academics.map(a => (
                    <div key={a.id} onClick={() => toggleMember(a.id)} style={{ padding: '8px 12px', borderRadius: 6, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 10, background: selectedMembers.includes(a.id) ? '#fff0f0' : 'transparent' }}>
                      <input type="checkbox" readOnly checked={selectedMembers.includes(a.id)} style={{ cursor: 'pointer' }} />
                      <span style={{ fontFamily: 'Arial', fontSize: 14, color: selectedMembers.includes(a.id) ? '#8B0000' : '#333' }}>
                        {a.title ? `${a.title} ` : ''}{a.first_name} {a.last_name}
                        {a.department && <span style={{ color: '#888', fontSize: 12 }}> • {a.department}</span>}
                      </span>
                    </div>
                  ))}
                </div>
                {selectedMembers.length > 0 && (
                  <div style={{ marginTop: 8, display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                    {selectedMembers.map(id => {
                      const a = academics.find(ac => ac.id === id)
                      return a ? (
                        <span key={id} style={{ background: '#8B0000', color: '#fff', padding: '4px 10px', borderRadius: 20, fontSize: 12, fontFamily: 'Arial', display: 'flex', alignItems: 'center', gap: 6 }}>
                          {a.first_name} {a.last_name}
                          <button type="button" onClick={() => toggleMember(id)} style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer', fontSize: 14, padding: 0 }}>×</button>
                        </span>
                      ) : null
                    })}
                  </div>
                )}
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <input type="checkbox" id="isActive" checked={isActive} onChange={e => setIsActive(e.target.checked)} style={{ width: 18, height: 18, cursor: 'pointer' }} />
                <label htmlFor="isActive" style={{ ...labelStyle, margin: 0, cursor: 'pointer' }}>{tx.fields.is_active}</label>
              </div>
            </div>
            <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end' }}>
              <button type="button" onClick={() => navigate('/groups')} style={{ height: 44, borderRadius: 8, padding: '0 24px', background: '#fff', border: '1px solid #d9d9d9', color: '#666', fontSize: 14, fontFamily: 'Arial', cursor: 'pointer' }}>{tx.cancel}</button>
              <button type="submit" disabled={loading} style={{ height: 44, borderRadius: 8, padding: '0 32px', background: '#8B0000', border: 'none', color: '#fff', fontSize: 14, fontWeight: 600, fontFamily: 'Arial', cursor: loading ? 'not-allowed' : 'pointer' }}>{loading ? '...' : tx.submit}</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}