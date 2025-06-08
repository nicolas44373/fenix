// src/components/ui/button.tsx
import React from 'react'

export const Button = ({ children, onClick, disabled = false }: {
  children: React.ReactNode
  onClick?: () => void
  disabled?: boolean
}) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
    >
      {children}
    </button>
  )
}
