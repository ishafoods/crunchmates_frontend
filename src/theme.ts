import { createTheme } from '@mui/material/styles'

export const appTheme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#ff9f1a',
      contrastText: '#14110f',
    },
    secondary: {
      main: '#e2231a',
      contrastText: '#ffffff',
    },
    background: {
      default: '#ffffff',
      paper: '#ffffff',
    },
    text: {
      primary: '#14110f',
      secondary: '#5f5852',
    },
    divider: 'rgba(20, 17, 15, 0.12)',
    success: {
      main: '#1f9254',
    },
    error: {
      main: '#e2231a',
    },
  },
  shape: {
    borderRadius: 18,
  },
  typography: {
    fontFamily: "'Trebuchet MS', 'Gill Sans', 'Noto Sans', sans-serif",
    h1: {
      fontFamily: "'Franklin Gothic Medium', 'Trebuchet MS', sans-serif",
      fontWeight: 800,
      textTransform: 'uppercase',
    },
    h2: {
      fontFamily: "'Franklin Gothic Medium', 'Trebuchet MS', sans-serif",
      fontWeight: 800,
      textTransform: 'uppercase',
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
          boxShadow: 'none',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
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
