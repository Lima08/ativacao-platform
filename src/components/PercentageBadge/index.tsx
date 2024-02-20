import React from 'react'

import { Badge, BadgeProps } from '@mui/material'

interface PercentageBadgeProps extends Omit<BadgeProps, 'color'> {
  value: number
}

function PercentageBadge({ value, ...props }: PercentageBadgeProps) {
  let color: BadgeProps['color'] = 'error'
  if (value >= 71) {
    color = 'success'
  } else if (value >= 41) {
    color = 'warning'
  }
  return <Badge badgeContent={`${value}%`} color={color} {...props} />
}

export default PercentageBadge
