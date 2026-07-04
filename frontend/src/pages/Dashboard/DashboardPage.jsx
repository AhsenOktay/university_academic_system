import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { BookOutlined, ProjectOutlined, FileDoneOutlined, TrophyOutlined, PlusOutlined, BulbOutlined, UserOutlined, CalendarOutlined, ReadOutlined, TeamOutlined, EditOutlined, DeleteOutlined, LockOutlined } from '@ant-design/icons'
import Header from '../../components/Header.jsx'

const t = {
  tr: {
    stats: { publications: 'Yayın', projects: 'Proje', theses: 'Tez', awards: 'Ödül', patents: 'Patent', events: 'Etkinlik', courses: 'Ders', memberships: 'Üyelik' },
    quickActions: 'İşlemler',
    sections: { publications: 'Yayınlarım', projects: 'Projelerim', theses: 'Tezlerim', awards: 'Ödüllerim', patents: 'Patentlerim', events: 'Etkinliklerim', courses: 'Derslerim', memberships: 'Üyeliklerim' },
    add: { publications: 'Yayın Ekle', projects: 'Proje Ekle', theses: 'Tez Ekle', awards: 'Ödül Ekle', patents: 'Patent Ekle', events: 'Etkinlik Ekle', courses: 'Ders Ekle', memberships: 'Üyelik Ekle', editProfile: 'Profili Düzenle', changePassword: 'Şifre Değiştir' },
    deleteConfirm: 'Silmek istediğinizden emin misiniz?',
    deleteWarning: 'Bu işlem geri alınamaz.',
    noData: 'Henüz veri yok.',
  },
  en: {
    stats: { publications: 'Publications', projects: 'Projects', theses: 'Theses', awards: 'Awards', patents: 'Patents', events: 'Events', courses: 'Courses', memberships: 'Memberships' },
    quickActions: 'Quick Actions',
    sections: { publications: 'My Publications', projects: 'My Projects', theses: 'My Theses', awards: 'My Awards', patents: 'My Patents', events: 'My Events', courses: 'My Courses', memberships: 'My Memberships' },
    add: { publications: 'Add Publication', projects: 'Add Project', theses: 'Add Thesis', awards: 'Add Award', patents: 'Add Patent', events: 'Add Event', courses: 'Add Course', memberships: 'Add Membership', editProfile: 'Edit Profile', changePassword: 'Change Password' },
    deleteConfirm: 'Are you sure you want to delete?',
    deleteWarning: 'This action cannot be undone.',
    noData: 'No data yet.',
  }
}

const sections = [
  { key: 'publications', endpoint: 'publications', editPath: 'publications', detailPath: 'publications', color: '#8B0000', icon: <BookOutlined /> },
  { key: 'projects', endpoint: 'projects', editPath: 'projects', detailPath: 'projects', color: '#1a5276', icon: <ProjectOutlined /> },
  { key: 'theses', endpoint: 'theses', editPath: 'theses', detailPath: 'theses', color: '#1e8449', icon: <FileDoneOutlined /> },
  { key: 'awards', endpoint: 'awards', editPath: 'awards', detailPath: 'awards', color: '#784212', icon: <TrophyOutlined /> },
  { key: 'patents', endpoint: 'patents', editPath: 'patents', detailPath: 'patents', color: '#6c3483', icon: <BulbOutlined /> },
  { key: 'events', endpoint: 'events', editPath: 'events', detailPath: 'events', color: '#0e6655', icon: <CalendarOutlined /> },
  { key: 'courses', endpoint: 'courses', editPath: 'courses', detailPath: 'courses', color: '#1a5276', icon: <ReadOutlined /> },
  { key: 'memberships', endpoint: 'memberships', editPath: 'memberships', detailPath: 'memberships', color: '#6c3483', icon: <TeamOutlined /> },
]

