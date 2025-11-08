'use client'

import React, { useRef } from 'react'
import PipelineBoard from '../components/PipelineBoard.jsx'

export default function PipelinePage({ onBack }) {
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
    <div style={{ fontFamily: '"Roboto Mono", monospace', minHeight: '100vh', background: '#f9fafb' }}>
      <header style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '15px 20px', background: '#fff', boxShadow: '0 2px 6px rgba(0,0,0,0.05)' }}>
        <button onClick={onBack} style={{ padding: '8px 14px', background: '#e5e7eb', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: '600' }}>
          ⬅ Home
        </button>
        <h1 style={{ fontSize: '2rem', fontWeight: '700', margin: 0, color: '#222' }}>
          CRM Pipeline
        </h1>
        <button onClick={handleExport} style={{ padding: '8px 14px', background: '#2563eb', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: '600' }}>
          ⬇ Export
        </button>
      </header>

      <main style={{ padding: '20px' }}>
        <PipelineBoard onExport={data => (pipelineRef.current = data)} />
      </main>
    </div>
  )
}
