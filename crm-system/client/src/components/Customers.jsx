import React, { useEffect, useState } from 'react'
import CustomerForm from './CustomerForm'
import * as customersAPI from '../services/customers'

export default function Customers() {
  const [customers, setCustomers] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [editing, setEditing] = useState(null)
  const [showForm, setShowForm] = useState(false)

  const load = async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await customersAPI.fetchCustomers()
      // res has shape { data: [...], meta }
      setCustomers(res.data || [])
    } catch (err) {
      console.error('load customers', err)
      setError('Failed to load customers')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [])

  const handleCreateClick = () => {
    setEditing(null)
    setShowForm(true)
  }

  const handleSubmit = async (payload) => {
    try {
      if (editing) {
        const updated = await customersAPI.updateCustomer(editing._id, payload)
        setCustomers((prev) => prev.map((c) => (c._id === updated._id ? updated : c)))
      } else {
        const created = await customersAPI.createCustomer(payload)
        setCustomers((prev) => [created, ...prev])
      }
      setShowForm(false)
      setEditing(null)
    } catch (err) {
      console.error('submit customer', err)
      alert('Failed to save customer')
    }
  }

  const handleEdit = (c) => {
    setEditing(c)
    setShowForm(true)
  }

  const handleDelete = async (c) => {
    if (!window.confirm(`Delete customer ${c.name}?`)) return
    try {
      await customersAPI.deleteCustomer(c._id)
      setCustomers((prev) => prev.filter((p) => p._id !== c._id))
    } catch (err) {
      console.error('delete customer', err)
      alert('Failed to delete')
    }
  }

  return (
    <div style={{ padding: 20 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2>Customers</h2>
        <div>
          <button onClick={handleCreateClick}>Add Customer</button>
          <button onClick={load} style={{ marginLeft: 8 }}>Refresh</button>
        </div>
      </div>

      {showForm && (
        <div style={{ marginTop: 12, marginBottom: 12, background: '#fff', padding: 12, borderRadius: 6 }}>
          <CustomerForm initialData={editing || {}} onSubmit={handleSubmit} onCancel={() => { setShowForm(false); setEditing(null) }} />
        </div>
      )}

      {loading && <div>Loading...</div>}
      {error && <div style={{ color: 'red' }}>{error}</div>}

      <div style={{ marginTop: 12 }}>
        {customers.length === 0 && !loading ? (
          <div>No customers yet.</div>
        ) : (
          <div style={{ display: 'grid', gap: 8 }}>
            {customers.map((c) => (
              <div key={c._id} style={{ padding: 12, border: '1px solid #eee', borderRadius: 6, background: '#fff' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div style={{ fontWeight: 600 }}>{c.name}</div>
                    <div style={{ fontSize: 12, color: '#555' }}>{c.company || ''} {c.email ? `• ${c.email}` : ''}</div>
                  </div>
                  <div>
                    <button onClick={() => handleEdit(c)} style={{ marginRight: 8 }}>Edit</button>
                    <button onClick={() => handleDelete(c)}>Delete</button>
                  </div>
                </div>
                {c.phone && <div style={{ marginTop: 8 }}>{c.phone}</div>}
                {c.address && <div style={{ marginTop: 4, fontSize: 13, color: '#666' }}>{c.address}</div>}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