const addLinks = [
  { key: 'editProfile', href: '/profile/edit', color: '#2c3e50', icon: <UserOutlined /> },
  { key: 'publications', href: '/publications/add', color: '#8B0000', icon: <BookOutlined /> },
  { key: 'projects', href: '/projects/add', color: '#1a5276', icon: <ProjectOutlined /> },
  { key: 'theses', href: '/theses/add', color: '#1e8449', icon: <FileDoneOutlined /> },
  { key: 'awards', href: '/awards/add', color: '#784212', icon: <TrophyOutlined /> },
  { key: 'patents', href: '/patents/add', color: '#6c3483', icon: <BulbOutlined /> },
  { key: 'events', href: '/events/add', color: '#0e6655', icon: <CalendarOutlined /> },
  { key: 'courses', href: '/courses/add', color: '#1a5276', icon: <ReadOutlined /> },
  { key: 'memberships', href: '/memberships/add', color: '#6c3483', icon: <TeamOutlined /> },
  { key: 'changePassword', href: '/change-password', color: '#595959', icon: <LockOutlined /> },
]

function getItemTitle(item) {
  return item.title || item.name || item.organization || item.code || '—'
}

function getItemSubtitle(item) {
  if (item.year) return String(item.year)
  if (item.start_date) return item.start_date
  if (item.start_year) return String(item.start_year)
  return ''
}

