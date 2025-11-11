"use client"

import React, { useEffect, useState } from 'react'
import { useTheme } from '../theme/ThemeContext'
import { fetchTickets, createTicket, updateTicket, deleteTicket } from '../services/tickets'

export default function SupportTickets() {
  const { theme } = useTheme()
  const [tickets, setTickets] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [editing, setEditing] = useState(null)
  const [formError, setFormError] = useState('')
  const [shake, setShake] = useState(false)

  const [form, setForm] = useState({
    name: '',
    email: '',
    subject: '',
    description: '',
    priority: 'low',
    status: 'new',
  })

  const load = async () => {
    setLoading(true)
    try {
      const res = await fetchTickets()
      setTickets(res.data || [])
    } catch (err) {
      console.error('load tickets', err)
      setError('Failed to load tickets')
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
    if (!form.subject.trim()) return 'Subject is required'
    if (!form.description.trim()) return 'Description is required'
    if (!['low', 'medium', 'high'].includes(form.priority)) return 'Priority is required'
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
        const updated = await updateTicket(editing._id, form)
        setTickets((prev) => prev.map((t) => (t._id === updated._id ? updated : t)))
      } else {
        // ensure status is new on create unless explicitly changed
        const toCreate = { ...form, status: form.status || 'new' }
        const created = await createTicket(toCreate)
        setTickets((prev) => [created, ...prev])
      }
      setForm({ name: '', email: '', subject: '', description: '', priority: 'low', status: 'new' })
      setEditing(null)
      setFormError('')
    } catch (err) {
      console.error('submit ticket', err)
      setFormError('Failed to save ticket')
    }
  }

  const handleEdit = (t) => {
    setEditing(t)
    setForm({
      name: t.name || '',
      email: t.email || '',
      subject: t.subject || '',
      description: t.description || '',
      priority: t.priority || 'low',
      status: t.status || 'new',
    })
    setFormError('')
  }

  const handleDelete = async (t) => {
    if (!confirm(`Delete ticket ${t.subject || t._id}?`)) return
    try {
      await deleteTicket(t._id)
      setTickets((prev) => prev.filter((p) => p._id !== t._id))
    } catch (err) {
      console.error('delete ticket', err)
      alert('Failed to delete ticket')
    }
  }

  // Theme-driven UI utilities (copied from NewLeads style patterns)
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

  const shakeStyle = shake
    ? { animation: 'shake 0.3s linear' }
    : {}

  const formatDate = (d) => {
    if (!d) return ''
    try {
      return new Date(d).toLocaleString()
    } catch (e) {
      return ''
    }
  }

  return (
    <div style={{ padding: theme.spacing.lg, maxWidth: 900, margin: '0 auto', textAlign: 'left', color: theme.colors.text }}>
      <style>
        {`@keyframes shake { 0%{transform:translateX(0)}25%{transform:translateX(-4px)}50%{transform:translateX(4px)}75%{transform:translateX(-4px)}100%{transform:translateX(0)} }`}
      </style>

      <h2 style={{ marginTop: 0, fontSize: theme.typography.fontSizes.xl, fontWeight: 700, color: theme.colors.primary }}>
        Support Tickets
      </h2>
      <p style={{ color: theme.colors.subtleText, marginTop: -8 }}>
        Create and manage support tickets. Fields marked * are required.
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

        <input name="subject" placeholder="Subject *" value={form.subject} onChange={handleChange} style={inputStyle} />

        <div style={{ ...inputStyle, display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ fontSize: theme.typography.fontSizes.sm, color: theme.colors.subtleText }}>Priority:</div>
          <label style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <input type="radio" name="priority" value="low" checked={form.priority === 'low'} onChange={handleChange} /> Low
          </label>
          <label style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <input type="radio" name="priority" value="medium" checked={form.priority === 'medium'} onChange={handleChange} /> Medium
          </label>
          <label style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <input type="radio" name="priority" value="high" checked={form.priority === 'high'} onChange={handleChange} /> High
          </label>
        </div>

        <select name="status" value={form.status} onChange={handleChange} style={inputStyle}>
          <option value="new">New</option>
          <option value="in-progress">In Progress</option>
          <option value="resolved">Resolved</option>
          <option value="escalated">Escalated</option>
        </select>

        <textarea
          name="description"
          placeholder="Description *"
          value={form.description}
          onChange={handleChange}
          style={{
            ...inputStyle,
            gridColumn: '1 / -1',
            minHeight: 110
          }}
        />

        {formError && (
          <div style={{ color: theme.colors.danger, fontWeight: 600, gridColumn: '1 / -1' }}>
            {formError}
          </div>
        )}

        <div style={{ gridColumn: '1 / -1', display: 'flex', gap: 10 }}>
          <button type="submit" style={{ ...button, ...shakeStyle }}>
            {editing ? 'Update Ticket' : 'Create Ticket'}
          </button>

          {editing && (
            <button
              type="button"
              onClick={() => {
                setEditing(null)
                setForm({ name: '', email: '', subject: '', description: '', priority: 'low', status: 'new' })
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
        {tickets.length === 0 && !loading ? (
          <div style={{ color: theme.colors.subtleText, padding: theme.spacing.lg }}>No tickets yet.</div>
        ) : (
          <div style={{ display: 'grid', gap: 14 }}>
            {tickets.map((t) => (
              <div key={t._id} style={{ ...card, padding: theme.spacing.md }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: theme.typography.fontSizes.lg }}>{t.subject}</div>
                    <div style={{ fontSize: theme.typography.fontSizes.sm, color: theme.colors.subtleText, marginTop: 2 }}>
                      {t.name || ''} • {t.email || ''}
                    </div>
                  </div>
                  <div>
                    <button
                      onClick={() => handleEdit(t)}
                      style={{ ...button, padding: '6px 10px', marginRight: 8 }}
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(t)}
                      style={{ ...button, padding: '6px 10px', background: theme.colors.danger }}
                    >
                      Delete
                    </button>
                  </div>
                </div>

                {t.description && <div style={{ marginTop: theme.spacing.sm, color: theme.colors.text }}>{t.description}</div>}

                <div style={{ marginTop: theme.spacing.sm, fontSize: theme.typography.fontSizes.sm, color: theme.colors.subtleText }}>
                  Ticket ID: {t._id} • Priority: {t.priority} • Status: {t.status}
                </div>

                <div style={{ marginTop: 6, fontSize: theme.typography.fontSizes.xs || 12, color: theme.colors.subtleText }}>
                  Created: {formatDate(t.createdAt)}{t.updatedAt && t.updatedAt !== t.createdAt ? ` • Last updated: ${formatDate(t.updatedAt)}` : ''}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
