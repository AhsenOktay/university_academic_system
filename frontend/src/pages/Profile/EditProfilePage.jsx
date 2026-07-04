import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import Header from '../../components/Header.jsx'

const FACULTIES = {
  'Mühendislik-Mimarlık Fakültesi': ['Yazılım Mühendisliği'],
  'Sanat ve Tasarım Fakültesi': ['Gastronomi ve Mutfak Sanatları', 'İç Mimarlık ve Çevre Tasarımı', 'İletişim ve Tasarımı', 'Radyo, Televizyon ve Sinema'],
  'İnsani Bilimler Fakültesi': ['Psikoloji', 'Sosyoloji'],
  'İktisadi ve İdari Bilimler Fakültesi': ['Uluslararası Ticaret ve İşletmecilik', 'Yönetim Bilişim Sistemleri'],
  'Meslek Yüksekokulu': ['Aşçılık', 'Bankacılık ve Sigortacılık', 'Bilgisayar Destekli Tasarım ve Animasyon', 'Bilişim Güvenliği Teknolojisi', 'Eczane Hizmetleri', 'Grafik Tasarımı', 'İç Mekan Tasarımı', 'İnşaat Teknolojisi', 'Mahkeme Büro Hizmetleri', 'Mimari Restorasyon', 'Optisyenlik', 'Sivil Hava Ulaştırma İşletmeciliği', 'Sivil Havacılık Kabin Hizmetleri', 'Sosyal Hizmetler', 'Tıbbi ve Aromatik Bitkiler', 'Turist Rehberliği'],
}

const translations = {
  tr: {
    title: 'Profilimi Düzenle',
    fields: { first_name: 'Ad', last_name: 'Soyad', title: 'Unvan', email: 'E-posta', faculty: 'Fakülte', department: 'Bölüm', photo: 'Profil Fotoğrafı URL' },
    photoPlaceholder: 'https://example.com/foto.jpg',
    photoHint: 'Fotoğrafınızın URL adresini girin (isteğe bağlı)',
    titles: ['Prof. Dr.', 'Doç. Dr.', 'Dr. Öğr. Üyesi', 'Öğr. Gör.', 'Arş. Gör.', 'Dr.'],
    selectFaculty: 'Fakülte Seçiniz',
    selectDepartment: 'Bölüm Seçiniz',
    submit: 'Kaydet', cancel: 'İptal', success: 'Profil güncellendi!', error: 'Bir hata oluştu.', loading: 'Yükleniyor...',
  },
  en: {
    title: 'Edit My Profile',
    fields: { first_name: 'First Name', last_name: 'Last Name', title: 'Title', email: 'Email', faculty: 'Faculty', department: 'Department', photo: 'Profile Photo URL' },
    photoPlaceholder: 'https://example.com/photo.jpg',
    photoHint: 'Enter the URL of your photo (optional)',
    titles: ['Prof. Dr.', 'Assoc. Prof. Dr.', 'Asst. Prof. Dr.', 'Lecturer', 'Research Asst.', 'Dr.'],
    selectFaculty: 'Select Faculty',
    selectDepartment: 'Select Department',
    submit: 'Save', cancel: 'Cancel', success: 'Profile updated!', error: 'An error occurred.', loading: 'Loading...',
  }
}

