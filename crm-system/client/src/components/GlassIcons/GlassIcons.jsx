import React from 'react'
import './GlassIcons.css'

// Minimalist SVG icons
const HomeIcon = (
  <svg xmlns="" width="28" height="28" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 9.5L14 2l11 7.5V22a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V9.5z"/>
    <path d="M9 22V12h6v10"/>
  </svg>
)

const ExportIcon = (
  <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 5v14"/>
    <path d="M5 12l7-7 7 7"/>
    <path d="M19 19H5a2 2 0 0 1-2-2V5"/>
  </svg>
)

const GlassIcons = ({ items, className }) => {
  return (
    <div className={`icon-btns ${className || ''}`}>
      {items.map((item, index) => (
        <button
          key={index}
          className={`icon-btn ${item.customClass || ''}`}
          aria-label={item.label}
          type="button"
          onClick={item.onClick}
        >
          <span className="icon-btn__front">
            <span className="icon-btn__icon" aria-hidden="true">
              {item.icon}
            </span>
          </span>
          <span className="icon-btn__label">{item.label}</span>
        </button>
      ))}
    </div>
  )
}

export { HomeIcon, ExportIcon }
export default GlassIcons
