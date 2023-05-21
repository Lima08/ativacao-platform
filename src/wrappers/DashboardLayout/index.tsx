import { ReactNode } from 'react'

import AsidePanel from 'components/AsidePanel'
import BaseNavbar from 'components/BaseNavbar'

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <div lang="en">
      <BaseNavbar />
      <AsidePanel />
      <main className="w-full md:w-[calc(100%_-_257px)] h-[calc(100%_-_72px)] mt-[72px] md:ml-[257px]">
        {children}
      </main>
    </div>
  )
}
