import {createTheme} from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#0e7490',
      light: '#38bdf8',
      dark: '#0f5a74',
      contrastText: '#ffffff'
    },
    secondary: {
      main: '#65a30d',
      light: '#bef264',
      dark: '#3f6212'
    },
    background: {
      default: '#f9fafb',
      paper: '#ffffff'
    },
    text: {
      primary: '#052e16',
      secondary: '#64748b'
    }
  },
  typography: {
    fontFamily: 'Pretendard',
    h6: {
      fontWeight: 600
    }
  },
  shape: {
    borderRadius: 4
  },
  components: {
    MuiButton: {
      defaultProps: {
        disableRipple: true,
        disableElevation: true
      },
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 500,
          borderRadius: 8,
          '&.Mui-focusVisible': {
            outline: 'none',
            boxShadow: 'none'
          }
        }
      }
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 4,
            minHeight: 38,
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
          fontSize: 14,
          '& .MuiSelect-select': {
            minWidth: 72,
            minHeight: 21,
          }
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
    },
    MuiSnackbarContent: {
      styleOverrides: {
        root: {
          backgroundColor: 'rgba(14, 116, 144, 0.8)',
          color: '#f0fdfa'
        }
      }
    }
  }
});

export default theme;
