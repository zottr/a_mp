import { createTheme } from '@mui/material/styles';

const mainTheme = createTheme({
  palette: {
    mode: 'light',
    common: {
      black: '#000',
      white: '#fff',
    },
    primary: {
      main: '#673AB7', // Regal purple
      light: '#9575CD', // Soft lavender
      dark: '#512DA8', // Deep violet
      surface: 'hsl(270, 60%, 90%)', // Soft purple background
      lightsurface: 'hsl(270, 60%, 99%)', // Soft purple background
      contrastText: '#fff',
    },
    secondary: {
      main: '#FFB300', // Warm Amber
      light: '#FFD54F', // Soft Gold
      dark: '#FF8F00', // Deep Golden
      surface: 'hsl(42, 80%, 90%)', // Light golden cream
      lightsurface: 'hsl(42, 80%, 99%)', // Light golden cream
      contrastText: '#000',
    },
    // secondary: {
    //   main: '#009688', // Deep Teal
    //   light: '#4DB6AC', // Soft Aqua
    //   dark: '#00796B', // Rich Emerald
    //   surface: 'hsl(180, 60%, 90%)', // Light Mint background
    //   contrastText: '#fff',
    // },
    // secondary: {
    //   main: '#FFC107', // Vibrant golden amber
    //   light: '#FFD54F', // Bright warm yellow
    //   dark: '#FFA000', // Deep mustard amber
    //   surface: 'hsl(45, 100%, 90%)', // Warm light yellow
    //   contrastText: '#000',
    // },
    // primary: {
    //   main: '#388E3C', // Rich forest green
    //   light: '#66BB6A', // Fresh grass green
    //   dark: '#1B5E20', // Deep evergreen
    //   surface: 'hsl(140, 40%, 85%)', // Muted green background
    //   contrastText: '#fff',
    // },

    //deepblue-orange
    // primary: {
    //   main: '#1565C0', // Deep, rich blue
    //   light: '#42A5F5', // Bright sky blue
    //   dark: '#0D47A1', // Dark navy
    //   surface: 'hsl(220, 90%, 95%)', // Light background
    //   contrastText: '#fff',
    // },
    // secondary: {
    //   main: '#FF7043', // Bold burnt orange
    //   light: '#FFAB91', // Warm pastel orange
    //   dark: '#D84315', // Deep rusty orange
    //   surface: 'hsl(15, 80%, 90%)', // Soft orange tint
    //   contrastText: '#fff',
    // },
    // secondary: {
    //   main: '#00BCD4', // Bright electric cyan
    //   light: '#4DD0E1', // Soft sky blue
    //   dark: '#00838F', // Deep teal-blue
    //   surface: 'hsl(190, 80%, 90%)', // Cool blue tint
    //   contrastText: '#000',
    // },
    //    brown-amber
    // primary: {
    //   main: '#795548', // Rich brown (similar depth to your current blue)
    //   light: '#A1887F', // Lighter brown for hover states, highlights
    //   dark: '#5D4037', // Darker brown for contrast
    //   surface: 'hsl(25, 30%, 90%)', // Light brownish-beige for background surfaces
    //   contrastText: '#fff', // White for readability
    // },
    // secondary: {
    //   main: '#FFC107', // Bold golden amber
    //   light: '#FFD54F', // Soft pastel yellow-orange
    //   dark: '#FFA000', // Deep rich amber
    //   surface: 'hsl(45, 100%, 90%)', // Light warm yellow for backgrounds
    //   contrastText: '#000', // High contrast for text
    // },

    //Teal secondary
    // secondary: {
    //   main: '#009688', // Vibrant teal, works as a strong contrast to brown
    //   light: '#4DB6AC', // Softer teal for subtle highlights
    //   dark: '#00796B', // Deep teal for buttons, accents
    //   surface: 'hsl(174, 50%, 90%)', // Light minty-teal for backgrounds
    //   contrastText: '#fff', // White for readability on teal elements
    // },
    //blue primary
    // primary: {
    //   main: '#1976d2',
    //   light: '#42a5f5',
    //   dark: '#1565c0',
    //   // surface: '#e3f2fd',
    //   surface: 'hsl(208, 92%, 96%)',
    //   contrastText: '#fff',
    // },
    //brown primary
    //orange secondary
    // secondary: {
    //   main: '#ff9800', // Vibrant amber-orange
    //   light: '#ffb74d', // Softer pastel shade
    //   dark: '#f57c00', // Rich, deep orange
    //   surface: 'hsl(36, 92%, 96%)', // Soft warm background tone
    //   contrastText: '#000', // Black text for readability
    // },
    //purple secondary
    // secondary: {
    //   main: '#9c27b0',
    //   light: '#ba68c8',
    //   dark: '#7b1fa2',
    //   surface: '#f3e5f5',
    //   contrastText: '#fff',
    // },
    error: {
      main: '#d32f2f',
      light: '#ef5350',
      dark: '#c62828',
      contrastText: '#fff',
    },
    warning: {
      main: '#ed6c02',
      light: '#ff9800',
      dark: '#e65100',
      contrastText: '#fff',
    },
    info: {
      main: '#0288d1',
      light: '#03a9f4',
      dark: '#01579b',
      contrastText: '#fff',
    },
    success: {
      main: '#2e7d32',
      light: '#4caf50',
      dark: '#1b5e20',
      contrastText: '#fff',
    },
    grey: {
      50: '#fafafa',
      100: '#f5f5f5',
      200: '#eeeeee',
      300: '#e0e0e0',
      400: '#bdbdbd',
      500: '#9e9e9e',
      600: '#757575',
      700: '#616161',
      800: '#424242',
      900: '#212121',
      A100: '#f5f5f5',
      A200: '#eeeeee',
      A400: '#bdbdbd',
      A700: '#616161',
    },
    contrastThreshold: 3,
    tonalOffset: 0.2,
    text: {
      primary: 'rgba(0, 0, 0, 0.87)',
      secondary: 'rgba(0, 0, 0, 0.6)',
      disabled: 'rgba(0, 0, 0, 0.38)',
    },
    divider: 'rgba(0, 0, 0, 0.12)',
    background: {
      paper: '#fff',
      default: '#fff',
    },
    action: {
      active: 'rgba(0, 0, 0, 0.54)',
      hover: 'rgba(0, 0, 0, 0.04)',
      hoverOpacity: 0.04,
      selected: 'rgba(0, 0, 0, 0.08)',
      selectedOpacity: 0.08,
      disabled: 'rgba(0, 0, 0, 0.26)',
      disabledBackground: 'rgba(0, 0, 0, 0.12)',
      disabledOpacity: 0.38,
      focus: 'rgba(0, 0, 0, 0.12)',
      focusOpacity: 0.12,
      activatedOpacity: 0.12,
    },
  },
  typography: {
    fontFamily: 'Poppins, sans-serif',
    b1: {
      fontSize: '1rem',
      fontWeight: 400,
      lineHeight: 1.2,
      letterSpacing: '0.00938em',
      fontStyle: 'normal',
    },
    lightb1: {
      fontSize: '1rem',
      fontWeight: 300,
      lineHeight: 1.2,
      letterSpacing: '0.00938em',
      fontStyle: 'normal',
    },
    heavyb1: {
      fontSize: '1rem',
      fontWeight: 500,
      lineHeight: 1.2,
      letterSpacing: '0.00938em',
      fontStyle: 'normal',
    },
    b2: {
      fontSize: '0.875rem',
      fontWeight: 400,
      lineHeight: 1.43,
      letterSpacing: '0.01071em',
      fontStyle: 'normal',
    },
    lightb2: {
      fontSize: '0.875rem',
      fontWeight: 300,
      lineHeight: 1.43,
      letterSpacing: '0.01071em',
      fontStyle: 'normal',
    },
    heavyb2: {
      fontSize: '0.875rem',
      fontWeight: 500,
      lineHeight: 1.43,
      letterSpacing: '0.01071em',
      fontStyle: 'normal',
    },
    b3: {
      fontSize: '0.800rem',
      fontWeight: 400,
      lineHeight: 1.43,
      letterSpacing: '0.01071em',
      fontStyle: 'normal',
    },
    lightb3: {
      fontSize: '0.800rem',
      fontWeight: 300,
      lineHeight: 1.43,
      letterSpacing: '0.01071em',
      fontStyle: 'normal',
    },
    heavyb3: {
      fontSize: '0.800rem',
      fontWeight: 500,
      lineHeight: 1.43,
      letterSpacing: '0.01071em',
      fontStyle: 'normal',
    },
    h1: { fontSize: '6rem', fontWeight: 500 },
    h2: { fontSize: '3.75rem', fontWeight: 600 },
    h3: { fontSize: '3rem', fontWeight: 600 },
    h4: { fontSize: '2.125rem', fontWeight: 700 },
    h5: { fontSize: '1.5rem', fontWeight: 700 },
    h6: { fontSize: '1.25rem', fontWeight: 700 },
    h7: { fontSize: '1.15rem', fontWeight: 700 }, //default line height should be 1.25*font-size
    h8: { fontSize: '1rem', fontWeight: 700 }, //default line height should be 1.25*font-size
    button: undefined,
    button1: {
      fontSize: '1rem',
      fontWeight: 600,
      fontFamily: 'Noto Sans, sans-serif',
      fontOpticalSizing: 'auto',
      fontVariationSettings: "'wdth' 100",
      textTransform: 'none',
    },
    button2: {
      fontSize: '0.875rem',
      fontWeight: 600,
      fontFamily: 'Noto Sans, sans-serif',
      fontOpticalSizing: 'auto',
      fontVariationSettings: "'wdth' 100",
      textTransform: 'none',
    },
    button3: {
      fontSize: '0.790rem',
      fontWeight: 600,
      fontFamily: 'Noto Sans, sans-serif',
      fontOpticalSizing: 'auto',
      fontVariationSettings: "'wdth' 100",
      textTransform: 'none',
    },
    label1: {
      fontSize: '1rem',
      fontWeight: 500,
      fontFamily: 'Noto Sans, sans-serif',
      fontOpticalSizing: 'auto',
      fontVariationSettings: "'wdth' 100",
      textTransform: 'none',
    },
    heavylabel1: {
      fontSize: '1rem',
      fontWeight: 600,
      fontFamily: 'Noto Sans, sans-serif',
      fontOpticalSizing: 'auto',
      fontVariationSettings: "'wdth' 100",
      textTransform: 'none',
    },
    label2: {
      fontSize: '0.875rem',
      fontWeight: 500,
      fontFamily: 'Noto Sans, sans-serif',
      fontOpticalSizing: 'auto',
      fontVariationSettings: "'wdth' 100",
      textTransform: 'none',
    },
  },
});
export default mainTheme;
