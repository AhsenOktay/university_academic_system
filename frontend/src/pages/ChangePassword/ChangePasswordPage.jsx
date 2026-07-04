import { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'

const translations = {
  tr: {
    title: 'Şifrenizi Değiştirin',
    subtitle: 'İlk girişinizde şifrenizi değiştirmeniz gerekmektedir.',
    current: 'Mevcut Şifre',
    newPass: 'Yeni Şifre',
    confirm: 'Yeni Şifre (Tekrar)',
    submit: 'Şifremi Değiştir',
    noMatch: 'Şifreler eşleşmiyor',
    minLength: 'En az 8 karakter olmalı',
    error: 'Bir hata oluştu.',
    serverError: 'Sunucuya bağlanılamadı.',
  },
  en: {
    title: 'Change Your Password',
    subtitle: 'You must change your password on first login.',
    current: 'Current Password',
    newPass: 'New Password',
    confirm: 'Confirm New Password',
    submit: 'Change Password',
    noMatch: 'Passwords do not match',
    minLength: 'Must be at least 8 characters',
    error: 'An error occurred.',
    serverError: 'Could not connect to server.',
  }
}

export default function ChangePasswordPage() {
  const [lang] = useState(() => localStorage.getItem('lang') || 'tr')
  const [loading, setLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')
  const currentRef = useRef()
  const newRef = useRef()
  const confirmRef = useRef()
  const navigate = useNavigate()
  const tx = translations[lang]

  const handleSubmit = async (e) => {
    e.preventDefault()
    const oldPassword = currentRef.current.value
    const newPassword = newRef.current.value
    const confirmPassword = confirmRef.current.value

    if (newPassword.length < 8) { setErrorMsg(tx.minLength); return }
    if (newPassword !== confirmPassword) { setErrorMsg(tx.noMatch); return }

    setLoading(true)
    setErrorMsg('')
    try {
      const token = localStorage.getItem('access')
      const res = await fetch('/api/v1/auth/change-password/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          old_password: oldPassword,
          new_password: newPassword,
          new_password_confirm: confirmPassword,
        }),
      })
      if (res.ok) {
        localStorage.setItem('passwordChangedAt', new Date().toISOString())
        navigate('/dashboard')
      }
    } catch {
      setErrorMsg(tx.serverError)
    }
    setLoading(false)
  }

  const inputStyle = {
    width: '100%', height: 48, borderRadius: 8,
    border: '1px solid #d9d9d9', padding: '0 16px',
    fontSize: 15, outline: 'none', boxSizing: 'border-box',
    fontFamily: 'Arial', marginBottom: 16,
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #6B0000 0%, #8B0000 50%, #C0392B 100%)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24,
    }}>
      <div style={{
        background: '#fff', borderRadius: 16, padding: '48px 40px',
        width: '100%', maxWidth: 420,
        boxShadow: '0 24px 64px rgba(0,0,0,0.3)',
      }}>
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <img src="/logo.png" alt="logo" style={{ height: 56, objectFit: 'contain', marginBottom: 16 }} />
          <h2 style={{ fontSize: 20, fontWeight: 700, color: '#1a1a1a', margin: '0 0 8px', fontFamily: 'Georgia, serif' }}>
            {tx.title}
          </h2>
          <p style={{ fontSize: 13, color: '#888', fontFamily: 'Arial', margin: 0 }}>{tx.subtitle}</p>
        </div>

        {errorMsg && (
          <div style={{ background: '#fff2f0', border: '1px solid #ffccc7', borderRadius: 8, padding: '10px 16px', marginBottom: 20, color: '#cf1322', fontFamily: 'Arial', fontSize: 14 }}>
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <input ref={currentRef} type="password" placeholder={tx.current} required style={inputStyle}
            onFocus={e => e.target.style.borderColor = '#8B0000'}
            onBlur={e => e.target.style.borderColor = '#d9d9d9'}
          />
          <input ref={newRef} type="password" placeholder={tx.newPass} required style={inputStyle}
            onFocus={e => e.target.style.borderColor = '#8B0000'}
            onBlur={e => e.target.style.borderColor = '#d9d9d9'}
          />
          <input ref={confirmRef} type="password" placeholder={tx.confirm} required style={{ ...inputStyle, marginBottom: 24 }}
            onFocus={e => e.target.style.borderColor = '#8B0000'}
            onBlur={e => e.target.style.borderColor = '#d9d9d9'}
          />
          <button type="submit" disabled={loading} style={{
            width: '100%', height: 48, borderRadius: 8,
            background: loading ? '#c0392b99' : '#8B0000',
            border: 'none', color: '#fff',
            fontSize: 15, fontWeight: 600, fontFamily: 'Arial',
            cursor: loading ? 'not-allowed' : 'pointer',
          }}>
            {loading ? '...' : tx.submit}
          </button>
        </form>
      </div>
    </div>
  )
}