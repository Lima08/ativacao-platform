import { createTheme } from '@mui/material/styles'

const globalTheme = createTheme({
  palette: {
    background: {
      customBackground: '#1976d2'
    },
    text: {
      contentDarkLight: '#6e6e6e',
      contentDefault: '#262626',
    }
  },
  typography: {
    fontFamily: 'roboto, sans-serif',

    h1: {
      color: '#121212'
    },
    h2: {
      color: '#121212'
    },
    h3: {
      color: '#121212'
    },
    h4: {
      color: '#121212'
    },
    h5: {
      color: '#121212'
    },
    h6: {
      color: '#121212'
    },
    body1: {
      color: '#3d3d3d'
    },

    body2: {
      color: '#3d3d3d'
    }
  },
  components: {
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: '#171716',
          color: '#ffffff'
        }
      }
    },
    MuiButton: {
      styleOverrides: {
        contained: {
          backgroundColor: '#1976d2 !important',
          color: '#ffffff !important',
          '&:disabled': {
            backgroundColor: '#e0e0e0 !important'
          }
        },
        containedWarning: {
          backgroundColor: '#e61919 !important'
        },
        containedSuccess: {
          backgroundColor: '#388e3c !important'
        }
      }
    },
    MuiFab: {
      styleOverrides: {
        root: {
          backgroundColor: '#ffffff !important',
          ':hover': {
            backgroundColor: '#1976d2 !important'
          }
        }
      }
    },
    MuiSvgIcon: {
      styleOverrides: {
        root: {
          ':hover': {
            color: '#ffffff !important'
          }
        }
      }
    },
    MuiCheckbox: {
      styleOverrides: {
        root: {
          color: '#121212'
        }
      }
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& input:focus': {
            boxShadow: 'none '
          },
          '& textarea:focus': {
            boxShadow: 'none '
          }
        }
      }
    }
  }
})

export default globalTheme
