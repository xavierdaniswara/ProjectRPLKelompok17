import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import React, { useEffect, useState } from 'react'
import Header from './components/Header'
import AuthForm from './pages/AuthForm'
import ChatPage from './pages/ChatPage'
import { me, login, register, logout } from './api.js'

export default function App() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    (async () => {
      try {
        const data = await me()
        setUser(data.user)
      } catch (err) {
        setUser(null)
      } finally {
        setLoading(false)
      }
    })()
  }, [])


  const handleAuth = async (mode, payload) => {
    if (mode === 'login') {
      const res = await login({ email: payload.email, password: payload.password })
      setUser(res.user)
    } else {
      const res = await register({ name: payload.name, email: payload.email, password: payload.password })
      setUser(res.user)
    }
  }


  const handleLogout = async () => {
    await logout()
    setUser(null)
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header user={user} onLogout={handleLogout} />
      <main className="flex-1 flex items-stretch">
        <div className="w-full max-w-4xl mx-auto flex-1 flex flex-col h-[calc(100vh-72px)]">
          {loading ? (
            <div className="flex-1 flex items-center justify-center">Memeriksa sesi...</div>
          ) : (
            user ? <ChatPage /> : (
              <div className="flex-1 flex items-center justify-center p-6">
                <AuthForm onAuth={handleAuth} />
              </div>
            )
          )}
        </div>
      </main>
      <footer className="text-center text-xs text-gray-400 p-4">Demo only — bukan pengganti konsultasi dokter.</footer>
    </div>
  )
}
