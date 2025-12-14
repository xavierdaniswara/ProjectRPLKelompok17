import React, { useEffect, useState, useRef } from 'react'
import ChatBubble from '../components/ChatBubble'
import { sendChat, getHistory } from '../api'

export default function ChatPage() {
    const [messages, setMessages] = useState([])
    const [input, setInput] = useState('')
    const [loading, setLoading] = useState(false)
    const boxRef = useRef(null)

    useEffect(() => {
    (async () => {
        try {
            const { history } = await getHistory()
            setMessages(history.map(h => ({ role: h.role, content: h.content })))
            scrollToBottom()
        } catch (err) {
            console.error(err)
        }
    })()
}, [])

    const scrollToBottom = () => {
        setTimeout(() => {
            boxRef.current?.scrollTo({ top: boxRef.current.scrollHeight, behavior: 'smooth' })
        }, 50)
    }


    const onSend = async () => {
        if (!input.trim()) return
        const userMsg = { role: 'user', content: input }
        setMessages(prev => [...prev, userMsg])
        setInput('')
        scrollToBottom()
        setLoading(true)
        try {
            const { reply } = await sendChat(userMsg.content)
            setMessages(prev => [...prev, { role: 'assistant', content: reply }])
            scrollToBottom()
        } catch (err) {
            setMessages(prev => [...prev, { role: 'assistant', content: 'Terjadi kesalahan pada server. Coba lagi.' }])
        } finally {
            setLoading(false)
        }
    }


    const onKeyDown = (e) => {
        if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) onSend()
    }


    return (
        <div className="flex-1 flex flex-col h-full">
            <div ref={boxRef} className="p-4 overflow-auto flex-1 max-w-3xl mx-auto">
                <div className="space-y-2">
                    {messages.length === 0 && <div className="text-center text-gray-500">Mulai konsultasimu. Contoh: "Saya demam 2 hari, apa yang harus saya lakukan?"</div>}
                    {messages.map((m, i) => <ChatBubble key={i} role={m.role} text={m.content} />)}
                </div>
            </div>


            <div className="max-w-3xl mx-auto w-full p-4 border-t bg-white">
                <div className="flex gap-2">
                    <textarea value={input} onChange={e => setInput(e.target.value)} onKeyDown={onKeyDown} placeholder="Ketik keluhan medismu di sini..." className="flex-1 p-3 rounded-xl border shadow-sm resize-none h-14"></textarea>
                    <div className="flex items-center">
                        <button onClick={onSend} disabled={loading} className="px-4 py-2 rounded-xl bg-white border shadow-sm">{loading ? 'Mengirim...' : 'Kirim'}</button>
                    </div>
                </div>
                <div className="text-xs text-gray-400 mt-2">Tips: tekan Ctrl+Enter untuk mengirim.</div>
            </div>
        </div>
    )
}