// 'use client'
import { useState, useCallback, useRef } from 'react'

type ToggleInputProps = {
  toggleId: string
  defaultActive: boolean
  // onClickToggle: () => void
}

export default function ToggleInput({
  toggleId,
  defaultActive
}: // onClickToggle
ToggleInputProps) {
  const [isActive, setIsActive] = useState(defaultActive)

  const handleToggle = useCallback(() => {
    const newActiveState = !isActive
    setIsActive(newActiveState)
    // onClickToggle(toggleId)
  }, [isActive])

  function handleClick() {
    // if (!checkboxRef.current) return
    // checkboxRef.current.blur()
  }

  const checkboxRef = useRef(null)

  return (
    <div className="flex items-center">
      <div className="relative inline-block w-10 mr-2 align-middle select-none transition duration-200 ease-in">
        <label
          htmlFor={toggleId}
          className="toggle-label block overflow-hidden h-6 rounded-full bg-gray-300 cursor-pointer"
          onClick={(e) => {
            e.stopPropagation()
            handleClick()
          }}
        >
          <input
            checked={isActive}
            onChange={() => handleToggle()}
            type="checkbox"
            id={toggleId}
            className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white appearance-none cursor-pointer checked:bg-none checked:appearance-none checked:bg-white text-white focus:outline-none focus:ring-offset-0 checked:right-0 checked:hover:bg-none"
            ref={checkboxRef}
          />
        </label>
      </div>
      <div className="ml-3 w-14 text-gray-700 font-medium">
        {isActive ? 'Ativo' : 'Inativo'}
      </div>
    </div>
  )
}
