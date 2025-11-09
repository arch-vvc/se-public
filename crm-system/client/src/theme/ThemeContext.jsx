import React, { createContext, useContext } from 'react'

// ThemeContext: Provider will be set up in App.jsx
export const ThemeContext = createContext(null)

export function useTheme() {
  const ctx = useContext(ThemeContext)
  if (!ctx) throw new Error('useTheme must be used within ThemeContext.Provider')
  return ctx
}

export default ThemeContext
