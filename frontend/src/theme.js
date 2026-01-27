import {createTheme} from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1e3a8a',
      light: '#3b82f6',
      dark: '#1e40af',
      contrastText: '#ffffff'
    },
    secondary: {
      main: '#475569',
      light: '#64748b',
      dark: '#334155'
    },
    background: {
      default: '#ffffff',
      paper: '#ffffff'
    },
    text: {
      primary: '#0f172a',
      secondary: '#475569'
    }
  },
  typography: {
    fontFamily: 'Pretendard', 
    fontSize: 14,
    h4: {
      fontWeight: 700,
      letterSpacing: '-0.02em'
    },
    h5: {
      fontWeight: 600,
      letterSpacing: '-0.01em'
    },
    h6: {
      fontWeight: 600
    }
  },
  shape: {
    borderRadius: 4
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 500,
          borderRadius: 8
        }
      }
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 4,
            minHeight: 40,
            '& .MuiOutlinedInput-input': {
              fontSize: 14,
              minHeight: 24,
              boxSizing: 'border-box'
            },
            '&:hover fieldset': {
              borderColor: '#1e3a8a'
            },
            '&.Mui-focused fieldset': {
              borderColor: '#1e3a8a',
              borderWidth: 1
            }
          }
        }
      }
    },
    MuiSelect: {
      styleOverrides: {
        root: {
          borderRadius: 4,
          fontSize: 14
        },
        select: {
          fontSize: 14
        }
      }
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 4,
          boxShadow: 'none'
        }
      }
    }
  }
});

export default theme;
