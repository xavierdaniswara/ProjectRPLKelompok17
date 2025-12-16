import React from 'react'

export default function Header({ user, onLogout }) {
    return (
        <header className="w-full bg-white border-b border-gray-200">
            <div className="max-w-3xl mx-auto px-4 py-3 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-white border rounded-lg flex items-center justify-center shadow-sm">🏥</div>
                    <div>
                        <div className="text-lg font-semibold text-gray-800">KesmasDesk AI</div>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    {user ? (
                        <>
                            <div className="text-sm text-gray-600">{user.name}</div>
                            <button onClick={onLogout} className="px-3 py-1 rounded-md text-sm bg-gray-100 hover:bg-gray-200">Logout</button>
                        </>
                    ) : null}
                </div>
            </div>
        </header>
    )
}