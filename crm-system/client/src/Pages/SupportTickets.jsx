 'use client'

import React from 'react'
import { useTheme } from '../theme/ThemeContext'

export default function SupportTickets() {
  const { theme } = useTheme()
  return (
    <div style={{ textAlign: 'center', padding: theme.spacing.lg, color: theme.colors.text }}>
      <h2 style={{ fontSize: theme.typography.fontSizes.xl, fontWeight: '700', marginBottom: theme.spacing.md }}>
        Support Tickets
      </h2>
      <p style={{ fontSize: theme.typography.fontSizes.md, color: theme.colors.subtleText }}>
        Here you will be able to generate and update support tickets.
      </p>
      <p style={{ fontSize: theme.typography.fontSizes.sm, color: theme.colors.subtleText, marginTop: theme.spacing.sm }}>
        (Feature coming soon)
      </p>
    </div>
  )
}
