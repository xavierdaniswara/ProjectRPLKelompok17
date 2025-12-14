import React from 'react'
import clsx from 'clsx'

export default function ChatBubble({ role, text }) {
    const isUser = role === 'user'
    return (
        <div className={clsx('flex', isUser ? 'justify-end' : 'justify-start')}>
            <div className={clsx('max-w-[80%] p-3 rounded-2xl my-1 shadow-sm', isUser ? 'bg-white border border-gray-200 text-gray-800' : 'bg-white border border-gray-100 text-gray-800')}>
                <div className="whitespace-pre-wrap text-sm">{text}</div>
            </div>
        </div>
    )
}