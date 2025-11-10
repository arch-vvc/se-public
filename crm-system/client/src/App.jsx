 'use client'

import React, { useState } from 'react'
import Dock from './components/Dock/Dock.jsx'
import './components/Dock/Dock.css'
import themes from './theme/theme'
import ThemeContext from './theme/ThemeContext'

// Import wrapper + other pages
import PipelinePage from './Pages/PipelinePage.jsx'
import NewLeads from './Pages/NewLeads.jsx'
import LeadManagement from './Pages/LeadManagement.jsx'
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

  // Theme state
  const themeKeys = Object.keys(themes)
  const [themeName, setThemeName] = useState(themeKeys[0] || 'light')
  const theme = themes[themeName] || themes.light

  const cycleTheme = () => {
    const idx = themeKeys.indexOf(themeName)
    const next = themeKeys[(idx + 1) % themeKeys.length]
    setThemeName(next)
  }

  const dockItems = [
    { label: 'Manage Pipeline', icon: PipelineIcon, onClick: () => setActiveView('pipeline') },
    { label: 'New Leads', icon: LeadsIcon, onClick: () => setActiveView('leads') },
    { label: 'Lead Management', icon: LeadsIcon, onClick: () => setActiveView('leadmanagement') },
    { label: 'Customer Profiles', icon: ProfilesIcon, onClick: () => setActiveView('profiles') },
    { label: 'Support Tickets', icon: TicketsIcon, onClick: () => setActiveView('tickets') },
    { label: 'Business Dashboard', icon: DashboardIcon, onClick: () => setActiveView('dashboard') }
  ]

  return (
    <ThemeContext.Provider value={{ theme, themeName, setThemeName, cycleTheme }}>
  <div style={{ fontFamily: theme.typography.fontFamily, minHeight: '100vh', background: theme.colors.surface, position: 'relative', textAlign: 'center', color: theme.colors.text, paddingBottom: theme.spacing.xl * 4 }}>
      <h1 style={{
        padding: '24px 20px 8px',
        margin: 0,
        fontSize: '3.5rem',
        fontWeight: '700',
        color: theme.colors.primary
      }}>
        CRM System
      </h1>
      {/* small theme switcher */}
      <div style={{ position: 'absolute', right: 12, top: 12 }}>
        <button onClick={cycleTheme} style={{ padding: '8px 12px', borderRadius: theme.radii.small, border: `1px solid ${theme.colors.border}`, background: theme.button.background, color: theme.button.color, cursor: 'pointer' }}>
          Theme: {theme.name}
        </button>
      </div>

      {!activeView && (
        <p style={{
          fontSize: theme.typography.fontSizes.md,
          color: theme.colors.subtleText,
          marginTop: '0',
          marginBottom: '30px'
        }}>
          Select an option from the dock below to continue
        </p>
      )}

      <div style={{ padding: theme.spacing.lg }}>
  {activeView === 'pipeline' && <PipelinePage onBack={() => setActiveView(null)} />}
  {activeView === 'leads' && <NewLeads />}
  {activeView === 'leadmanagement' && <LeadManagement />}
        {activeView === 'profiles' && <CustomerProfiles />}
        {activeView === 'tickets' && <SupportTickets />}
        {activeView === 'dashboard' && <BusinessDashboard />}
      </div>

      <Dock
        items={dockItems}
        magnification={activeView === 'leads' ? 52 : 70}
        distance={activeView === 'leads' ? 120 : 200}
        panelHeight={activeView === 'leads' ? 56 : 68}
      />
    </div>
    </ThemeContext.Provider>
  )
}
