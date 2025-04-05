import React from 'react';
import {
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  FormGroup,
  InputAdornment,
  Link,
  Stack,
  Typography,
  useTheme,
} from '@mui/material';
import { useState } from 'react';
import axiosClient from '../../libs/axios/axiosClient';
import LoadingButton from '../common/LoadingButton';
import ServiceErrorAlert from '../common/Alerts/ServiceErrorAlert';
import SignUpUserAccountErrorAlert from '../common/Alerts/SignUpUserAccountErrorAlert';
import { ErrorCode } from '../../utils/ErrorCodes';
import { ResponseStatus } from '../../utils/ResponseStatus';
import StyledTextField from '../common/styled/StyledTextField';
import { Link as RouterLink } from 'react-router-dom';

function SignUpLandingPage({ setSentOTP, setPhone, phone }) {
  const theme = useTheme();
  const [sendingOTP, setSendingOTP] = useState(false);

  //error states
  const [phoneError, setPhoneError] = useState(false);
  const [serviceError, setServiceError] = useState(false);
  const [userAccountError, setUserAccountError] = useState(false);

  const isValidPhone = (phone) => {
    const phoneRegex = /^[0-9]{10}$/;
    return phoneRegex.test(phone);
  };

  function resetErrorStates() {
    setServiceError(false);
    setUserAccountError(false);
    setPhoneError(false);
  }

  const handleSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const phone = formData.get('phone');
    resetErrorStates();

    if (isValidPhone(phone)) {
      try {
        setPhone(phone);
        setSendingOTP(true);
        //send OTP
        const response = await axiosClient.post('otp/send-otp-signup', {
          phoneNumber: phone,
        });
        if (response.data.status === ResponseStatus.SUCCESS) {
          setSentOTP(true);
        } else {
          //ideally axios will throw an exception if nest returns a response with an error
          //code, but I call the error handling code here again just for safety if axios
          //doesn't throw an error for some cases
          handleOTPError(response.data.errorCode);
        }
      } catch (error) {
        handleOTPError(error.response?.data.errorCode);
      } finally {
        setSendingOTP(false);
      }
    } else {
      setPhoneError(true);
    }
  };

  const handleOTPError = (errorCode) => {
    if (errorCode === ErrorCode.NUMBER_ALREADY_REGISTERED) {
      setUserAccountError(true);
    } else {
      setServiceError(true);
    }
  };

  return (
    <Stack
      component="form"
      gap={3}
      onSubmit={handleSubmit}
      noValidate
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
      <Box sx={{ textAlign: 'center' }}>
        <Typography
          variant="b1"
          sx={{ color: theme.palette.grey[800], textAlign: 'center' }}
        >
          Enter your Whatsapp phone number
        </Typography>
        <StyledTextField
          id="phone"
          name="phone"
          variant="outlined"
          type="number"
          // label="Whatsapp Number"
          fullWidth
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">+91</InputAdornment>
            ),
          }}
          helperText={phoneError && 'Enter a valid phone number'}
          error={phoneError}
          sx={{
            mt: 1.5,
          }}
        />
      </Box>
      <Stack direction="row" sx={{ display: 'flex', alignItems: 'flex-start' }}>
        <Checkbox
          defaultChecked
          disabled
          checked
          sx={{
            '&.Mui-checked': {
              color: (theme) => theme.palette.primary.main, // Use primary color when checked
            },
            '&.Mui-checked.Mui-disabled': {
              color: (theme) => theme.palette.primary.main, // Use primary color even when disabled
            },
          }}
        />
        <Typography variant="b2" sx={{ color: theme.palette.grey[700] }}>
          By signing up, you agree to our{' '}
          <Link href="#" underline="none">
            Terms & Conditions
          </Link>{' '}
          and{' '}
          <Link href="#" underline="none">
            Privacy Policy
          </Link>
        </Typography>
      </Stack>
      {serviceError && <ServiceErrorAlert />}
      {userAccountError && <SignUpUserAccountErrorAlert phone={phone} />}
      <LoadingButton
        loading={sendingOTP && !serviceError}
        variant="contained"
        type="submit"
        buttonStyles={{
          backgroundColor: 'primary.main',
          borderRadius: '25px',
        }}
        buttonContainerStyles={{
          width: '100%',
          height: '55px',
        }}
        label="Next"
        labelStyles={{
          color: 'white',
        }}
        loadingLabel="Sending otp..."
        loadingLabelStyles={{
          color: 'grey.100',
        }}
        labelVariant="button1"
        progressSize={24}
        progressThickness={5}
        progressStyles={{
          color: 'grey.100',
        }}
      />
      <Typography
        variant="b1"
        sx={{ color: theme.palette.grey[800], textAlign: 'center' }}
      >
        Already have an account?{' '}
        <Link component={RouterLink} to="/login" underline="none">
          <Typography variant="button1">Login</Typography>
        </Link>
      </Typography>
    </Stack>
  );
}

export default SignUpLandingPage;
