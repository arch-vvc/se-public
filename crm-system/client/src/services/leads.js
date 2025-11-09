import api from './api'

export async function fetchLeads(params = {}) {
  const res = await api.get('/leads', { params })
  return res.data
}

export async function createLead(payload) {
  const res = await api.post('/leads', payload)
  return res.data.data
}

export async function updateLead(id, payload) {
  const res = await api.put(`/leads/${id}`, payload)
  return res.data.data
}

export async function deleteLead(id) {
  const res = await api.delete(`/leads/${id}`)
  return res.data.data
}

export default {
  fetchLeads,
  createLead,
  updateLead,
  deleteLead,
}
