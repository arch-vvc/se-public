import React from 'react'
import PipelineBoard from './pipelineboard'

export default function App() {
  return (
    <div>
      <h1 style={{ fontFamily: 'Inter, sans-serif', textAlign: 'center', padding: '20px' }}>
        CRM Sales Pipeline
      </h1>
      <PipelineBoard />
    </div>
  )
}