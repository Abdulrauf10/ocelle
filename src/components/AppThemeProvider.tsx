'use client';

import { createTheme, ThemeProvider, ThemeOptions } from '@mui/material';
import React from 'react';

function PopupIcon() {
  return (
    <svg viewBox="0 0 13 7" className="h-6 min-h-6 w-6 min-w-6 p-1">
      <polyline
        className="fill-none stroke-brown"
        points="12.5 .5 6.5 6.5 .5 .5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function DropdownIcon() {
  return (
    <div className="pointer-events-none absolute right-0 mr-2 [&_polyline]:stroke-slate-500">
      <PopupIcon />
    </div>
  );
}

const baseTheme: ThemeOptions = {
  typography: {
    fontFamily: 'var(--font-jost)',
  },
  palette: {
    primary: {
      main: '#A98D72',
    },
  },
  components: {
    MuiAutocomplete: {
      defaultProps: {
        popupIcon: <PopupIcon />,
      },
      styleOverrides: {
        inputRoot: {
          paddingTop: 3,
          paddingBottom: 3,
        },
        paper: {
          marginTop: 8,
        },
        listbox: {
          padding: 8,
        },
        option: {
          borderRadius: 8,
        },
      },
    },
    MuiSelect: {
      defaultProps: {
        IconComponent: DropdownIcon,
      },
    },
    MuiMenu: {
      styleOverrides: {
        list: {
          padding: 8,
        },
      },
    },
    MuiMenuItem: {
      styleOverrides: {
        root: {
          borderRadius: 8,
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          borderRadius: '8px',
        },
        input: {
          borderRadius: '8px',
          padding: '14px 16.5px',
        },
      },
    },
    MuiInputLabel: {
      styleOverrides: {
        root: {
          transform: 'translate(16px, 14px) scale(1)',
          ['&.Mui-focused, &.MuiFormLabel-filled']: {
            transform: 'translate(16px, -9px) scale(.75)',
          },
        },
        shrink: {
          transform: 'translate(16px, -9px) scale(.75)',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: '8px',
        },
      },
    },
  },
};

interface ThemeProviderProps<Theme = {}> {
  children?: React.ReactNode;
  theme?: Partial<Theme> | ((outerTheme: Theme) => Theme);
}

export default function AppThemeProvider({ children, theme }: ThemeProviderProps) {
  const computedTheme = React.useMemo(() => {
    if (typeof theme === 'function') {
      return theme(baseTheme);
    } else if (theme) {
      return createTheme(baseTheme, theme);
    }
    return createTheme(baseTheme);
  }, [theme]);
  return <ThemeProvider theme={computedTheme}>{children}</ThemeProvider>;
}
