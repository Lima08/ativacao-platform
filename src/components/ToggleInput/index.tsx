// 'use client'
import { useState, useEffect } from 'react'

import { Chip, FormControlLabel, Switch } from '@mui/material'

type ToggleInputProps = {
  toggleId: string
  defaultActive: boolean
  onClickToggle: (id: string, active: boolean) => void
}

export default function ToggleInput({
  toggleId,
  defaultActive,
  onClickToggle
}: ToggleInputProps) {
  const [isActive, setIsActive] = useState(defaultActive)

  const handleToggle = () => {
    const newActiveState = !isActive
    setIsActive(newActiveState)
    onClickToggle(toggleId, newActiveState)
  }

  useEffect(() => {
    setIsActive(defaultActive)
  }, [defaultActive])

  return (
    <div className="flex items-center">
      <div className="relative inline-block w-10 mr-2 align-middle select-none transition duration-200 ease-in">
        <FormControlLabel
          control={
            <Switch
              checked={isActive}
              onChange={() => handleToggle()}
              name="checked"
              color="primary"
            />
          }
          label={
            <Chip
              label={isActive ? 'ativo' : 'inativo'}
              color={isActive ? 'success' : 'error'}
            />
          }
        />
      </div>
      <div className="ml-3 w-14 text-gray-700 font-medium"></div>
    </div>
  )
}
