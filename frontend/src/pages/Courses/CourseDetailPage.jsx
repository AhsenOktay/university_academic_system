import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { Tag } from 'antd'
import { ReadOutlined, CalendarOutlined } from '@ant-design/icons'
import Header from '../../components/Header.jsx'

const t = {
  tr: {
    loading: 'Yükleniyor...', notFound: 'Ders bulunamadı.', back: '← Dersler',
    instructor: 'Öğretim Görevlisi', credits: 'Kredi', period: 'Dönem / Yıl', description: 'Açıklama',
    levels: { undergraduate: 'Lisans', graduate: 'Yüksek Lisans', doctorate: 'Doktora' },
    semesters: { fall: 'Güz', spring: 'Bahar', summer: 'Yaz' },
  },
  en: {
    loading: 'Loading...', notFound: 'Course not found.', back: '← Courses',
    instructor: 'Instructor', credits: 'Credits', period: 'Semester / Year', description: 'Description',
    levels: { undergraduate: 'Undergraduate', graduate: 'Graduate', doctorate: 'Doctorate' },
    semesters: { fall: 'Fall', spring: 'Spring', summer: 'Summer' },
  }
}

const levelColors = { undergraduate: '#1a5276', graduate: '#6c3483', doctorate: '#8B0000' }

function Avatar({ name, photo, size = 40 }) {
  if (photo) return <img src={photo} alt={name} style={{ width: size, height: size, borderRadius: '50%', objectFit: 'cover', flexShrink: 0 }} />
  const initials = (name || '').split(' ').filter(w => !w.includes('.')).slice(0, 2).map(w => w[0]).join('')
  return <div style={{ width: size, height: size, borderRadius: '50%', background: 'linear-gradient(135deg, #8B0000, #C0392B)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: size / 3, fontWeight: 700, flexShrink: 0 }}>{initials}</div>
}

export default function CourseDetailPage() {
  const [lang, setLang] = useState(() => localStorage.getItem('lang') || 'tr')
  const [course, setCourse] = useState(null)
  const [instructorDetail, setInstructorDetail] = useState(null)
  const [loading, setLoading] = useState(true)
  const { id } = useParams()
  const tx = t[lang]

  useEffect(() => {
    fetch(`/api/v1/courses/${id}/`)
      .then(r => r.ok ? r.json() : null)
      .then(async d => {
        if (d) {
          setCourse(d)
          if (d.instructor) {
            const ins = await fetch(`/api/v1/users/${d.instructor}/`).then(r => r.ok ? r.json() : null)
            setInstructorDetail(ins)
          }
        }
        setLoading(false)
      })
  }, [id])

  if (loading) return <div style={{ textAlign: 'center', padding: 64, fontFamily: 'Arial' }}>{tx.loading}</div>
  if (!course) return <div style={{ textAlign: 'center', padding: 64, fontFamily: 'Arial' }}>{tx.notFound}</div>

  return (
    <div style={{ fontFamily: "'Georgia', serif", background: '#f8f8f6', minHeight: '100vh' }}>
      <Header lang={lang} setLang={setLang} />

      <div style={{ background: 'linear-gradient(135deg, #6B0000, #8B0000)', padding: '40px 48px' }}>
        <div style={{ maxWidth: 900, margin: '0 auto' }}>
          <a href="/courses" style={{ color: 'rgba(255,255,255,0.7)', fontFamily: 'Arial', fontSize: 13, textDecoration: 'none', display: 'block', marginBottom: 20 }}>{tx.back}</a>
          <div style={{ marginBottom: 12 }}>
            <Tag color={levelColors[course.level] || '#1a5276'} style={{ fontSize: 12, borderRadius: 4 }}>{tx.levels[course.level] || course.level}</Tag>
          </div>
          <h1 style={{ color: '#fff', fontSize: 28, fontWeight: 700, margin: '0 0 8px' }}>
            {course.code ? `${course.code} - ` : ''}{course.name}
          </h1>
          {course.name_en && <div style={{ color: 'rgba(255,255,255,0.7)', fontFamily: 'Arial', fontSize: 15, fontStyle: 'italic' }}>{course.name_en}</div>}
        </div>
      </div>

      <div style={{ maxWidth: 900, margin: '40px auto 64px', padding: '0 48px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 24 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            {course.description && (
              <div style={{ background: '#fff', borderRadius: 12, padding: '28px', boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
                <h3 style={{ fontSize: 16, fontWeight: 700, color: '#1a1a1a', margin: '0 0 16px' }}>{tx.description}</h3>
                <p style={{ fontSize: 14, color: '#555', fontFamily: 'Arial', lineHeight: 1.8, margin: 0 }}>{course.description}</p>
              </div>
            )}
            {instructorDetail && (
              <div style={{ background: '#fff', borderRadius: 12, padding: '28px', boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
                <h3 style={{ fontSize: 16, fontWeight: 700, color: '#1a1a1a', margin: '0 0 16px' }}>{tx.instructor}</h3>
                <a href={`/researcher/${instructorDetail.id}`} style={{ display: 'flex', alignItems: 'center', gap: 12, textDecoration: 'none' }}>
                  <Avatar name={`${instructorDetail.first_name} ${instructorDetail.last_name}`} photo={instructorDetail.profile_image_url} />
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 600, color: '#1a1a1a' }}>{instructorDetail.title ? `${instructorDetail.title} ` : ''}{instructorDetail.first_name} {instructorDetail.last_name}</div>
                    {instructorDetail.department && <div style={{ fontSize: 12, color: '#888', fontFamily: 'Arial' }}>{instructorDetail.department}</div>}
                  </div>
                </a>
              </div>
            )}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div style={{ background: '#fff', borderRadius: 12, padding: '24px', boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
              <h4 style={{ fontSize: 14, fontWeight: 700, color: '#888', fontFamily: 'Arial', margin: '0 0 12px', textTransform: 'uppercase', letterSpacing: 1 }}>{tx.period}</h4>
              <div style={{ fontSize: 14, color: '#555', fontFamily: 'Arial', display: 'flex', alignItems: 'center', gap: 6 }}>
                <CalendarOutlined style={{ color: '#8B0000' }} /> {tx.semesters[course.semester] || course.semester} {course.year}
              </div>
            </div>
            {course.credits && (
              <div style={{ background: '#fff', borderRadius: 12, padding: '24px', boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
                <h4 style={{ fontSize: 14, fontWeight: 700, color: '#888', fontFamily: 'Arial', margin: '0 0 12px', textTransform: 'uppercase', letterSpacing: 1 }}>{tx.credits}</h4>
                <div style={{ fontSize: 20, fontWeight: 700, color: '#1a1a1a' }}>{course.credits}</div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}