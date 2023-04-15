'use client'
import BaseNavbar from 'components/BaseNavbar'
import AsidePanel from 'components/AsidePanel'
import { ReactNode } from 'react'

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <div lang="en">
      <BaseNavbar />
      <AsidePanel />
      {children}
    </div>
  )
}
