import React, { useEffect, useState } from 'react'
import CustomerForm from './CustomerForm'
import {
  fetchCustomers,
  createCustomer,
  updateCustomer,
  deleteCustomer,
  importCustomers,
  exportCustomers,
} from '../services/customers'

// This component can operate in two modes:
// 1) Controlled: receive `customers`, `onEdit`, `onDelete`, `theme` from parent (CustomerProfiles).
// 2) Uncontrolled: if no `customers` prop is provided, it will fetch and manage its own list (backwards compatible).
export default function Customers({ customers: propsCustomers, onEdit: propsOnEdit, onDelete: propsOnDelete, theme: propsTheme }) {
  const [customers, setCustomers] = useState(propsCustomers || [])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [editing, setEditing] = useState(null)
  const [showForm, setShowForm] = useState(false)
  const [file, setFile] = useState(null)

  const theme = propsTheme || {
    spacing: { sm: 8, md: 12, lg: 18 },
    radii: { medium: 8, large: 12 },
    colors: { border: '#eee', subtleText: '#777', text: '#111', surface: '#fff', danger: '#c0392b' },
    typography: { fontSizes: { lg: 18, md: 14, sm: 12, xl: 24 } },
    button: { background: '#0f1724', color: '#fff' },
    shadows: { card: '0 6px 20px rgba(0,0,0,0.06)' },
    glassCard: { background: 'transparent', border: '1px solid rgba(0,0,0,0.06)' }
  }

  // If parent provided customers, respect that and don't fetch. Otherwise, fetch.
  const load = async () => {
    if (propsCustomers) return
    setLoading(true)
    setError(null)
    try {
      const res = await fetchCustomers()
      setCustomers(res.data || [])
    } catch (err) {
      console.error('load customers', err)
      setError('Failed to load customers')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (!propsCustomers) load()
  }, [])

  // Keep local list in sync when parent updates
  useEffect(() => {
    if (propsCustomers) setCustomers(propsCustomers)
  }, [propsCustomers])

  const handleSubmit = async (payload) => {
    try {
      if (editing) {
        const updated = await updateCustomer(editing._id, payload)
        setCustomers((prev) => prev.map((c) => (c._id === updated._id ? updated : c)))
      } else {
        const created = await createCustomer(payload)
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
    if (propsOnEdit) return propsOnEdit(c)
    setEditing(c)
    setShowForm(true)
  }

  const handleDelete = async (c) => {
    if (propsOnDelete) return propsOnDelete(c)
    if (!window.confirm(`Delete customer ${c.name}?`)) return
    try {
      await deleteCustomer(c._id)
      setCustomers((prev) => prev.filter((p) => p._id !== c._id))
    } catch (err) {
      console.error('delete customer', err)
      alert('Failed to delete')
    }
  }

  const handleImport = async () => {
    if (!file) return alert('Please select a CSV file first!')
    try {
      await importCustomers(file)
      alert('Customers imported successfully!')
      load()
    } catch (err) {
      console.error('import customers', err)
      alert('Import failed!')
    }
  }

  const handleExport = async () => {
    try {
      await exportCustomers()
    } catch (err) {
      console.error('export customers', err)
      alert('Export failed!')
    }
  }

  const cardStyle = {
    padding: theme.spacing.md,
    borderRadius: theme.radii.large,
    background: theme.glassCard?.background || theme.colors.surface,
    border: theme.glassCard?.border || `1px solid ${theme.colors.border}`,
    boxShadow: theme.shadows.card
  }

  const btnSmall = {
    padding: '6px 10px',
    borderRadius: theme.radii.medium,
    border: 'none',
    cursor: 'pointer'
  }

  return (
    <div style={{ marginTop: 12 }}>
      {showForm && (
        <div style={{ marginTop: 12, marginBottom: 12 }}>
          <div style={{ width: '100%', maxWidth: 720 }}>
            <CustomerForm initialData={editing || {}} onSubmit={handleSubmit} onCancel={() => { setShowForm(false); setEditing(null) }} />
          </div>
        </div>
      )}

      {loading && <div>Loading...</div>}
      {error && <div style={{ color: 'red' }}>{error}</div>}

      <div style={{ display: 'grid', gap: 14 }}>
        {customers.map((c) => (
          <div key={c._id} style={{ ...cardStyle }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12 }}>
              <div style={{ flex: 1, textAlign: 'center' }}>
                <div style={{ fontWeight: 700, fontSize: theme.typography.fontSizes.xl }}>{c.name}</div>
                <div style={{ color: theme.colors.subtleText, marginTop: 6 }}>{c.email || ''} {c.company ? `• ${c.company}` : ''}</div>
                {c.phone && <div style={{ marginTop: theme.spacing.sm, fontSize: theme.typography.fontSizes.lg }}>{c.phone}</div>}
                {c.notes && <div style={{ marginTop: theme.spacing.sm }}>{c.notes}</div>}
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 8, alignItems: 'flex-end' }}>
                <button onClick={() => handleEdit(c)} style={{ ...btnSmall, background: '#fff', border: `1px solid ${theme.colors.border}` }}>Update</button>
                <button onClick={() => handleDelete(c)} style={{ ...btnSmall, background: theme.colors.danger, color: '#fff' }}>Delete</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
