import React, { useState } from 'react'

export default function AuthForm({ onAuth }) {
    const [mode, setMode] = useState('login')
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)


    const submit = async (e) => {
        e.preventDefault()
        setError(null)
        setLoading(true)
        try {
            await onAuth(mode, { name, email, password })
        } catch (err) {
            setError(err?.response?.data?.message || err.message || 'Error')
        } finally {
            setLoading(false)
        }
    }


    return (
        <div className="max-w-md w-full bg-white rounded-2xl shadow p-6">
            <h2 className="text-xl font-semibold mb-2">{mode === 'login' ? 'Login' : 'Register'}</h2>
            <p className="text-sm text-gray-500 mb-4">Input login/register info</p>
            <form onSubmit={submit} className="space-y-3" role="form" aria-label="Authentication form">
                {mode === 'register' && (
                    <div>
                        <label className="text-sm text-gray-700">Name</label>
                        <input
                            name="name"
                            placeholder="Nama lengkap"
                            value={name}
                            onChange={e => setName(e.target.value)}
                            className="w-full mt-1 p-2 border rounded-md"
                            required
                        />
                    </div>
                )}
                <div>
                    <label className="text-sm text-gray-700">Email</label>
                    <input
                        name="email"
                        placeholder="you@example.com"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        type="email"
                        className="w-full mt-1 p-2 border rounded-md"
                        required
                    />
                </div>
                <div>
                    <label className="text-sm text-gray-700">Password</label>
                    <input
                        name="password"
                        placeholder="••••••••"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        type="password"
                        className="w-full mt-1 p-2 border rounded-md"
                        required
                    />
                </div>
                {error && <div aria-live="polite" className="text-sm text-red-600">{error}</div>}
                <div className="flex items-center justify-between">
                    <button
                        type="submit"
                        disabled={loading}
                        aria-busy={loading}
                        className="px-4 py-2 bg-blue-600 text-white rounded-md shadow-sm hover:bg-blue-700 focus:outline-none"
                    >
                        {loading ? 'Please wait...' : (mode === 'login' ? 'Login' : 'Register')}
                    </button>
                    <button
                        type="button"
                        onClick={() => setMode(mode === 'login' ? 'register' : 'login')}
                        className="text-sm text-gray-600"
                    >
                        {mode === 'login' ? 'Create an account' : 'Have an account? Login'}
                    </button>
                </div>
            </form>
        </div>
    )
}