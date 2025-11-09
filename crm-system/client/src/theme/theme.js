// Theme definitions for CRM
const base = {
  radii: {
    small: 6,
    medium: 10,
    large: 14,
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 12,
    lg: 18,
    xl: 24,
  },
  typography: {
    fontFamily: '"Roboto Mono", monospace',
    fontSizes: {
      xs: '0.75rem',
      sm: '0.9rem',
      md: '1rem',
      lg: '1.25rem',
      xl: '2rem'
    }
  },
  shadows: {
    card: '0 6px 24px rgba(0,0,0,0.08)',
    float: '0 10px 40px rgba(0,0,0,0.12)'
  }
}

const light = {
  name: 'light',
  colors: {
    primary: '#111827',
    surface: '#ffffff',
    border: 'rgba(200,200,200,0.5)',
    text: '#111827',
    subtleText: '#6b7280',
    danger: '#c0392b',
    success: '#10b981'
  },
  glassCard: {
    background: 'rgba(255,255,255,0.65)',
    backdropFilter: 'blur(10px)',
    border: '1px solid rgba(200,200,200,0.4)'
  },
  button: {
    background: '#111827',
    color: '#fff'
  },
  ...base
}

const dark = {
  name: 'dark',
  colors: {
    primary: '#e6e7ea',
    surface: '#0b1221',
    border: 'rgba(255,255,255,0.06)',
    text: '#e6e7ea',
    subtleText: '#9ca3af',
    danger: '#ff6b6b',
    success: '#34d399'
  },
  glassCard: {
    background: 'rgba(8,10,14,0.6)',
    backdropFilter: 'blur(8px)',
    border: '1px solid rgba(255,255,255,0.04)'
  },
  button: {
    background: '#111827',
    color: '#fff'
  },
  ...base
}

const neonCyber = {
  name: 'neon-cyber',
  colors: {
    primary: '#00f5ff',
    surface: '#071029',
    border: 'rgba(0,245,255,0.15)',
    text: '#e6fff9',
    subtleText: '#9bdde6',
    danger: '#ff3b6b',
    success: '#00ff9f'
  },
  glassCard: {
    background: 'linear-gradient(135deg, rgba(0,245,255,0.06), rgba(0,0,0,0.12))',
    backdropFilter: 'blur(6px)',
    border: '1px solid rgba(0,245,255,0.12)'
  },
  button: {
    background: '#00f5ff',
    color: '#001219'
  },
  ...base
}

const glassNova = {
  name: 'glass-nova',
  colors: {
    primary: '#0f172a',
    surface: 'rgba(255,255,255,0.85)',
    border: 'rgba(180,180,200,0.45)',
    text: '#0f172a',
    subtleText: '#6b7280',
    danger: '#e02424',
    success: '#16a34a'
  },
  glassCard: {
    background: 'rgba(250,250,255,0.55)',
    backdropFilter: 'blur(12px)',
    border: '1px solid rgba(200,200,220,0.4)'
  },
  button: {
    background: '#0f172a',
    color: '#fff'
  },
  ...base
}

const minimalBlack = {
  name: 'minimal-black',
  colors: {
    primary: '#ffffff',
    surface: '#000000',
    border: 'rgba(255,255,255,0.06)',
    text: '#ffffff',
    subtleText: '#9ca3af',
    danger: '#ff6b6b',
    success: '#34d399'
  },
  glassCard: {
    background: 'rgba(0,0,0,0.6)',
    backdropFilter: 'none',
    border: '1px solid rgba(255,255,255,0.04)'
  },
  button: {
    background: '#ffffff',
    color: '#000'
  },
  ...base
}

const themes = {
  light,
  dark,
  'neon-cyber': neonCyber,
  'glass-nova': glassNova,
  'minimal-black': minimalBlack
}

export default themes
