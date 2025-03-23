import {
  Box,
  Button,
  Grid,
  LinearProgress,
  Stack,
  Typography,
  useTheme,
} from '@mui/material';
import { useEffect, useState } from 'react';
import OtpInput from 'react-otp-input';
import axiosClient from '../../libs/axios/axiosClient';
import LoadingButton from '../common/LoadingButton';
import { AUTHENTICATE_ADMIN_VIA_OTP } from '../../libs/graphql/definitions/auth-definitions';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ServiceErrorAlert from '../common/Alerts/ServiceErrorAlert';
import OTPInvalidErrorAlert from '../common/Alerts/OTPInvalidErrorAlert';
import { useMutation } from '@apollo/client';
import { useNavigate } from 'react-router-dom';

function LoginOTPVerification({ phone, setSentOTP }) {
  const theme = useTheme();
  const navigate = useNavigate();
  const [networkError, setNetworkError] = useState(false);
  const [otpVerificationError, setOtpVerificationError] = useState(false);
  const [resendingOTP, setResendingOTP] = useState(false);
  const [verifyingOTP, setVerifyingOTP] = useState(false);
  const [resentOTP, setResentOTP] = useState(false);
  const [otp, setOTP] = useState('');
  const [authenticateAdmin] = useMutation(AUTHENTICATE_ADMIN_VIA_OTP);

  const resendOTP = async () => {
    try {
      setOTP('');
      setResendingOTP(true);
      setResentOTP(false);
      setNetworkError(false);
      setOtpVerificationError(false);
      await axiosClient.post('otp/send-otp-login', { phoneNumber: phone });
      setResentOTP(true);
    } catch (error) {
      setNetworkError(true);
      console.log(error);
    } finally {
      setResendingOTP(false);
    }
  };

  useEffect(() => {
    const verifyOTP = async () => {
      try {
        setVerifyingOTP(true);
        setNetworkError(false);
        setOtpVerificationError(false);

        const result = await authenticateAdmin({
          variables: {
            phoneNumber: phone,
            otp: otp,
          },
        });
        console.log(result);
        switch (result.data.authenticate.__typename) {
          case 'CurrentUser':
            // handle success
            //onLogin();
            navigate('/home');
            break;
          case 'InvalidCredentialsError':
          case 'NativeAuthStrategyError':
          default:
            setOtpVerificationError(true);
        }
      } catch (error) {
        setNetworkError(true);
        console.log(error);
      } finally {
        setVerifyingOTP(false);
      }
    };
    if (otp.length === 6) {
      verifyOTP();
    }
  }, [otp, phone, authenticateAdmin]);

  return (
    <>
      <Grid container>
        <Grid item xs={12}>
          <Stack
            sx={{
              width: '100%',
              display: 'flex',
              justifyContent: 'flex-start',
              alignItems: 'center',
            }}
          >
            <Typography variant="h5">Enter verification code</Typography>
            <Typography
              variant="b2"
              align="center"
              color={theme.palette.grey[600]}
            >
              received on Whatsapp +91{phone}
            </Typography>
            <Box sx={{ marginTop: '30px' }}>
              <OtpInput
                value={otp}
                onChange={setOTP}
                numInputs={6}
                // renderSeparator={<span> - </span>}
                renderInput={(props) => <input {...props} />}
                inputStyle={{
                  width: '45px',
                  height: '45px',
                  margin: '5px',
                  fontSize: '32px',
                  borderRadius: '5px',
                  border: '1px solid rgba(0,0,0,0.5)',
                  // borderWidth: '0 0 3px 0',
                }}
                shouldAutoFocus
              />
              {verifyingOTP && (
                <Box sx={{ marginTop: '20px' }}>
                  <LinearProgress color="info" />
                </Box>
              )}
            </Box>
            {otpVerificationError && !verifyingOTP && (
              <Box sx={{ marginTop: '20px' }}>
                <OTPInvalidErrorAlert />
              </Box>
            )}
            <Stack
              sx={{
                width: '100%',
                marginTop: '40px',
              }}
            >
              <Typography color={theme.palette.grey[600]} variant="b1">
                Did not receive a verification code ?
              </Typography>
              <Stack
                direction="row"
                sx={{
                  marginTop: '10px',
                  width: '100%',
                }}
              >
                <Box
                  sx={{
                    width: '50%',
                    display: 'flex',
                    justifyContent: 'flex-end',
                  }}
                >
                  <LoadingButton
                    loading={resendingOTP && !networkError}
                    variant="contained"
                    size="large"
                    type="button"
                    buttonStyles={{
                      backgroundColor: 'primary.main',
                      height: '40px',
                    }}
                    label="Resend code"
                    labelStyles={{
                      color: 'white',
                    }}
                    labelVariant="button1"
                    progressSize={24}
                    progressThickness={4}
                    progressStyles={{
                      color: 'white',
                    }}
                    onClick={resendOTP}
                  />
                </Box>
                <Stack
                  direction="row"
                  sx={{
                    width: '50%',
                    display: 'flex',
                    justifyContent: 'flex-end',
                    alignItems: 'center',
                  }}
                >
                  <ArrowBackIosIcon
                    sx={{ fontSize: '14px', marginRight: '-9px' }}
                  />
                  <Button
                    onClick={() => {
                      setSentOTP(false); //back to welcome screen
                    }}
                  >
                    <Typography
                      color={theme.palette.common.black}
                      sx={{
                        textTransform: 'none',
                      }}
                      variant="button2"
                    >
                      Change number
                    </Typography>
                  </Button>
                </Stack>
              </Stack>
              <Box
                sx={{
                  marginTop: '10px',
                  width: '100%',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                {networkError && <ServiceErrorAlert />}
                {resentOTP && !resendingOTP && (
                  <Typography
                    color={theme.palette.success.dark}
                    fontFamily="Poppins"
                    fontWeight="500"
                    fontSize="14px"
                  >
                    &#10004; OTP resent successfully
                  </Typography>
                )}
              </Box>
            </Stack>
          </Stack>
        </Grid>
      </Grid>
    </>
  );
}

export default LoginOTPVerification;
