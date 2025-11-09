'use client'

import React, { useEffect, useState } from "react"
import { useTheme } from "../theme/ThemeContext"

const CustomerProfiles = () => {
  const { theme } = useTheme()

  const [customers, setCustomers] = useState([])
  const [loading, setLoading] = useState(true)
  const [query, setQuery] = useState("")

  useEffect(() => {
    // Replace with your real API
    const fetchCustomers = async () => {
      setLoading(true)
      try {
        // placeholder data until backend is ready
        const mock = [
          { id: 1, name: "John Doe", email: "john@example.com" },
          { id: 2, name: "Ada Lovelace", email: "ada@math.org" },
          { id: 3, name: "Marie Curie", email: "marie@physics.net" }
        ]
        setCustomers(mock)
      } catch (err) {
        console.error("Failed to fetch customers", err)
      } finally {
        setLoading(false)
      }
    }

    fetchCustomers()
  }, [])

  const filtered = customers.filter((c) =>
    c.name.toLowerCase().includes(query.toLowerCase()) ||
    c.email.toLowerCase().includes(query.toLowerCase())
  )

  return (
    <main style={{ padding: theme.spacing.lg, color: theme.colors.text, textAlign: 'left' }}>
      <header style={{ marginBottom: theme.spacing.md }}>
        <h2 style={{ fontSize: theme.typography.fontSizes.xl, fontWeight: 700, margin: 0, color: theme.colors.primary }}>Customer Profiles</h2>
        <p className="muted" style={{ color: theme.colors.subtleText, marginTop: 6 }}>View and search your customer list.</p>
      </header>

      <div style={{ marginBottom: theme.spacing.md }}>
        <input
          type="search"
          value={query}
          placeholder="Search customers..."
          onChange={(e) => setQuery(e.target.value)}
          style={{
            padding: `${theme.spacing.sm}px ${theme.spacing.md}px`,
            width: "100%",
            maxWidth: 400,
            border: `1px solid ${theme.colors.border}`,
            borderRadius: theme.radii.small,
            background: theme.colors.surface,
            color: theme.colors.text,
            boxSizing: "border-box"
          }}
        />
      </div>

      {loading ? (
        <p>Loading customers…</p>
      ) : filtered.length === 0 ? (
        <p>No customers found.</p>
      ) : (
        <ul style={{ listStyle: "none", padding: 0 }}>
          {filtered.map((c) => (
            <li
              key={c.id}
              style={{
                padding: theme.spacing.md,
                border: `1px solid ${theme.colors.border}`,
                borderRadius: theme.radii.small,
                marginBottom: theme.spacing.sm,
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                background: theme.glassCard?.background || theme.colors.surface
              }}
            >
              <div>
                <strong style={{ color: theme.colors.primary }}>{c.name}</strong>
                <div
                  style={{
                    fontSize: theme.typography.fontSizes.sm,
                    color: theme.colors.subtleText
                  }}
                >
                  {c.email}
                </div>
              </div>

              <div>
                <button
                  style={{
                    marginRight: 8,
                    padding: "6px 12px",
                    borderRadius: theme.radii.small,
                    border: "none",
                    background: theme.colors.primary,
                    color: "#fff",
                    cursor: "pointer"
                  }}
                >
                  View
                </button>
                <button
                  style={{
                    padding: "6px 12px",
                    borderRadius: theme.radii.small,
                    border: "none",
                    background: theme.colors.secondary || "#444",
                    color: "#fff",
                    cursor: "pointer"
                  }}
                >
                  Message
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </main>
  )
}

export default CustomerProfiles
