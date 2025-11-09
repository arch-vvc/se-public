'use client'

import React, { useEffect, useState } from 'react'
import {
  fetchLeads,
  createLead,
  updateLead,
  deleteLead,
} from '../services/leads'
import { useTheme } from '../theme/ThemeContext'

export default function NewLeads() {
  const { theme } = useTheme()
  const [leads, setLeads] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [editing, setEditing] = useState(null)
  const [formError, setFormError] = useState('')
  const [shake, setShake] = useState(false)

  const [form, setForm] = useState({
    name: '',
    email: '',
    source: '',
    status: 'new',
    notes: ''
  })

  const load = async () => {
    setLoading(true)
    try {
      const res = await fetchLeads()
      setLeads(res.data || [])
    } catch (err) {
      console.error('load leads', err)
      setError('Failed to load leads')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [])

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((s) => ({ ...s, [name]: value }))
    setFormError('')
  }

  const validateForm = () => {
    if (!form.name.trim()) return 'Name is required'
    if (!form.email.trim()) return 'Email is required'
    if (!form.source.trim()) return 'Source is required'
    if (!form.notes.trim()) return 'Notes are required'
    return ''
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    const err = validateForm()
    if (err) {
      setFormError(err)
      setShake(true)
      setTimeout(() => setShake(false), 400)
      return
    }

    try {
      if (editing) {
        const updated = await updateLead(editing._id, form)
        setLeads((prev) => prev.map((l) => (l._id === updated._id ? updated : l)))
      } else {
        const created = await createLead(form)
        setLeads((prev) => [created, ...prev])
      }
      setForm({ name: '', email: '', source: '', status: 'new', notes: '' })
      setEditing(null)
      setFormError('')
    } catch (err) {
      console.error('submit lead', err)
      setFormError('Failed to save lead')
    }
  }

  const handleEdit = (l) => {
    setEditing(l)
    setForm({
      name: l.name || '',
      email: l.email || '',
      source: l.source || '',
      status: l.status || 'new',
      notes: l.notes || ''
    })
    setFormError('')
  }

  const handleDelete = async (l) => {
    if (!confirm(`Delete lead ${l.name}?`)) return
    try {
      await deleteLead(l._id)
      setLeads((prev) => prev.filter((p) => p._id !== l._id))
    } catch (err) {
      console.error('delete lead', err)
      alert('Failed to delete lead')
    }
  }

  // Theme-driven UI utilities
  const card = {
    padding: theme.spacing.lg,
    borderRadius: theme.radii.large,
    background: theme.glassCard?.background || theme.colors.surface,
    backdropFilter: theme.glassCard?.backdropFilter || 'none',
    border: theme.glassCard?.border || `1px solid ${theme.colors.border}`,
    boxShadow: theme.shadows.card
  }

  const inputStyle = {
    padding: theme.spacing.md,
    borderRadius: theme.radii.medium,
    border: `1px solid ${theme.colors.border}`,
    background: theme.colors.surface,
    fontSize: theme.typography.fontSizes.md,
    color: theme.colors.text
  }

  const button = {
    padding: `${theme.spacing.sm}px ${theme.spacing.lg}px`,
    borderRadius: theme.radii.medium,
    border: 'none',
    cursor: 'pointer',
    fontWeight: 700,
    background: theme.button.background,
    color: theme.button.color,
    transition: '0.2s'
  }

  // Shake animation
  const shakeStyle = shake
    ? { animation: 'shake 0.3s linear' }
    : {}

  return (
  <div style={{ padding: theme.spacing.lg, maxWidth: 900, margin: '0 auto', textAlign: 'left', color: theme.colors.text }}>
      <style>
        {`
        @keyframes shake {
          0% { transform: translateX(0); }
          25% { transform: translateX(-4px); }
          50% { transform: translateX(4px); }
          75% { transform: translateX(-4px); }
          100% { transform: translateX(0); }
        }
        `}
      </style>

      <h2 style={{ marginTop: 0, fontSize: theme.typography.fontSizes.xl, fontWeight: 700, color: theme.colors.primary }}>
        New Leads
      </h2>
      <p style={{ color: theme.colors.subtleText, marginTop: -8 }}>
        Add and manage incoming leads with a cleaner, brighter layout.
      </p>

      <form
        onSubmit={handleSubmit}
        style={{
          ...card,
          margin: `${theme.spacing.lg}px 0`,
          display: 'grid',
          gap: theme.spacing.md,
          gridTemplateColumns: '1fr 1fr'
        }}
      >
        <input name="name" placeholder="Name *" value={form.name} onChange={handleChange} style={inputStyle} />
        <input name="email" placeholder="Email *" value={form.email} onChange={handleChange} style={inputStyle} />
        <input name="source" placeholder="Source *" value={form.source} onChange={handleChange} style={inputStyle} />
        <select name="status" value={form.status} onChange={handleChange} style={inputStyle}>
          <option value="new">New</option>
          <option value="contacted">Contacted</option>
          <option value="qualified">Qualified</option>
          <option value="lost">Lost</option>
        </select>

        <textarea
          name="notes"
          placeholder="Notes *"
          value={form.notes}
          onChange={handleChange}
          style={{
            ...inputStyle,
            gridColumn: '1 / -1',
            minHeight: 90
          }}
        />

        {formError && (
          <div style={{ color: theme.colors.danger, fontWeight: 600, gridColumn: '1 / -1' }}>
            {formError}
          </div>
        )}

        <div style={{ gridColumn: '1 / -1', display: 'flex', gap: 10 }}>
          <button type="submit" style={{ ...button, ...shakeStyle }}>
            {editing ? 'Update Lead' : 'Create Lead'}
          </button>

          {editing && (
            <button
              type="button"
              onClick={() => {
                setEditing(null)
                setForm({ name: '', email: '', source: '', status: 'new', notes: '' })
              }}
              style={{ ...button, background: theme.colors.subtleText, color: theme.colors.surface }}
            >
              Cancel
            </button>
          )}

          <button type="button" onClick={load} style={{ ...button, background: theme.colors.primary, color: theme.colors.surface }}>
            Refresh
          </button>
        </div>
      </form>

      {loading && <div>Loading...</div>}
      {error && <div style={{ color: 'red' }}>{error}</div>}

      <div style={{ marginTop: 20 }}>
        {leads.length === 0 && !loading ? (
          <div style={{ color: theme.colors.subtleText, padding: theme.spacing.lg }}>No leads yet.</div>
        ) : (
          <div style={{ display: 'grid', gap: 14 }}>
            {leads.map((l) => (
              <div key={l._id} style={{ ...card, padding: theme.spacing.md }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: theme.typography.fontSizes.lg }}>{l.name}</div>
                    <div style={{ fontSize: theme.typography.fontSizes.sm, color: theme.colors.subtleText, marginTop: 2 }}>
                      {l.email || ''} {l.source ? `• ${l.source}` : ''}
                    </div>
                  </div>
                  <div>
                    <button
                      onClick={() => handleEdit(l)}
                      style={{ ...button, padding: '6px 10px', marginRight: 8 }}
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(l)}
                      style={{ ...button, padding: '6px 10px', background: theme.colors.danger }}
                    >
                      Delete
                    </button>
                  </div>
                </div>

                {l.notes && <div style={{ marginTop: theme.spacing.sm, color: theme.colors.text }}>{l.notes}</div>}

                <div style={{ marginTop: theme.spacing.sm, fontSize: theme.typography.fontSizes.sm, color: theme.colors.subtleText }}>
                  Status: {l.status}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
