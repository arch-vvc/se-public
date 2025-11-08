import React, { useState } from 'react'
import PipelineBoard from './components/PipelineBoard'
import Customers from './components/Customers'

export default function App() {
  const [view, setView] = useState('pipeline') // 'pipeline' | 'customers'

  return (
    <div>
      <header style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 20px', background: '#fff' }}>
        <h1 style={{ padding: 0, margin: 0 }}>CRM Pipeline</h1>
        <nav>
          <button onClick={() => setView('pipeline')} style={{ marginRight: 8 }}>Pipeline</button>
          <button onClick={() => setView('customers')}>Customers</button>
        </nav>
      </header>

      <main>
        {view === 'pipeline' ? <PipelineBoard /> : <Customers />}
      </main>
    </div>
  )
}
