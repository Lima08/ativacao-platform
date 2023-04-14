'use client'
import BaseNavbar from 'components/BaseNavbar'
import LeftPanelAside from 'components/LeftPanelAside'
import { ReactNode } from 'react'

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <div lang="en">
      <BaseNavbar />
      <LeftPanelAside />
      {children}
    </div>
  )
}
