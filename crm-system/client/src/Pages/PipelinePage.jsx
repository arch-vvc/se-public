 'use client'

import React, { useRef } from 'react'
import PipelineBoard from '../components/PipelineBoard.jsx'
import { useTheme } from '../theme/ThemeContext'

export default function PipelinePage({ onBack }) {
  const { theme } = useTheme()
  const pipelineRef = useRef([])

  const handleExport = () => {
    const data = pipelineRef.current
    if (!data || data.length === 0) return

    const header = ['Customer', 'Issue', 'Contact', 'Status']
    const rows = data.map(d => [d.name, d.issue, d.contact, d.status])
    const csvContent = [header, ...rows].map(r => r.join(',')).join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', 'pipeline_export.csv')
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <div style={{ fontFamily: theme.typography.fontFamily, background: 'transparent', color: theme.colors.text }}>
      {/* Minimal title to match other pages */}
      <div style={{ padding: `${theme.spacing.sm}px ${theme.spacing.lg}px`, marginBottom: theme.spacing.sm }}>
        <h2 style={{ fontSize: theme.typography.fontSizes.xl, fontWeight: 700, margin: 0, color: theme.colors.primary }}>CRM Pipeline</h2>
        <p style={{ margin: '6px 0 0', color: theme.colors.subtleText }}>Manage your opportunities using the pipeline board below.</p>
      </div>

      <main style={{ padding: theme.spacing.lg }}>
        <PipelineBoard onExport={data => (pipelineRef.current = data)} />
      </main>
    </div>
  )
}