export default function DashboardPage() {
  const [lang, setLang] = useState(() => localStorage.getItem('lang') || 'tr')
  const [user, setUser] = useState(null)
  const [data, setData] = useState({})
  const [stats, setStats] = useState({})
  const [showLogoutModal, setShowLogoutModal] = useState(false)
  const [deleteModal, setDeleteModal] = useState({ show: false, endpoint: '', id: null, key: '' })
  const [showWarning, setShowWarning] = useState(() => {
  const changed = localStorage.getItem('passwordChangedAt')
  if (!changed) return true // hiç değiştirilmemiş, uyar
  const monthsAgo = (Date.now() - new Date(changed).getTime()) / (1000 * 60 * 60 * 24 * 30)
  return monthsAgo >= 6 // 6 ay geçtiyse uyar
 })



  const navigate = useNavigate()
  const tx = t[lang]

  useEffect(() => {
    const token = localStorage.getItem('access')
    if (!token) { navigate('/login'); return }
    fetch('/api/v1/auth/me/', { headers: { 'Authorization': `Bearer ${token}` } })
      .then(r => r.ok ? r.json() : null)
      .then(u => { if (!u) { navigate('/login'); return }; setUser(u) })
      .catch(() => navigate('/login'))
  }, [])

  useEffect(() => {
    if (!user) return
    const token = localStorage.getItem('access')
    const headers = { 'Authorization': `Bearer ${token}` }
    const userId = user.id
    const filters = { publications: `authors=${userId}`, projects: `members=${userId}`, theses: `advisor=${userId}`, awards: `recipient=${userId}`, patents: `inventors=${userId}`, events: `organizer=${userId}`, courses: `instructor=${userId}`, memberships: `member=${userId}` }
    Promise.all(sections.map(s => fetch(`/api/v1/${s.endpoint}/?${filters[s.key]}`, { headers }).then(r => r.json())))
      .then(results => {
        const newData = {}
        const newStats = {}
        sections.forEach((s, i) => { newData[s.key] = results[i].results || []; newStats[s.key] = results[i].count || 0 })
        setData(newData)
        setStats(newStats)
      }).catch(() => {})
  }, [user])

  const handleDelete = (endpoint, id, key) => setDeleteModal({ show: true, endpoint, id, key })

  const confirmDelete = async () => {
    const { endpoint, id, key } = deleteModal
    setDeleteModal({ show: false, endpoint: '', id: null, key: '' })
    const token = localStorage.getItem('access')
    const res = await fetch(`/api/v1/${endpoint}/${id}/`, { method: 'DELETE', headers: { 'Authorization': `Bearer ${token}` } })
    if (res.ok) {
      setData(prev => ({ ...prev, [key]: prev[key].filter(item => item.id !== id) }))
      setStats(prev => ({ ...prev, [key]: (prev[key] || 1) - 1 }))
    }
  }

  const handleLogout = () => setShowLogoutModal(true)

  const confirmLogout = () => {
    localStorage.removeItem('access')
    localStorage.removeItem('refresh')
    localStorage.removeItem('user')
    navigate('/login')
  }

  const statCards = sections.map(s => ({ key: s.key, label: tx.stats[s.key], count: stats[s.key] || 0, icon: s.icon, color: s.color }))

  return (
    <div style={{ fontFamily: "'Georgia', serif", background: '#f8f8f6', minHeight: '100vh' }}>
      <Header lang={lang} setLang={setLang} />
    <div style={{ maxWidth: 1200, margin: '0 auto', padding: '40px 48px' }}>
  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
   <div>
      <h1 style={{ fontSize: 24, fontWeight: 700, color: '#8b0000', margin: '0 0 2px' }}>Akademik Panelinize Hoş Geldiniz!</h1>
      <div style={{ fontSize: 20, color: '#444', fontFamily: 'Arial' }}>
        {user?.title && <span style={{ fontWeight: 700 }}>{user.title} </span>}
        <span style={{ fontWeight: 600 }}>{user?.first_name || ''} {user?.last_name || ''}</span>
      </div>
   </div>
   <button onClick={async () => {
      const token = localStorage.getItem('access')
      const res = await fetch('/api/v1/users/cv/download/', { headers: { 'Authorization': `Bearer ${token}` } })
      const blob = await res.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url; a.download = 'CV.pdf'; a.click()
    }} style={{ height: 44, padding: '0 24px', borderRadius: 8, background: '#8B0000', border: 'none', color: '#fff', fontSize: 14, fontWeight: 600, fontFamily: 'Arial', cursor: 'pointer', whiteSpace: 'nowrap' }}>
     ⬇ CV İndir
   </button>
 </div>

        {showWarning && (
          <div style={{ background: '#fffbe6', border: '1px solid #ffe58f', borderRadius: 8, padding: '10px 16px', marginBottom: 24, fontFamily: 'Arial', fontSize: 13, color: '#8B6914', display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
            ⚠️ Güvenliğiniz için yönetici tarafından atanan şifrenizi değiştirmeniz önerilir. Şifrenizin 6 ayda bir yenilenmesi bilgi güvenliği açısından tavsiye edilir.
            <a href="/change-password" style={{ color: '#8B0000', fontWeight: 600, textDecoration: 'none', marginLeft: 4, whiteSpace: 'nowrap' }}>Şifre Değiştir →</a>
            <button onClick={() => setShowWarning(false)} style={{ marginLeft: 'auto', background: 'none', border: 'none', cursor: 'pointer', color: '#8B6914', fontSize: 18, lineHeight: 1 }}>✕</button>
          </div>
        )}

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 16 }}>
          {statCards.slice(0, 4).map(s => (
            <div key={s.key} style={{ background: '#fff', borderRadius: 12, padding: '20px', boxShadow: '0 2px 12px rgba(0,0,0,0.06)', borderTop: `4px solid ${s.color}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div><div style={{ fontSize: 28, fontWeight: 800, color: '#1a1a1a' }}>{s.count}</div><div style={{ fontSize: 12, color: '#888', fontFamily: 'Arial', marginTop: 4 }}>{s.label}</div></div>
              <div style={{ fontSize: 24, color: s.color, opacity: 0.3 }}>{s.icon}</div>
            </div>
          ))}
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 32 }}>
          {statCards.slice(4).map(s => (
            <div key={s.key} style={{ background: '#fff', borderRadius: 12, padding: '20px', boxShadow: '0 2px 12px rgba(0,0,0,0.06)', borderTop: `4px solid ${s.color}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div><div style={{ fontSize: 28, fontWeight: 800, color: '#1a1a1a' }}>{s.count}</div><div style={{ fontSize: 12, color: '#888', fontFamily: 'Arial', marginTop: 4 }}>{s.label}</div></div>
              <div style={{ fontSize: 24, color: s.color, opacity: 0.3 }}>{s.icon}</div>
            </div>
          ))}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 24 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            {sections.map(s => (
              <div key={s.key} style={{ background: '#fff', borderRadius: 12, padding: '24px', boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                  <h3 style={{ fontSize: 15, fontWeight: 700, color: '#1a1a1a', margin: 0, display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ color: s.color }}>{s.icon}</span> {tx.sections[s.key]}
                  </h3>
                  <a href={`/${s.key}/add`} style={{ fontSize: 12, color: s.color, fontFamily: 'Arial', textDecoration: 'none' }}>+ {tx.add[s.key]}</a>
                </div>
                {(!data[s.key] || data[s.key].length === 0) ? (
                  <div style={{ color: '#aaa', fontFamily: 'Arial', fontSize: 13, textAlign: 'center', padding: '16px 0' }}>{tx.noData}</div>
                ) : data[s.key].map(item => (
                  <div key={item.id} style={{ padding: '10px 0', borderBottom: '1px solid #f0f0f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12 }}>
                    <a href={`/${s.detailPath}/${item.id}`} style={{ flex: 1, textDecoration: 'none' }}>
                      <div style={{ fontSize: 14, fontWeight: 600, color: '#1a1a1a', lineHeight: 1.4 }}>{getItemTitle(item)}</div>
                      <div style={{ fontSize: 12, color: '#aaa', fontFamily: 'Arial' }}>{getItemSubtitle(item)}</div>
                    </a>
                    <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
                      <a href={`/${s.editPath}/${item.id}/edit`} style={{ color: '#1a5276', fontSize: 16 }}><EditOutlined /></a>
                      <button onClick={() => handleDelete(s.endpoint, item.id, s.key)} style={{ color: '#cf1322', fontSize: 16, cursor: 'pointer', background: 'none', border: 'none', padding: 0 }}><DeleteOutlined /></button>
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>

          <div style={{ position: 'sticky', top: 88, alignSelf: 'start' }}>
            <div style={{ background: '#fff', borderRadius: 12, padding: '24px', boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
              <h3 style={{ fontSize: 15, fontWeight: 700, color: '#1a1a1a', margin: '0 0 16px' }}>{tx.quickActions}</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {addLinks.map(action => (
                  <a key={action.key} href={action.href} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 12px', borderRadius: 8, border: `1.5px solid ${action.color}`, color: action.color, textDecoration: 'none', fontFamily: 'Arial', fontSize: 13, fontWeight: 600, transition: 'all 0.2s' }}
                    onMouseEnter={e => { e.currentTarget.style.background = action.color; e.currentTarget.style.color = '#fff' }}
                    onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = action.color }}
                  >
                    <PlusOutlined /> {tx.add[action.key]}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {deleteModal.show && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.5)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ background: '#fff', borderRadius: 12, padding: '32px', maxWidth: 360, width: '90%', textAlign: 'center', boxShadow: '0 8px 32px rgba(0,0,0,0.2)' }}>
            <div style={{ fontSize: 18, fontWeight: 700, color: '#1a1a1a', marginBottom: 8, fontFamily: 'Arial' }}>{tx.deleteConfirm}</div>
            <div style={{ fontSize: 14, color: '#666', fontFamily: 'Arial', marginBottom: 24 }}>{tx.deleteWarning}</div>
            <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
              <button onClick={() => setDeleteModal({ show: false, endpoint: '', id: null, key: '' })} style={{ padding: '10px 24px', borderRadius: 8, border: '1px solid #ddd', background: '#fff', cursor: 'pointer', fontSize: 14, fontFamily: 'Arial' }}>İptal</button>
              <button onClick={confirmDelete} style={{ padding: '10px 24px', borderRadius: 8, border: 'none', background: '#cf1322', color: '#fff', cursor: 'pointer', fontSize: 14, fontWeight: 600, fontFamily: 'Arial' }}>Sil</button>
            </div>
          </div>
        </div>
      )}

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
    </div>
  )
}