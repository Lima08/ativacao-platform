// 'use client'
import { useState, useCallback, useRef } from 'react'

type ToggleInputProps = {
  defaultActive: boolean
  onClickToggle: () => void
}

export default function ToggleInput({
  defaultActive,
  onClickToggle
}: ToggleInputProps) {
  const [isActive, setIsActive] = useState(defaultActive)

  const handleToggle = useCallback(() => {
    const newActiveState = !isActive
    setIsActive(newActiveState)
    onClickToggle()
  }, [isActive])

  function handleClick(e: MouseEvent) {
    e.stopPropagation()
    checkboxRef.current.blur()
  }

  const checkboxRef = useRef(null)

  return (
    <div className="flex items-center">
      <label
        htmlFor="toggle-input"
        className="flex items-center cursor-pointer"
      >
        <div className="">
          <div className="relative inline-block w-10 mr-2 align-middle select-none transition duration-200 ease-in">
            <input
              checked={isActive}
              onChange={() => handleToggle()}
              onClick={(e) => handleClick(e)}
              type="checkbox"
              id="toggle"
              className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white appearance-none cursor-pointer checked:bg-none checked:appearance-none checked:bg-white text-white focus:outline-none focus:ring-offset-0 checked:right-0 checked:hover:bg-none"
              ref={checkboxRef}
            />
            <label
              htmlFor="toggle"
              className="toggle-label block overflow-hidden h-6 rounded-full bg-gray-300 cursor-pointer"
            ></label>
          </div>
        </div>
        <div className="ml-3 w-14 text-gray-700 font-medium">
          {isActive ? 'Ativo' : 'Inativo'}
        </div>
      </label>
    </div>
  )
}
