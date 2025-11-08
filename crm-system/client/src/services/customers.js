import api from './api'

// ==========================
// CRUD OPERATIONS
// ==========================

export async function fetchCustomers(params = {}) {
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

// ==========================
// CSV IMPORT / EXPORT
// ==========================

export async function importCustomers(file) {
  const formData = new FormData()
  formData.append('file', file)

  const res = await api.post('/customers/import', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
  return res.data
}

export async function exportCustomers() {
  const res = await api.get('/customers/export', {
    responseType: 'blob',
  })

  // Create a blob URL for the CSV file
  const url = window.URL.createObjectURL(new Blob([res.data]))
  const link = document.createElement('a')
  link.href = url
  link.setAttribute('download', 'customers.csv')
  document.body.appendChild(link)
  link.click()
  link.remove()
}

// Default export (optional, for backward compatibility)
export default {
  fetchCustomers,
  createCustomer,
  updateCustomer,
  deleteCustomer,
  importCustomers,
  exportCustomers,
}
