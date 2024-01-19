import { createTheme } from '@mui/material';

function PopupIcon() {
  return (
    <svg viewBox="0 0 13 7" className="h-6 min-h-6 w-6 min-w-6 p-1">
      <polyline
        className="fill-none stroke-[#a98d72]"
        points="12.5 .5 6.5 6.5 .5 .5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function DropdownIcon() {
  return (
    <div className="mr-2 [&_polyline]:stroke-slate-500">
      <PopupIcon />
    </div>
  );
}

const theme = createTheme({
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
});

export default theme;
