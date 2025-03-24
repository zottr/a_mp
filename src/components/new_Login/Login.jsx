import { Box, Card, Grid, Stack, useMediaQuery, useTheme } from '@mui/material';
import Logo from './logo.png';
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
          sm={12}
          lg={4}
          xl={3}
          display="flex"
          justifyContent="center"
          alignItems="center"
        >
          <Card
            elevation={useMediaQuery(theme.breakpoints.down('sm')) ? 0 : 2}
            sx={{
              p: 4,
              zIndex: 1,
              width: '100%',
              maxWidth: '500px',
            }}
          >
            <Stack spacing={5} display="flex" alignItems="center">
              <Box display="flex" alignItems="center" justifyContent="center">
                <img src={Logo} alt="marketplace logo" height="80px" />
              </Box>
              {!sentOTP && (
                <LoginForm setSentOTP={setSentOTP} setPhone={setPhone} />
              )}
              {sentOTP && (
                <LoginOTPVerification phone={phone} setSentOTP={setSentOTP} />
              )}
            </Stack>
          </Card>
        </Grid>
      </Grid>
    </>
  );
}

export default WelcomePage;
