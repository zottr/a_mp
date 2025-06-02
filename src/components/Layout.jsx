import React from 'react';
import { Box, useMediaQuery, useTheme } from '@mui/material';
import MainAppBar from './common/MainAppBar';

const Layout = ({ children }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  return (
    <Box
      sx={{
        width: '100%',
        minHeight: '100vh',
        bgcolor: isMobile ? 'white' : 'primary.surface',
        display: 'flex',
        justifyContent: 'center',
      }}
    >
      <Box
        sx={{
          width: '100%',
          maxWidth: 600, // adjust to your target mobile width
          minHeight: '100vh',
          overflowX: 'hidden',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {/* Uncomment if you want the top bar */}
        {/* <MainAppBar /> */}

        <main style={{ flex: 1 }}>{children}</main>

        {/* Uncomment if you have a footer */}
        {/* <Footer /> */}
      </Box>
    </Box>
  );
};

export default Layout;
