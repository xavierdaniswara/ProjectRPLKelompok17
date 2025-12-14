import axios from 'axios'

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:4000/api'

export async function register(payload) {
    return axios.post(`${API_BASE}/auth/register`, payload, { withCredentials: true }).then(r => r.data)
}
export async function login(payload) {
    return axios.post(`${API_BASE}/auth/login`, payload, { withCredentials: true }).then(r => r.data)
}
export async function logout() {
    return axios.post(`${API_BASE}/auth/logout`, {}, { withCredentials: true }).then(r => r.data)
}
export async function me() {
    return axios.get(`${API_BASE}/auth/me`, { withCredentials: true }).then(r => r.data)
}
export async function sendChat(message) {
    return axios.post(`${API_BASE}/chat`, { message }, { withCredentials: true }).then(r => r.data)
}
export async function getHistory() {
    return axios.get(`${API_BASE}/chat/history`, { withCredentials: true }).then(r => r.data)
}