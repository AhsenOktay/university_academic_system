import { useState, useEffect, useRef } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import Header from '../../components/Header.jsx'

const translations = {
  tr: {
    title: 'Proje Düzenle',
    fields: { title: 'Proje Başlığı', title_en: 'İngilizce Başlık', description: 'Açıklama', project_type: 'Proje Türü', status: 'Durum', start_date: 'Başlangıç Tarihi', end_date: 'Bitiş Tarihi', budget: 'Bütçe (₺)', members: 'Proje Üyeleri' },
    types: { tubitak: 'TÜBİTAK', bap: 'BAP', eu: 'AB Projesi', industry: 'Sanayi', other: 'Diğer' },
    statuses: { ongoing: 'Devam Ediyor', completed: 'Tamamlandı', cancelled: 'İptal' },
    membersHint: 'Siz otomatik koordinatör olarak ekleniyorsunuz.',
    submit: 'Güncelle', cancel: 'İptal', success: 'Proje güncellendi!', error: 'Bir hata oluştu.', loading: 'Yükleniyor...',
  },
  en: {
    title: 'Edit Project',
    fields: { title: 'Project Title', title_en: 'English Title', description: 'Description', project_type: 'Project Type', status: 'Status', start_date: 'Start Date', end_date: 'End Date', budget: 'Budget (₺)', members: 'Project Members' },
    types: { tubitak: 'TÜBİTAK', bap: 'BAP', eu: 'EU Project', industry: 'Industry', other: 'Other' },
    statuses: { ongoing: 'Ongoing', completed: 'Completed', cancelled: 'Cancelled' },
    membersHint: 'You are automatically added as coordinator.',
    submit: 'Update', cancel: 'Cancel', success: 'Project updated!', error: 'An error occurred.', loading: 'Loading...',
  }
}

