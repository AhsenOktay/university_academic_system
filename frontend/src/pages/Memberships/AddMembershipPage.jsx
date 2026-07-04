import { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import Header from '../../components/Header.jsx'

const translations = {
  tr: {
    title: 'Üyelik Ekle',
    fields: { organization: 'Kuruluş Adı', role: 'Rolünüz', membership_type: 'Üyelik Türü', start_year: 'Başlangıç Yılı', end_year: 'Bitiş Yılı', is_active: 'Aktif Üyelik' },
    types: { association: 'Dernek', journal: 'Dergi', committee: 'Komite', board: 'Yönetim Kurulu', other: 'Diğer' },
    submit: 'Kaydet', cancel: 'İptal', success: 'Üyelik başarıyla eklendi!', error: 'Bir hata oluştu.',
  },
  en: {
    title: 'Add Membership',
    fields: { organization: 'Organization Name', role: 'Your Role', membership_type: 'Membership Type', start_year: 'Start Year', end_year: 'End Year', is_active: 'Active Membership' },
    types: { association: 'Association', journal: 'Journal', committee: 'Committee', board: 'Board', other: 'Other' },
    submit: 'Save', cancel: 'Cancel', success: 'Membership added successfully!', error: 'An error occurred.',
  }
}

export default function AddMembershipPage() {
  const [lang] = useState(() => localStorage.getItem('lang') || 'tr')
  const [loading, setLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')
  const [successMsg, setSuccessMsg] = useState('')
  const [membershipType, setMembershipType] = useState('association')
  const [isActive, setIsActive] = useState(true)
  const navigate = useNavigate()
  const tx = translations[lang]
  const organizationRef = useRef(); const roleRef = useRef(); const startYearRef = useRef(); const endYearRef = useRef()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true); setErrorMsg('')
    try {
      const token = localStorage.getItem('access')
      const res = await fetch('/api/v1/memberships/', { method: 'POST', headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` }, body: JSON.stringify({ organization: organizationRef.current.value, role: roleRef.current.value, membership_type: membershipType, start_year: parseInt(startYearRef.current.value), end_year: endYearRef.current.value ? parseInt(endYearRef.current.value) : null, is_active: isActive }) })
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
              <div style={{ gridColumn: '1 / -1' }}><label style={labelStyle}>{tx.fields.organization} *</label><input ref={organizationRef} type="text" required style={inputStyle} onFocus={e => e.target.style.borderColor = '#8B0000'} onBlur={e => e.target.style.borderColor = '#d9d9d9'} /></div>
              <div style={{ gridColumn: '1 / -1' }}><label style={labelStyle}>{tx.fields.role}</label><input ref={roleRef} type="text" style={inputStyle} onFocus={e => e.target.style.borderColor = '#8B0000'} onBlur={e => e.target.style.borderColor = '#d9d9d9'} /></div>
              <div><label style={labelStyle}>{tx.fields.membership_type}</label><select value={membershipType} onChange={e => setMembershipType(e.target.value)} style={inputStyle}>{Object.entries(tx.types).map(([k, v]) => <option key={k} value={k}>{v}</option>)}</select></div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, paddingTop: 24 }}>
                <input type="checkbox" id="isActive" checked={isActive} onChange={e => setIsActive(e.target.checked)} style={{ width: 18, height: 18, cursor: 'pointer' }} />
                <label htmlFor="isActive" style={{ ...labelStyle, margin: 0, cursor: 'pointer' }}>{tx.fields.is_active}</label>
              </div>
              <div><label style={labelStyle}>{tx.fields.start_year} *</label><input ref={startYearRef} type="number" required min="1950" max="2030" defaultValue={new Date().getFullYear()} style={inputStyle} onFocus={e => e.target.style.borderColor = '#8B0000'} onBlur={e => e.target.style.borderColor = '#d9d9d9'} /></div>
              <div><label style={labelStyle}>{tx.fields.end_year}</label><input ref={endYearRef} type="number" min="1950" max="2030" style={inputStyle} onFocus={e => e.target.style.borderColor = '#8B0000'} onBlur={e => e.target.style.borderColor = '#d9d9d9'} /></div>
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