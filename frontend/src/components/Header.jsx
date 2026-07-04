import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { GlobalOutlined, LogoutOutlined, DownOutlined } from '@ant-design/icons'

const academicItems = {
  tr: [
    { label: 'Yayınlar', href: '/publications' },
    { label: 'Projeler', href: '/projects' },
    { label: 'Tezler', href: '/theses' },
    { label: 'Ödüller', href: '/awards' },
    { label: 'Patentler', href: '/patents' },
    { label: 'Etkinlikler', href: '/events' },
    { label: 'Dersler', href: '/courses' },
    { label: 'Üyelikler', href: '/memberships' },
  ],
  en: [
    { label: 'Publications', href: '/publications' },
    { label: 'Projects', href: '/projects' },
    { label: 'Theses', href: '/theses' },
    { label: 'Awards', href: '/awards' },
    { label: 'Patents', href: '/patents' },
    { label: 'Events', href: '/events' },
    { label: 'Courses', href: '/courses' },
    { label: 'Memberships', href: '/memberships' },
  ],
}

export default function Header({ activeIndex = -1, lang, setLang }) {
  const [user, setUser] = useState(null)
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [showLogoutModal, setShowLogoutModal] = useState(false)
  const navigate = useNavigate()
  const currentLang = lang || 'tr'

  useEffect(() => {
    const token = localStorage.getItem('access')
    if (!token) return
    fetch('/api/v1/auth/me/', { headers: { 'Authorization': `Bearer ${token}` } })
      .then(r => r.ok ? r.json() : null)
      .then(data => { if (data) setUser(data) })
      .catch(() => {})
  }, [])

  useEffect(() => {
    const close = () => setDropdownOpen(false)
    document.addEventListener('click', close)
    return () => document.removeEventListener('click', close)
  }, [])

  const handleLogout = () => setShowLogoutModal(true)

  const confirmLogout = () => {
    localStorage.removeItem('access')
    localStorage.removeItem('refresh')
    localStorage.removeItem('user')
    navigate('/login')
  }

  return (
    <>
      <header style={{
        background: '#fff', borderBottom: '3px solid #8B0000',
        padding: '0 48px', display: 'flex', alignItems: 'center',
        justifyContent: 'space-between', height: 72,
        position: 'sticky', top: 0, zIndex: 100,
        boxShadow: '0 2px 12px rgba(139,0,0,0.08)',
      }}>
        <a href="/"><img src="/logo.png" alt="logo" style={{ height: 48, objectFit: 'contain' }} /></a>

        <nav style={{ display: 'flex', gap: 32, alignItems: 'center' }}>
          <div style={{ position: 'relative' }} onClick={e => e.stopPropagation()}>
            <button onClick={() => setDropdownOpen(prev => !prev)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: dropdownOpen ? '#8B0000' : '#222', fontSize: 14, fontFamily: 'Arial', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 4, padding: 0 }}>
              {currentLang === 'tr' ? 'Akademik Çıktılar' : 'Academic Outputs'}
              <DownOutlined style={{ fontSize: 10, transition: 'transform 0.2s', transform: dropdownOpen ? 'rotate(180deg)' : 'rotate(0deg)' }} />
            </button>
            {dropdownOpen && (
              <div style={{ position: 'absolute', top: '100%', left: '50%', transform: 'translateX(-50%)', marginTop: 12, background: '#fff', borderRadius: 10, boxShadow: '0 8px 32px rgba(0,0,0,0.12)', border: '1px solid #f0f0f0', minWidth: 180, zIndex: 200, overflow: 'hidden' }}>
                {academicItems[currentLang].map((item, i) => (
                  <a key={item.href} href={item.href} style={{ display: 'block', padding: '10px 20px', color: '#333', textDecoration: 'none', fontSize: 14, fontFamily: 'Arial', borderBottom: i < academicItems[currentLang].length - 1 ? '1px solid #f5f5f5' : 'none' }}
                    onMouseEnter={e => { e.currentTarget.style.background = '#fff5f5'; e.currentTarget.style.color = '#8B0000' }}
                    onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#333' }}
                  >{item.label}</a>
                ))}
              </div>
            )}
          </div>

          <a href="/researchers" style={{ color: '#222', textDecoration: 'none', fontSize: 14, fontFamily: 'Arial', fontWeight: 600}}>
            {currentLang === 'tr' ? 'Akademisyenler' : 'Researchers'}
          </a>

          <a href="/groups" style={{ color: '#222', textDecoration: 'none', fontSize: 14, fontFamily: 'Arial', fontWeight: 600 }}>
            {currentLang === 'tr' ? 'Araştırma Grupları' : 'Groups'}
          </a>

          {setLang && (
            <button onClick={() => setLang(currentLang === 'tr' ? 'en' : 'tr')} style={{ background: 'none', border: '1.5px solid #ddd', borderRadius: '50%', width: 34, height: 34, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#666', fontSize: 16, position: 'relative' }}>
              <GlobalOutlined />
              <span style={{ position: 'absolute', top: -6, right: -6, background: '#8B0000', color: '#fff', fontSize: 9, fontWeight: 700, borderRadius: 8, padding: '1px 4px', fontFamily: 'Arial' }}>{currentLang.toUpperCase()}</span>
            </button>
          )}

          {user ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <a href="/dashboard" style={{ display: 'flex', alignItems: 'center', gap: 8, textDecoration: 'none' }}>
                <div style={{ width: 34, height: 34, borderRadius: '50%', background: 'linear-gradient(135deg, #8B0000, #C0392B)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 13, fontWeight: 700, overflow: 'hidden', flexShrink: 0 }}>
                  {user.profile_image_url
                    ? <img src={user.profile_image_url} alt="profil" style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={e => { e.target.style.display = 'none' }} />
                    : <>{user.first_name?.[0]}{user.last_name?.[0]}</>
                  }
                </div>
                <span style={{ fontSize: 14, color: '#1a1a1a', fontFamily: 'Arial' }}>{user.first_name} {user.last_name}</span>
              </a>
              <button onClick={handleLogout} style={{ background: 'none', border: '1px solid #ddd', borderRadius: 6, padding: '6px 14px', cursor: 'pointer', color: '#666', fontSize: 13, fontFamily: 'Arial', display: 'flex', alignItems: 'center', gap: 6 }}>
                <LogoutOutlined /> {currentLang === 'en' ? 'Logout' : 'Çıkış'}
              </button>
            </div>
          ) : (
            <a href="/login" style={{ background: '#8B0000', color: '#fff', padding: '8px 20px', borderRadius: 4, textDecoration: 'none', fontSize: 13, fontFamily: 'Arial' }}>
              {currentLang === 'en' ? 'Login' : 'Giriş'}
            </a>
          )}
        </nav>
      </header>

      {showLogoutModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.5)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ background: '#fff', borderRadius: 12, padding: '32px', maxWidth: 360, width: '90%', textAlign: 'center', boxShadow: '0 8px 32px rgba(0,0,0,0.2)' }}>
            <div style={{ fontSize: 18, fontWeight: 700, color: '#1a1a1a', marginBottom: 8, fontFamily: 'Arial' }}>Çıkış Yap</div>
            <div style={{ fontSize: 14, color: '#666', fontFamily: 'Arial', marginBottom: 24 }}>Çıkış yapmak istediğinizden emin misiniz?</div>
            <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
              <button onClick={() => setShowLogoutModal(false)} style={{ padding: '10px 24px', borderRadius: 8, border: '1px solid #ddd', background: '#fff', cursor: 'pointer', fontSize: 14, fontFamily: 'Arial' }}>İptal</button>
              <button onClick={confirmLogout} style={{ padding: '10px 24px', borderRadius: 8, border: 'none', background: '#8B0000', color: '#fff', cursor: 'pointer', fontSize: 14, fontWeight: 600, fontFamily: 'Arial' }}>Çıkış Yap</button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}