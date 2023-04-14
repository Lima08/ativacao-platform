import React from 'react'
import LeftPanelItem from 'components/LeftPanelItem'

import pizzaGraph from '../../../images/icons/pizzaGraph'
import fourSquares from '../../../images/icons/fourSquares'
import megaphoneIcon from '../../../images/icons/megaphoneIcon'
import homeIcon from '../../../images/icons/homeIcon'
import filesIcon from '../../../images/icons/filesIcon'
import inboxIcon from '../../../images/icons/inboxIcon'

function LeftPanelAside() {
  return (
    <aside
      id="sidebar"
      className="fixed hidden z-20 h-full top-0 left-0 pt-16 lg:flex flex-shrink-0 flex-col w-64 transition-width duration-75"
      aria-label="Sidebar"
    >
      <div className="relative flex-1 flex flex-col min-h-0 border-r border-gray-200 bg-white pt-0">
        {/* overflow-y-auto */}
        <div className="flex-1 flex flex-col pt-5 pb-4">
          <div className="flex-1 px-3 bg-white divide-y space-y-1">
            <ul className="space-y-2 pb-2">
              <LeftPanelItem
                title="Home"
                linkSrc="/dashboard/"
                icon={homeIcon}
              />
              <LeftPanelItem
                title="Campanhas"
                linkSrc="/dashboard/campaigns"
                icon={megaphoneIcon}
              />
              <LeftPanelItem
                title="Treinamentos"
                linkSrc="/dashboard/trainings"
                icon={fourSquares}
              />
              <LeftPanelItem
                title="Análises"
                linkSrc="/dashboard/analyzes"
                icon={pizzaGraph}
              />
              {/* <LeftPanelItem
                title="Usuários"
                linkSrc="/dashboard/users"
                icon={userIcon}
              /> */}
              <LeftPanelItem
                title="Processos"
                linkSrc="/dashboard/processess"
                icon={filesIcon}
              />
              <LeftPanelItem
                title="Mural de Avisos"
                linkSrc="/dashboard/communications"
                icon={inboxIcon}
              />
            </ul>
          </div>
        </div>
      </div>
    </aside>
  )
}

export default LeftPanelAside
