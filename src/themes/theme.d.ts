import '@mui/material/styles';

// Extend the Typography variant options
declare module '@mui/material/styles' {
  interface TypographyVariants {
    button1: React.CSSProperties;
    button2: React.CSSProperties;
    button3: React.CSSProperties;
  }

  // Allow `variant="button1"` to be used in Typography props
  interface TypographyVariantsOptions {
    button1?: React.CSSProperties;
    button2?: React.CSSProperties;
    button3?: React.CSSProperties;
  }
}

// Extend the Typography component's props
declare module '@mui/material/Typography' {
  interface TypographyPropsVariantOverrides {
    button1: true;
    button2: true;
    button3: true;
  }
}
