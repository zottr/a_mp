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
import EditIcon from '@mui/icons-material/Edit';
import SuccessAlert from '../common/Alerts/SuccessAlert';
import CustomSnackBar from '../common/Snackbars/CustomSnackBar';
import OTPExpiredErrorAlert from '../common/Alerts/OTPExpiredErrorAlert';
import { ResponseStatus } from '../../utils/ResponseStatus';

interface LoginOTPVerificationProps {
  phone: any;
  setSentOTP: any;
}

const LoginOTPVerification: React.FC<LoginOTPVerificationProps> = ({
  phone,
  setSentOTP,
}) => {
  const theme = useTheme();
  const navigate = useNavigate();
  const [resendingOTP, setResendingOTP] = useState(false);
  const [verifyingOTP, setVerifyingOTP] = useState(false);
  const [resentOTP, setResentOTP] = useState(false);
  const [otp, setOTP] = useState('');

  //error states
  const [serviceError, setServiceError] = useState(false);
  const [otpInvalidError, setInvalidError] = useState(false);
  const [otpExpiredError, setOtpExpiredError] = useState(false);

  const [authenticateAdmin] = useMutation(AUTHENTICATE_ADMIN_VIA_OTP);

  // countdown states
  const [timer, setTimer] = useState(600); // 10 minutes in seconds
  const [isTimerActive, setIsTimerActive] = useState(true);

  function resetErrorStates() {
    setServiceError(false);
    setInvalidError(false);
    setOtpExpiredError(false);
  }
  const resendOTP = async () => {
    try {
      setOTP('');
      setResendingOTP(true);
      setResentOTP(false);
      resetErrorStates();
      setTimer(600); // Reset the timer

      const response = await axiosClient.post('otp/send-otp-login', {
        phoneNumber: phone,
      });
      if (response.data.status === ResponseStatus.SUCCESS) setResentOTP(true);
      else {
        setServiceError(true);
      }
    } catch (error) {
      setServiceError(true);
      console.error(error);
    } finally {
      setResendingOTP(false);
    }
  };

  useEffect(() => {
    const verifyOTP = async () => {
      try {
        setResentOTP(false);
        setVerifyingOTP(true);
        resetErrorStates();

        const result = await authenticateAdmin({
          variables: {
            phoneNumber: phone,
            otp: otp,
          },
        });
        switch (result.data.authenticate.__typename) {
          case 'CurrentUser':
            // handle success
            //onLogin();
            navigate('/welcome');
            break;
          case 'InvalidCredentialsError':
          case 'NativeAuthStrategyError':
          default:
            setInvalidError(true);
        }
      } catch (error) {
        setServiceError(true);
        console.error(error);
      } finally {
        setVerifyingOTP(false);
      }
    };
    if (otp.length === 6) {
      verifyOTP();
    }
  }, [otp, phone, authenticateAdmin]);

  // Timer countdown logic
  useEffect(() => {
    if (isTimerActive && timer > 0) {
      const timerInterval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);

      return () => clearInterval(timerInterval); // Clear interval on cleanup
    }

    if (timer === 0) {
      resetErrorStates(); //reset so we don't see multiple errors on our page
      setOtpExpiredError(true); // Set OTP expired error when timer reaches 0
      setIsTimerActive(false); // Stop the timer
    }
  }, [isTimerActive, timer]);

  useEffect(() => {
    if (!isTimerActive && resentOTP) {
      setIsTimerActive(true); // Start timer when component is loaded or OTP is resent
    }
  }, [resentOTP, isTimerActive]);

  const formatTime = (timeInSeconds: any) => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = timeInSeconds % 60;
    return `${minutes < 10 ? '0' : ''}${minutes}:${
      seconds < 10 ? '0' : ''
    }${seconds}`;
  };

  return (
    <>
      <Stack
        gap={3}
        sx={{
          width: '100%',
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <Typography
          variant="h5"
          sx={{
            color: theme.palette.grey[900],
          }}
        >
          Log In
        </Typography>
        <Stack sx={{ display: 'flex', alignItems: 'center' }}>
          <Typography variant="h6" sx={{ color: 'grey.800' }}>
            Enter 6-digit verification code
          </Typography>
          <Typography
            variant="b1"
            align="center"
            color={theme.palette.grey[700]}
          >
            received on Whatsapp +91{phone}
          </Typography>
          <Box sx={{ mt: 4 }}>
            <OtpInput
              value={otp}
              onChange={setOTP}
              numInputs={6}
              // renderSeparator={<span> - </span>}
              renderInput={(props) => <input {...props} autoComplete="off" />}
              inputStyle={{
                width: '45px',
                height: '45px',
                margin: '5px',
                fontSize: '1.5rem',
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
          {/* Countdown Timer */}
          <Typography
            sx={{
              marginTop: 2,
              color: theme.palette.warning.dark,
              // Using the default monospaced font so the text doesn't
              // move horizontally with changing timeer digits as mono-
              //-space letters all have same widths
              fontFamily: 'monospace',
            }}
            variant="heavyb1"
          >
            Code expiring in: {formatTime(timer)}
          </Typography>
          {/*error alerts*/}
          {otpInvalidError && !verifyingOTP && (
            <Box sx={{ marginTop: '20px' }}>
              <OTPInvalidErrorAlert />
            </Box>
          )}
          {otpExpiredError && !verifyingOTP && (
            <Box sx={{ marginTop: '20px' }}>
              <OTPExpiredErrorAlert />
            </Box>
          )}
        </Stack>
        <Stack
          sx={{
            width: '100%',
            marginTop: '20px',
          }}
        >
          <Typography color={theme.palette.grey[800]} variant="b1">
            Did not receive a verification code ?
          </Typography>
          <Stack
            direction="row"
            sx={{
              mt: 2,
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <LoadingButton
              loading={resendingOTP && !serviceError}
              variant="contained"
              type="button"
              buttonStyles={{
                backgroundColor: 'primary.light',
              }}
              buttonContainerStyles={{
                width: '50%',
                height: '45px',
              }}
              label="Send code again"
              labelStyles={{
                color: 'white',
              }}
              loadingLabel="Sending..."
              loadingLabelStyles={{
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
            <Button
              onClick={() => {
                setSentOTP(false); //back to login landing page
              }}
            >
              <EditIcon
                sx={{
                  fontSize: '1rem',
                  color: 'grey.600',
                }}
              />
              <Typography
                color="grey.800"
                sx={{
                  ml: 0.2,
                  textTransform: 'none',
                }}
                variant="button2"
              >
                Change number
              </Typography>
            </Button>
          </Stack>
        </Stack>
      </Stack>
      <CustomSnackBar
        message={`Sent verification code`}
        severity="success"
        color="success"
        duration={3000}
        vertical="top"
        horizontal="center"
        open={resentOTP}
        handleClose={() => {
          setResentOTP(false);
        }}
      />
    </>
  );
};

export default LoginOTPVerification;
