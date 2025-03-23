import { Box, Card, Grid, Stack, useMediaQuery, useTheme } from '@mui/material';
import Logo from './logo_large.png';
import SignUpLandingPage from './SignUpLandingPage';
import SignUpOTPVerification from './SignUpOTPVerification';
import SignUpForm from './forms/SignUpForm';
import { useState } from 'react';
import SignUpDetails from './SignUpDetails';
import SignUpSuccess from './SignUpSuccess';

function SignUpHome() {
  const theme = useTheme();
  const [sentOTP, setSentOTP] = useState(false);
  const [verifiedOTP, setVerifiedOTP] = useState(false);
  const [sellerRegistered, setSellerRegistered] = useState(false);
  const [phone, setPhone] = useState('');
  const elevation = useMediaQuery(theme.breakpoints.down('sm')) ? 0 : 2;
  return (
    <>
      {!sellerRegistered && (
        <Grid container sx={{ marginTop: '30px' }}>
          <Grid
            item
            xs={12}
            sm={12}
            lg={4}
            xl={3}
            display="flex"
            justifyContent="center"
          >
            <Card
              elevation={elevation}
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
                mb={5}
              >
                <img src={Logo} alt="marketplace logo" height="40px" />
              </Box>
              {!sentOTP && !verifiedOTP && (
                <SignUpLandingPage
                  setSentOTP={setSentOTP}
                  setPhone={setPhone}
                  phone={phone}
                />
              )}
              {sentOTP && !verifiedOTP && (
                <SignUpOTPVerification
                  phone={phone}
                  setSentOTP={setSentOTP}
                  setVerifiedOTP={setVerifiedOTP}
                />
              )}
              {verifiedOTP && (
                <SignUpDetails
                  phone={phone}
                  setSellerRegistered={setSellerRegistered}
                />
              )}
            </Card>
          </Grid>
        </Grid>
      )}
      {sellerRegistered && <SignUpSuccess />}
    </>
  );
}

export default SignUpHome;
