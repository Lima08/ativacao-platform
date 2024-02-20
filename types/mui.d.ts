import '@mui/material/styles'

declare module '@mui/material/styles' {
  interface TypeBackground {
    customBackground?: string
  }
  interface TypeText {
    contentDarkLight?: string
    contentDefault?: string
  }
}
