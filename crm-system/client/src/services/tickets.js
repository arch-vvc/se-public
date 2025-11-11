import api from './api'

// ==========================
// Tickets CRUD
// ==========================

export async function fetchTickets(params = {}) {
  const res = await api.get('/tickets', { params })
  return res.data
}

export async function createTicket(payload) {
  const res = await api.post('/tickets', payload)
  return res.data.data || res.data
}

export async function updateTicket(id, payload) {
  const res = await api.put(`/tickets/${id}`, payload)
  return res.data.data || res.data
}

export async function deleteTicket(id) {
  const res = await api.delete(`/tickets/${id}`)
  return res.data.data || res.data
}

export default {
  fetchTickets,
  createTicket,
  updateTicket,
  deleteTicket,
}
