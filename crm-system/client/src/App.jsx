import React from 'react'
import PipelineBoard from './components/PipelineBoard'

// Inject Roboto Mono font
const robotoMono = document.createElement('link')
robotoMono.href = 'https://fonts.googleapis.com/css2?family=Roboto+Mono:wght@400;700&display=swap'
robotoMono.rel = 'stylesheet'
document.head.appendChild(robotoMono)

export default function App() {
  return (
    <div style={{ fontFamily: '"Roboto Mono", monospace', background: '#f0f4f8', minHeight: '100vh' }}>
      <header style={{
        padding: '30px 20px',
        margin: 0,
        background: '#ffffff',
        textAlign: 'center',
        fontSize: '4rem',
        fontWeight: '700',
        color: '#222',
        boxShadow: '0 2px 6px rgba(0,0,0,0.05)'
      }}>
        CRM Pipeline
      </header>
      <PipelineBoard />
    </div>
  )
}