import { createTheme } from '@mui/material/styles'

export const appTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#ffb947',
      contrastText: '#130603',
    },
    secondary: {
      main: '#ff6d2f',
    },
    background: {
      default: '#090403',
      paper: 'rgba(27, 13, 7, 0.82)',
    },
    text: {
      primary: '#f8e8d6',
      secondary: '#d5bda0',
    },
    success: {
      main: '#5bdf84',
    },
  },
  shape: {
    borderRadius: 18,
  },
  typography: {
    fontFamily: "'Trebuchet MS', 'Gill Sans', 'Noto Sans', sans-serif",
    h1: {
      fontFamily: "'Franklin Gothic Medium', 'Trebuchet MS', sans-serif",
      fontWeight: 700,
    },
    h2: {
      fontFamily: "'Franklin Gothic Medium', 'Trebuchet MS', sans-serif",
      fontWeight: 700,
    },
    h3: {
      fontFamily: "'Franklin Gothic Medium', 'Trebuchet MS', sans-serif",
      fontWeight: 700,
    },
    button: {
      textTransform: 'none',
      fontWeight: 700,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 999,
          paddingInline: '1.1rem',
          minHeight: 48,
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backdropFilter: 'blur(18px)',
          backgroundImage: 'none',
        },
      },
    },
    MuiTextField: {
      defaultProps: {
        variant: 'outlined',
        fullWidth: true,
      },
    },
  },
})
