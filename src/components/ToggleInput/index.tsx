'use client'
import { useState, useCallback } from 'react'

type ToggleInputProps = {
  defaultActive: boolean
  onToggle: () => void
}

export default function ToggleInput({
  defaultActive,
  onToggle
}: ToggleInputProps) {
  const [isActive, setIsActive] = useState(defaultActive)

  const handleToggle = useCallback(() => {
    const newActiveState = !isActive
    setIsActive(newActiveState)
    onToggle()
  }, [isActive, onToggle])

  return (
    <div className="flex items-center">
      <label
        htmlFor="toggle-input"
        className="flex items-center cursor-pointer"
      >
        <div className="relative">
          <input
            type="checkbox"
            className="hidden"
            checked={isActive}
            onChange={() => handleToggle()}
          />
          <div className="toggle__line w-10 h-4 bg-gray-400 rounded-full shadow-inner"></div>
          <div className="toggle__dot absolute w-6 h-6 bg-white rounded-full shadow inset-y-0 left-0"></div>
        </div>
        <div className="ml-3 text-gray-700 font-medium">
          {isActive ? 'Ativo' : 'Inativo'}
        </div>
      </label>
    </div>
  )
}
