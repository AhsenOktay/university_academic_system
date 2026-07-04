import { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { GlobalOutlined } from '@ant-design/icons'

const translations = {
  tr: {
    title: 'Araştırmacı Girişi',
    email: 'E-posta',
    password: 'Şifre',
    login: 'Giriş Yap',
    backHome: '← Ana Sayfaya Dön',
    firstLogin: 'İlk girişte şifrenizi değiştirmeniz gerekecektir.',
    error: 'E-posta veya şifre hatalı.',
    serverError: 'Sunucuya bağlanılamadı.',
  },
  en: {
    title: 'Researcher Login',
    email: 'Email',
    password: 'Password',
    login: 'Login',
    backHome: '← Back to Home',
    firstLogin: 'You will be required to change your password on first login.',
    error: 'Invalid email or password.',
    serverError: 'Could not connect to server.',
  }
}

export default function LoginPage() {
  const [lang, setLang] = useState('tr')
  const [loading, setLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')
  const emailRef = useRef()
  const passwordRef = useRef()
  const navigate = useNavigate()
  const tx = translations[lang]

  const handleSubmit = async (e) => {
    e.preventDefault()
    const email = emailRef.current.value
    const password = passwordRef.current.value
    if (!email || !password) return

    setLoading(true)
    setErrorMsg('')
    try {
      const res = await fetch('/api/v1/auth/login/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })
      const data = await res.json()
      if (res.ok) {
        localStorage.setItem('access', data.access)
        localStorage.setItem('refresh', data.refresh)
        localStorage.setItem('user', JSON.stringify(data.user))
        if (data.must_change_password) {
          navigate('/change-password')
        } else {
          navigate('/dashboard')
        }
      } else {
        setErrorMsg(tx.error)
      }
    } catch {
      setErrorMsg(tx.serverError)
    }
    setLoading(false)
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #6B0000 0%, #8B0000 50%, #C0392B 100%)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: 24, position: 'relative',
    }}>
      <button
        onClick={() => setLang(lang === 'tr' ? 'en' : 'tr')}
        style={{
          position: 'absolute', top: 24, right: 24,
          background: 'rgba(255,255,255,0.15)', border: '1.5px solid rgba(255,255,255,0.3)',
          borderRadius: '50%', width: 40, height: 40,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          cursor: 'pointer', color: '#fff', fontSize: 18,
        }}
      >
        <GlobalOutlined />
        <span style={{
          position: 'absolute', top: -6, right: -6,
          background: '#fff', color: '#8B0000',
          fontSize: 9, fontWeight: 700, borderRadius: 8,
          padding: '1px 4px', fontFamily: 'Arial',
        }}>{lang.toUpperCase()}</span>
      </button>

      <div style={{
        background: '#fff', borderRadius: 16, padding: '48px 40px',
        width: '100%', maxWidth: 420,
        boxShadow: '0 24px 64px rgba(0,0,0,0.3)',
      }}>
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <img src="/logo.png" alt="logo" style={{ height: 56, objectFit: 'contain', marginBottom: 16 }} />
          <h2 style={{ fontSize: 20, fontWeight: 700, color: '#1a1a1a', margin: 0, fontFamily: 'Georgia, serif' }}>
            {tx.title}
          </h2>
        </div>

        {errorMsg && (
          <div style={{ background: '#fff2f0', border: '1px solid #ffccc7', borderRadius: 8, padding: '10px 16px', marginBottom: 20, color: '#cf1322', fontFamily: 'Arial', fontSize: 14 }}>
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: 16 }}>
            <input
              ref={emailRef}
              type="email"
              placeholder={tx.email}
              required
              style={{
                width: '100%', height: 48, borderRadius: 8,
                border: '1px solid #d9d9d9', padding: '0 16px',
                fontSize: 15, outline: 'none', boxSizing: 'border-box',
                fontFamily: 'Arial',
              }}
              onFocus={e => e.target.style.borderColor = '#8B0000'}
              onBlur={e => e.target.style.borderColor = '#d9d9d9'}
            />
          </div>

          <div style={{ marginBottom: 24 }}>
            <input
              ref={passwordRef}
              type="password"
              placeholder={tx.password}
              required
              style={{
                width: '100%', height: 48, borderRadius: 8,
                border: '1px solid #d9d9d9', padding: '0 16px',
                fontSize: 15, outline: 'none', boxSizing: 'border-box',
                fontFamily: 'Arial',
              }}
              onFocus={e => e.target.style.borderColor = '#8B0000'}
              onBlur={e => e.target.style.borderColor = '#d9d9d9'}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%', height: 48, borderRadius: 8,
              background: loading ? '#c0392b99' : '#8B0000',
              border: 'none', color: '#fff',
              fontSize: 15, fontWeight: 600, fontFamily: 'Arial',
              cursor: loading ? 'not-allowed' : 'pointer',
            }}
          >
            {loading ? '...' : tx.login}
          </button>
        </form>

        <p style={{ fontSize: 12, color: '#aaa', textAlign: 'center', fontFamily: 'Arial', margin: '16px 0' }}>
          {tx.firstLogin}
        </p>

        <div style={{ textAlign: 'center' }}>
          <a href="/" style={{ fontSize: 13, color: '#8B0000', fontFamily: 'Arial' }}>{tx.backHome}</a>
        </div>
      </div>
    </div>
  )
}
