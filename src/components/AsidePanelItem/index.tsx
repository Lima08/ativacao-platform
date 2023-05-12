import Link from 'next/link'

type AsidePanelItemProps = {
  title: string
  linkSrc: string
  icon: any
}

function AsidePanelItem({ title, linkSrc, icon }: AsidePanelItemProps) {
  return (
    <li>
      <Link
        href={linkSrc}
        className="text-base text-gray-900 font-normal rounded-lg flex items-center p-2 hover:bg-gray-100 group"
      >
        {icon}
        <span className="ml-3">{title}</span>
      </Link>
    </li>
  )
}

export default AsidePanelItem
