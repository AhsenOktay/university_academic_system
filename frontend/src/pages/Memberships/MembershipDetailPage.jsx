import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { Tag } from 'antd'
import { CalendarOutlined } from '@ant-design/icons'
import Header from '../../components/Header.jsx'

const t = {
  tr: {
    loading: 'Yükleniyor...', notFound: 'Üyelik bulunamadı.', back: '← Üyelikler',
    member: 'Üye', period: 'Dönem', role: 'Rol', description: 'Açıklama', active: 'Aktif',
    types: { association: 'Dernek', journal: 'Dergi', committee: 'Komite', board: 'Yönetim Kurulu', other: 'Diğer' },
  },
  en: {
    loading: 'Loading...', notFound: 'Membership not found.', back: '← Memberships',
    member: 'Member', period: 'Period', role: 'Role', description: 'Description', active: 'Active',
    types: { association: 'Association', journal: 'Journal', committee: 'Committee', board: 'Board', other: 'Other' },
  }
}

const typeColors = { association: '#8B0000', journal: '#1a5276', committee: '#1e8449', board: '#6c3483', other: '#784212' }

function Avatar({ name, photo, size = 40 }) {
  if (photo) return <img src={photo} alt={name} style={{ width: size, height: size, borderRadius: '50%', objectFit: 'cover', flexShrink: 0 }} />
  const initials = (name || '').split(' ').filter(w => !w.includes('.')).slice(0, 2).map(w => w[0]).join('')
  return <div style={{ width: size, height: size, borderRadius: '50%', background: 'linear-gradient(135deg, #8B0000, #C0392B)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: size / 3, fontWeight: 700, flexShrink: 0 }}>{initials}</div>
}

export default function MembershipDetailPage() {
  const [lang, setLang] = useState(() => localStorage.getItem('lang') || 'tr')
  const [membership, setMembership] = useState(null)
  const [memberDetail, setMemberDetail] = useState(null)
  const [loading, setLoading] = useState(true)
  const { id } = useParams()
  const tx = t[lang]

  useEffect(() => {
    fetch(`/api/v1/memberships/${id}/`)
      .then(r => r.ok ? r.json() : null)
      .then(async d => {
        if (d) {
          setMembership(d)
          if (d.member) {
            const mem = await fetch(`/api/v1/users/${d.member}/`).then(r => r.ok ? r.json() : null)
            setMemberDetail(mem)
          }
        }
        setLoading(false)
      })
  }, [id])

  if (loading) return <div style={{ textAlign: 'center', padding: 64, fontFamily: 'Arial' }}>{tx.loading}</div>
  if (!membership) return <div style={{ textAlign: 'center', padding: 64, fontFamily: 'Arial' }}>{tx.notFound}</div>

  return (
    <div style={{ fontFamily: "'Georgia', serif", background: '#f8f8f6', minHeight: '100vh' }}>
      <Header lang={lang} setLang={setLang} />

      <div style={{ background: 'linear-gradient(135deg, #6B0000, #8B0000)', padding: '40px 48px' }}>
        <div style={{ maxWidth: 900, margin: '0 auto' }}>
          <a href="/memberships" style={{ color: 'rgba(255,255,255,0.7)', fontFamily: 'Arial', fontSize: 13, textDecoration: 'none', display: 'block', marginBottom: 20 }}>{tx.back}</a>
          <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
            <Tag color={typeColors[membership.membership_type] || '#6c3483'} style={{ fontSize: 12, borderRadius: 4 }}>{tx.types[membership.membership_type] || membership.membership_type}</Tag>
            {membership.is_active && <Tag color="#1e8449" style={{ fontSize: 12, borderRadius: 4 }}>{tx.active}</Tag>}
          </div>
          <h1 style={{ color: '#fff', fontSize: 28, fontWeight: 700, margin: '0 0 8px' }}>{membership.organization}</h1>
          {membership.role && <div style={{ color: 'rgba(255,255,255,0.8)', fontFamily: 'Arial', fontSize: 15 }}>{membership.role}</div>}
        </div>
      </div>

      <div style={{ maxWidth: 900, margin: '40px auto 64px', padding: '0 48px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 24 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            {membership.description && (
              <div style={{ background: '#fff', borderRadius: 12, padding: '28px', boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
                <h3 style={{ fontSize: 16, fontWeight: 700, color: '#1a1a1a', margin: '0 0 16px' }}>{tx.description}</h3>
                <p style={{ fontSize: 14, color: '#555', fontFamily: 'Arial', lineHeight: 1.8, margin: 0 }}>{membership.description}</p>
              </div>
            )}
            {memberDetail && (
              <div style={{ background: '#fff', borderRadius: 12, padding: '28px', boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
                <h3 style={{ fontSize: 16, fontWeight: 700, color: '#1a1a1a', margin: '0 0 16px' }}>{tx.member}</h3>
                <a href={`/researcher/${memberDetail.id}`} style={{ display: 'flex', alignItems: 'center', gap: 12, textDecoration: 'none' }}>
                  <Avatar name={`${memberDetail.first_name} ${memberDetail.last_name}`} photo={memberDetail.profile_image_url} />
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 600, color: '#1a1a1a' }}>{memberDetail.title ? `${memberDetail.title} ` : ''}{memberDetail.first_name} {memberDetail.last_name}</div>
                    {memberDetail.department && <div style={{ fontSize: 12, color: '#888', fontFamily: 'Arial' }}>{memberDetail.department}</div>}
                  </div>
                </a>
              </div>
            )}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div style={{ background: '#fff', borderRadius: 12, padding: '24px', boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
              <h4 style={{ fontSize: 14, fontWeight: 700, color: '#888', fontFamily: 'Arial', margin: '0 0 12px', textTransform: 'uppercase', letterSpacing: 1 }}>{tx.period}</h4>
              <div style={{ fontSize: 14, color: '#555', fontFamily: 'Arial', display: 'flex', alignItems: 'center', gap: 6 }}>
                <CalendarOutlined style={{ color: '#8B0000' }} /> {membership.start_year}{membership.end_year ? ` — ${membership.end_year}` : ' — ...'}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}