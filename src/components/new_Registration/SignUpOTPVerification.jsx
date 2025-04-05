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
import { ATTEMPT_LOGIN } from '../../libs/graphql/definitions/auth-definitions';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ServiceErrorAlert from '../common/Alerts/ServiceErrorAlert';
import SuccessAlert from '../common/Alerts/SuccessAlert';
import OTPInvalidErrorAlert from '../common/Alerts/OTPInvalidErrorAlert';
import { useMutation } from '@apollo/client';
import { ResponseStatus } from '../../utils/ResponseStatus';
import { ErrorCode } from '../../utils/ErrorCodes';
import OTPExpiredErrorAlert from '../common/Alerts/OTPExpiredErrorAlert';
import EditIcon from '@mui/icons-material/Edit';
import CustomSnackBar from '../common/Snackbars/CustomSnackBar';

function SignUpOTPVerification({
  phone,
  setSentOTP,
  setVerifiedOTP,
  setOTPForReg,
}) {
  const theme = useTheme();
  const [resendingOTP, setResendingOTP] = useState(false);
  const [verifyingOTP, setVerifyingOTP] = useState(false);
  const [resentOTP, setResentOTP] = useState(false);
  const [otp, setOTP] = useState('');
  const [login] = useMutation(ATTEMPT_LOGIN);

  //error states
  const [serviceError, setServiceError] = useState(false);
  const [otpInvalidError, setOtpInvalidError] = useState(false);
  const [otpExpiredError, setOtpExpiredError] = useState(false);

  // countdown states
  const [timer, setTimer] = useState(600); // 10 minutes in seconds
  const [isTimerActive, setIsTimerActive] = useState(true);

  function resetErrorStates() {
    setServiceError(false);
    setOtpInvalidError(false);
    setOtpExpiredError(false);
  }

  const setOTPValue = (otp) => {
    setOTP(otp);
    setOTPForReg(otp);
  };

  const resendOTP = async () => {
    try {
      setOTP('');
      setResendingOTP(true);
      setResentOTP(false);
      resetErrorStates();
      setTimer(600); // Reset the timer

      const response = await axiosClient.post('otp/send-otp-signup', {
        phoneNumber: phone,
      });
      console.log(response);
      if (response.data.status === ResponseStatus.SUCCESS) setResentOTP(true);
      else {
        //ideally axios will throw an exception if nest returns a response with an error
        //code, but I call the error handling code here again just for safety if axios
        //doesn't throw an error for some cases
        handleNewOTPError();
      }
    } catch (error) {
      handleNewOTPError();
    } finally {
      setResendingOTP(false);
    }
  };

  const handleNewOTPError = () => {
    setServiceError(true);
  };

  useEffect(() => {
    const verifyOTP = async () => {
      try {
        setResentOTP(false);
        setVerifyingOTP(true);
        resetErrorStates();

        const response = await axiosClient.post('otp/verify-otp', {
          phoneNumber: phone,
          otp,
        });
        if (response.data.status === ResponseStatus.SUCCESS) {
          setVerifiedOTP(true);
        } else {
          //ideally axios will throw an exception if nest returns a response with an error
          //code, but I call the error handling code here again just for safety if axios
          //doesn't throw an error for some cases
          handleOTPVerificationError(response.data.errorCode);
        }
      } catch (error) {
        handleOTPVerificationError(error.response?.data.errorCode);
      } finally {
        setVerifyingOTP(false);
      }
    };

    const handleOTPVerificationError = (errorCode) => {
      switch (errorCode) {
        case ErrorCode.OTP_EXPIRED:
          setOtpExpiredError(true);
          break;
        case ErrorCode.OTP_INVALID:
          setOtpInvalidError(true);
          break;
        default:
          setServiceError(true);
      }
    };

    if (otp.length === 6) {
      verifyOTP();
    }
  }, [otp, phone, setVerifiedOTP]);

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

  const formatTime = (timeInSeconds) => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = timeInSeconds % 60;
    return `${minutes < 10 ? '0' : ''}${minutes}:${
      seconds < 10 ? '0' : ''
    }${seconds}`;
  };

  return (
    <Box>
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
          Create New Account
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
              onChange={setOTPValue}
              numInputs={6}
              renderInput={(props) => <input {...props} />}
              inputStyle={{
                width: '45px',
                height: '45px',
                margin: '5px',
                fontSize: '32px',
                borderRadius: '5px',
                border: '1px solid rgba(0,0,0,0.5)',
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
              size="large"
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

          {/*error alerts*/}
          <Stack
            className="flexCenter"
            sx={{
              marginTop: '25px',
            }}
          >
            {serviceError && <ServiceErrorAlert />}
            {/* {resentOTP && !resendingOTP && (
              <SuccessAlert title="OTP resent successfully" />
            )} */}
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
    </Box>
  );
}

export default SignUpOTPVerification;
