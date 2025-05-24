import { Box, Card, Grid, useMediaQuery, useTheme } from '@mui/material';
import Logo from '/logos/zottr_logo_large.svg';
import LoginForm from './LoginForm';
import LoginOTPVerification from './LoginOTPVerification';
import { useState } from 'react';

function WelcomePage() {
  const theme = useTheme();
  const [sentOTP, setSentOTP] = useState(false);
  const [phone, setPhone] = useState('');
  return (
    <>
      <Grid
        container
        spacing={0}
        justifyContent="center"
        sx={{ marginTop: '30px' }}
      >
        <Grid
          item
          xs={12}
          display="flex"
          justifyContent="center"
          alignItems="center"
        >
          <Card
            elevation={useMediaQuery(theme.breakpoints.down('sm')) ? 0 : 2}
            sx={{
              py: 2,
              px: 3,
              zIndex: 1,
              width: '100%',
              maxWidth: '500px',
            }}
          >
            <Box
              display="flex"
              alignItems="center"
              justifyContent="center"
              sx={{ mb: 3 }}
            >
              <img src={Logo} alt="zottr logo" height="45px" />
            </Box>
            {!sentOTP && (
              <LoginForm setSentOTP={setSentOTP} setPhone={setPhone} />
            )}
            {sentOTP && (
              <LoginOTPVerification phone={phone} setSentOTP={setSentOTP} />
            )}
          </Card>
        </Grid>
      </Grid>
    </>
  );
}

export default WelcomePage;
