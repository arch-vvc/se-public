import api from './api'

// Service helpers for customer CRUD
export async function fetchCustomers(params = {}) {
  // returns { data: [...], meta: { total, page, limit } }
  const res = await api.get('/customers', { params })
  return res.data
}

export async function createCustomer(payload) {
  const res = await api.post('/customers', payload)
  return res.data.data
}

export async function updateCustomer(id, payload) {
  const res = await api.put(`/customers/${id}`, payload)
  return res.data.data
}

export async function deleteCustomer(id) {
  const res = await api.delete(`/customers/${id}`)
  return res.data.data
}

export default {
  fetchCustomers,
  createCustomer,
  updateCustomer,
  deleteCustomer,
}
