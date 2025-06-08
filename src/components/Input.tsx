// components/Input.tsx
'use client'
import React from 'react'

export const Input = ({ label, value, onChange, type = 'text' }: any) => (
  <div className="mb-2">
    <label className="block text-sm font-medium mb-1">{label}</label>
    <input
      type={type}
      value={value}
      onChange={onChange}
      className="w-full p-2 border rounded"
    />
  </div>
)