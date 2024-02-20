import { IconButton } from '@mui/material'

type CustomIconButtonProps = {
  id?: string
  sx?: object
  style?: string
  link?: string
  children: React.ReactNode
  onClick?: (params: any) => void
  download?: boolean
}

export default function CustomIconButton({
  sx,
  style,
  link,
  onClick,
  download,
  children
}: CustomIconButtonProps) {
  return (
    <a className={style} href={link} download={download}>
      <IconButton sx={sx} onClick={onClick}>
        {children}
      </IconButton>
    </a>
  )
}