export default function EditProjectPage() {
  const [lang] = useState(() => localStorage.getItem('lang') || 'tr')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')
  const [successMsg, setSuccessMsg] = useState('')
  const [projectType, setProjectType] = useState('tubitak')
  const [status, setStatus] = useState('ongoing')
  const [data, setData] = useState(null)
  const [academics, setAcademics] = useState([])
  const [selectedMembers, setSelectedMembers] = useState([])
  const navigate = useNavigate()
  const { id } = useParams()
  const tx = translations[lang]
  const titleRef = useRef(); const titleEnRef = useRef(); const descriptionRef = useRef()
  const startDateRef = useRef(); const endDateRef = useRef(); const budgetRef = useRef()
  const currentUser = JSON.parse(localStorage.getItem('user') || '{}')

  useEffect(() => {
    const token = localStorage.getItem('access')
    fetch(`/api/v1/projects/${id}/`, { headers: { 'Authorization': `Bearer ${token}` } })
      .then(r => r.ok ? r.json() : null)
      .then(d => {
        if (d) {
          setData(d)
          setProjectType(d.project_type || 'tubitak')
          setStatus(d.status || 'ongoing')
          const otherMembers = (d.members || []).filter(m => m !== currentUser.id)
          setSelectedMembers(otherMembers)
        }
        setLoading(false)
      })
    fetch('/api/v1/users/?user_type=academic&page_size=100', { headers: { 'Authorization': `Bearer ${token}` } })
      .then(r => r.json()).then(d => setAcademics(d.results || [])).catch(() => {})
  }, [id])

  const toggleMember = (mid) => setSelectedMembers(prev => prev.includes(mid) ? prev.filter(m => m !== mid) : [...prev, mid])

  const handleSubmit = async (e) => {
    e.preventDefault(); setSaving(true); setErrorMsg('')
    try {
      const token = localStorage.getItem('access')
      const allMembers = currentUser.id ? [currentUser.id, ...selectedMembers.filter(m => m !== currentUser.id)] : selectedMembers
      const res = await fetch(`/api/v1/projects/${id}/`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({
          title: titleRef.current.value,
          title_en: titleEnRef.current.value,
          description: descriptionRef.current.value,
          project_type: projectType,
          status,
          start_date: startDateRef.current.value || null,
          end_date: endDateRef.current.value || null,
          budget: budgetRef.current.value ? parseFloat(budgetRef.current.value) : null,
          members: allMembers,
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
              <div><label style={labelStyle}>{tx.fields.project_type}</label><select value={projectType} onChange={e => setProjectType(e.target.value)} style={inputStyle}>{Object.entries(tx.types).map(([k, v]) => <option key={k} value={k}>{v}</option>)}</select></div>
              <div><label style={labelStyle}>{tx.fields.status}</label><select value={status} onChange={e => setStatus(e.target.value)} style={inputStyle}>{Object.entries(tx.statuses).map(([k, v]) => <option key={k} value={k}>{v}</option>)}</select></div>
              <div><label style={labelStyle}>{tx.fields.start_date}</label><input ref={startDateRef} type="date" defaultValue={data?.start_date} style={inputStyle} onFocus={e => e.target.style.borderColor = '#8B0000'} onBlur={e => e.target.style.borderColor = '#d9d9d9'} /></div>
              <div><label style={labelStyle}>{tx.fields.end_date}</label><input ref={endDateRef} type="date" defaultValue={data?.end_date} style={inputStyle} onFocus={e => e.target.style.borderColor = '#8B0000'} onBlur={e => e.target.style.borderColor = '#d9d9d9'} /></div>
              <div><label style={labelStyle}>{tx.fields.budget}</label><input ref={budgetRef} type="number" min="0" defaultValue={data?.budget} style={inputStyle} onFocus={e => e.target.style.borderColor = '#8B0000'} onBlur={e => e.target.style.borderColor = '#d9d9d9'} /></div>
              <div style={{ gridColumn: '1 / -1' }}>
                <label style={labelStyle}>{tx.fields.members}</label>
                <div style={{ fontSize: 12, color: '#888', fontFamily: 'Arial', marginBottom: 8 }}>{tx.membersHint}</div>
                <div style={{ border: '1px solid #d9d9d9', borderRadius: 8, maxHeight: 200, overflowY: 'auto', padding: 8 }}>
                  {academics.map(a => {
                    const isMe = a.id === currentUser.id
                    return (
                      <div key={a.id} onClick={() => !isMe && toggleMember(a.id)} style={{ padding: '8px 12px', borderRadius: 6, cursor: isMe ? 'default' : 'pointer', display: 'flex', alignItems: 'center', gap: 10, background: isMe || selectedMembers.includes(a.id) ? '#fff0f0' : 'transparent' }}>
                        <input type="checkbox" readOnly checked={isMe || selectedMembers.includes(a.id)} disabled={isMe} style={{ cursor: isMe ? 'default' : 'pointer' }} />
                        <span style={{ fontFamily: 'Arial', fontSize: 14, color: isMe || selectedMembers.includes(a.id) ? '#8B0000' : '#333' }}>
                          {a.title ? `${a.title} ` : ''}{a.first_name} {a.last_name}
                          {isMe && <span style={{ fontSize: 11, color: '#888', marginLeft: 6 }}>(Sen)</span>}
                          {a.department && <span style={{ color: '#888', fontSize: 12 }}> • {a.department}</span>}
                        </span>
                      </div>
                    )
                  })}
                </div>
              </div>
              <div style={{ gridColumn: '1 / -1' }}><label style={labelStyle}>{tx.fields.description}</label><textarea ref={descriptionRef} rows={5} defaultValue={data?.description} style={{ ...inputStyle, height: 'auto', padding: '12px 16px', resize: 'vertical' }} onFocus={e => e.target.style.borderColor = '#8B0000'} onBlur={e => e.target.style.borderColor = '#d9d9d9'} /></div>
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