export default function EditProfilePage() {
  const [lang] = useState(() => localStorage.getItem('lang') || 'tr')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')
  const [successMsg, setSuccessMsg] = useState('')
  const [titleVal, setTitleVal] = useState('')
  const [faculty, setFaculty] = useState('')
  const [department, setDepartment] = useState('')
  const [photoUrl, setPhotoUrl] = useState('')
  const [photoPreview, setPhotoPreview] = useState('')
  const [user, setUser] = useState(null)
  const navigate = useNavigate()
  const tx = translations[lang]
  const firstNameRef = useRef()
  const lastNameRef = useRef()

  useEffect(() => {
    const token = localStorage.getItem('access')
    if (!token) { navigate('/login'); return }
    fetch('/api/v1/auth/me/', { headers: { 'Authorization': `Bearer ${token}` } })
      .then(r => r.ok ? r.json() : null)
      .then(data => {
        if (!data) { navigate('/login'); return }
        setUser(data)
        setTitleVal(data.title || '')
        setFaculty(data.faculty || '')
        setDepartment(data.department || '')
        setPhotoUrl(data.profile_image_url || '')
        setPhotoPreview(data.profile_image_url || '')
        setLoading(false)
      })
      .catch(() => navigate('/login'))
  }, [])

  const handleFacultyChange = (e) => {
    setFaculty(e.target.value)
    setDepartment('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault(); setSaving(true); setErrorMsg('')
    try {
      const token = localStorage.getItem('access')
      const res = await fetch('/api/v1/auth/me/', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({
          first_name: firstNameRef.current.value,
          last_name: lastNameRef.current.value,
          title: titleVal,
          faculty,
          department,
          profile_image_url: photoUrl,
        })
      })
      if (res.ok) {
          const updated = await res.json()
          localStorage.setItem('user', JSON.stringify(updated))
          setUser(updated)
          setSuccessMsg(tx.success)
          setTimeout(() => navigate('/dashboard'), 1500)
       }
      else { const data = await res.json(); setErrorMsg(JSON.stringify(data)) }
    } catch { setErrorMsg(tx.error) }
    setSaving(false)
  }

  const inputStyle = { width: '100%', height: 48, borderRadius: 8, border: '1px solid #d9d9d9', padding: '0 16px', fontSize: 15, outline: 'none', boxSizing: 'border-box', fontFamily: 'Arial', background: '#fff' }
  const labelStyle = { display: 'block', fontSize: 13, fontWeight: 600, color: '#444', fontFamily: 'Arial', marginBottom: 6 }
  const initials = user ? `${user.first_name?.[0] || ''}${user.last_name?.[0] || ''}`.toUpperCase() : ''

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

          <div style={{ display: 'flex', alignItems: 'center', gap: 24, marginBottom: 32, padding: '20px', background: '#f8f8f6', borderRadius: 12 }}>
            <div style={{ width: 80, height: 80, borderRadius: '50%', overflow: 'hidden', flexShrink: 0, background: 'linear-gradient(135deg, #8B0000, #C0392B)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {photoPreview
                ? <img src={photoPreview} alt="profil" style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={() => setPhotoPreview('')} />
                : <span style={{ color: '#fff', fontSize: 24, fontWeight: 700 }}>{initials}</span>
              }
            </div>
            <div style={{ flex: 1 }}>
              <label style={labelStyle}>{tx.fields.photo}</label>
              <input type="url" value={photoUrl} onChange={e => { setPhotoUrl(e.target.value); setPhotoPreview(e.target.value) }} placeholder={tx.photoPlaceholder} style={inputStyle} onFocus={e => e.target.style.borderColor = '#8B0000'} onBlur={e => e.target.style.borderColor = '#d9d9d9'} />
              <div style={{ fontSize: 12, color: '#aaa', fontFamily: 'Arial', marginTop: 6 }}>{tx.photoHint}</div>
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 20 }}>
              <div>
                <label style={labelStyle}>{tx.fields.first_name} *</label>
                <input ref={firstNameRef} type="text" required defaultValue={user?.first_name} style={inputStyle} onFocus={e => e.target.style.borderColor = '#8B0000'} onBlur={e => e.target.style.borderColor = '#d9d9d9'} />
              </div>
              <div>
                <label style={labelStyle}>{tx.fields.last_name} *</label>
                <input ref={lastNameRef} type="text" required defaultValue={user?.last_name} style={inputStyle} onFocus={e => e.target.style.borderColor = '#8B0000'} onBlur={e => e.target.style.borderColor = '#d9d9d9'} />
              </div>
              <div>
                <label style={labelStyle}>{tx.fields.title}</label>
                <select value={titleVal} onChange={e => setTitleVal(e.target.value)} style={inputStyle}>
                  <option value="">{lang === 'tr' ? 'Seçiniz' : 'Select'}</option>
                  {tx.titles.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
              <div>
                <label style={labelStyle}>{tx.fields.email}</label>
                <input type="email" value={user?.email || ''} disabled style={{ ...inputStyle, background: '#f5f5f5', color: '#aaa', cursor: 'not-allowed' }} />
              </div>
              <div>
                <label style={labelStyle}>{tx.fields.faculty}</label>
                <select value={faculty} onChange={handleFacultyChange} style={inputStyle}>
                  <option value="">{tx.selectFaculty}</option>
                  {Object.keys(FACULTIES).map(f => <option key={f} value={f}>{f}</option>)}
                </select>
              </div>
              <div>
                <label style={labelStyle}>{tx.fields.department}</label>
                <select value={department} onChange={e => setDepartment(e.target.value)} style={inputStyle} disabled={!faculty}>
                  <option value="">{tx.selectDepartment}</option>
                  {faculty && FACULTIES[faculty]?.map(d => <option key={d} value={d}>{d}</option>)}
                </select>
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