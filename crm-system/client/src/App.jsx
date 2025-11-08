'use client'

import React, { useState } from 'react'
import Dock from './components/Dock/Dock.jsx'
import './components/Dock/Dock.css'

// Import wrapper + other pages
import PipelinePage from './Pages/PipelinePage.jsx'
import NewLeads from './Pages/NewLeads.jsx'
import CustomerProfiles from './Pages/CustomerProfiles.jsx'
import SupportTickets from './Pages/SupportTickets.jsx'
import BusinessDashboard from './Pages/BusinessDashboard.jsx'

// Inject Roboto Mono font
const robotoMono = document.createElement('link')
robotoMono.href = 'https://fonts.googleapis.com/css2?family=Roboto+Mono:wght@400;700&display=swap'
robotoMono.rel = 'stylesheet'
document.head.appendChild(robotoMono)

// Minimalist SVG icons
const PipelineIcon = (
  <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M4 4h16v4H4zM4 10h16v4H4zM4 16h16v4H4z"/>
  </svg>
)

const LeadsIcon = (
  <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="4" y="4" width="16" height="16" rx="2"/>
    <path d="M7 9h10M7 13h6M7 17h8"/>
    <path d="M15 13l2 2 4-4"/>
  </svg>
)

const ProfilesIcon = (
  <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="8" r="4"/>
    <path d="M6 20c0-3.3 2.7-6 6-6s6 2.7 6 6"/>
  </svg>
)

const TicketsIcon = (
  <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="4" y="4" width="16" height="16" rx="2"/>
    <path d="M9 9h6v6H9z"/>
  </svg>
)

const DashboardIcon = (
  <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M3 13h8V3H3zM13 21h8V11h-8zM3 21h8v-6H3zM13 9h8V3h-8z"/>
  </svg>
)

export default function App() {
  const [activeView, setActiveView] = useState(null)

  const dockItems = [
    { label: 'Manage Pipeline', icon: PipelineIcon, onClick: () => setActiveView('pipeline') },
    { label: 'New Leads', icon: LeadsIcon, onClick: () => setActiveView('leads') },
    { label: 'Customer Profiles', icon: ProfilesIcon, onClick: () => setActiveView('profiles') },
    { label: 'Support Tickets', icon: TicketsIcon, onClick: () => setActiveView('tickets') },
    { label: 'Business Dashboard', icon: DashboardIcon, onClick: () => setActiveView('dashboard') }
  ]

  return (
    <div style={{ fontFamily: '"Roboto Mono", monospace', minHeight: '100vh', background: '#f9fafb', position: 'relative', textAlign: 'center' }}>
      <h1 style={{
        padding: '40px 20px 10px',
        margin: 0,
        fontSize: '3.5rem',
        fontWeight: '700',
        color: '#222'
      }}>
        CRM System
      </h1>

      {!activeView && (
        <p style={{
          fontSize: '1rem',
          color: '#555',
          marginTop: '0',
          marginBottom: '30px'
        }}>
          Select an option from the dock below to continue
        </p>
      )}

      <div style={{ padding: '20px' }}>
        {activeView === 'pipeline' && <PipelinePage onBack={() => setActiveView(null)} />}
        {activeView === 'leads' && <NewLeads />}
        {activeView === 'profiles' && <CustomerProfiles />}
        {activeView === 'tickets' && <SupportTickets />}
        {activeView === 'dashboard' && <BusinessDashboard />}
      </div>

      <Dock items={dockItems} />
    </div>
  )
}
