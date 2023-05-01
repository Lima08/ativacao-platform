import AsidePanelItem from 'components/AsidePanelItem'

import pizzaGraph from '../../../images/icons/pizzaGraph'
import fourSquares from '../../../images/icons/fourSquares'
import megaphoneIcon from '../../../images/icons/megaphoneIcon'
import homeIcon from '../../../images/icons/homeIcon'
import filesIcon from '../../../images/icons/filesIcon'
import inboxIcon from '../../../images/icons/inboxIcon'

function AsidePanel() {
  return (
    <aside
      id="sidebar"
      className="fixed hidden z-20 h-full top-0 left-0 pt-16 md:flex flex-shrink-0 flex-col md:w-52"
      aria-label="Sidebar"
    >
      <div className="relative flex-1 flex flex-col min-h-0 border-r border-gray-200 bg-white pt-0">
        {/* overflow-y-auto */}
        <div className="flex-1 flex flex-col pt-5 pb-4">
          <div className="flex-1 px-3 bg-white divide-y space-y-1">
            <ul className="space-y-2 pb-2">
              <AsidePanelItem title="Home" linkSrc="/in" icon={homeIcon} />
              <AsidePanelItem
                title="Campanhas"
                linkSrc="/in/campaigns"
                icon={megaphoneIcon}
              />
              <AsidePanelItem
                title="Treinamentos"
                linkSrc="/in/trainings"
                icon={fourSquares}
              />
              <AsidePanelItem
                title="Análises"
                linkSrc="/in/analyzes"
                icon={pizzaGraph}
              />

              <AsidePanelItem
                title="Mural de Avisos"
                linkSrc="/in/communications"
                icon={inboxIcon}
              />
            </ul>
          </div>
        </div>
      </div>
    </aside>
  )
}

export default AsidePanel
