import '@mui/material/styles';

// Extend the Typography variant options
declare module '@mui/material/styles' {
  interface TypographyVariants {
    button1: React.CSSProperties;
    button2: React.CSSProperties;
    button3: React.CSSProperties;
    h7: React.CSSProperties;
    b2: React.CSSProperties;
    heavylabel1: React.CSSProperties;
    label2: React.CSSProperties;
    b1: React.CSSProperties;
    heavyb1: React.CSSProperties;
    label1: React.CSSProperties;
    heavyb2: React.CSSProperties;
  }

  // Allow `variant="button1"` to be used in Typography props
  interface TypographyVariantsOptions {
    button1?: React.CSSProperties;
    button2?: React.CSSProperties;
    button3?: React.CSSProperties;
    h7: React.CSSProperties;
    b2?: React.CSSProperties;
    heavylabel1?: React.CSSProperties;
    label2?: React.CSSProperties;
    b1?: React.CSSProperties;
    heavyb1?: React.CSSProperties;
    label1?: React.CSSProperties;
    heavyb2?: React.CSSProperties;
  }
}

// Extend the Typography component's props
declare module '@mui/material/Typography' {
  interface TypographyPropsVariantOverrides {
    button1: true;
    button2: true;
    button3: true;
    h7: true;
    b2: true;
    heavylabel1: true;
    label2: true;
    b1: true;
    heavyb1: true;
    label1: true;
    heavyb2: true;
  }
}
