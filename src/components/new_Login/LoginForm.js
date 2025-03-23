import React from 'react';
import {
  Button,
  InputAdornment,
  Stack,
  TextField,
  Typography,
  useTheme,
} from '@mui/material';
import { useState } from 'react';
import axiosClient from '../../libs/axios/axiosClient';
import LoadingButton from '../common/LoadingButton';
import ServiceErrorAlert from '../common/Alerts/ServiceErrorAlert';
import LoginUserAccountErrorAlert from '../common/Alerts/LoginUserAccountErrorAlert';
import { ResponseStatus } from '../../utils/ResponseStatus';
import { ErrorCode } from '../../utils/ErrorCodes';
import { Link as RouterLink } from 'react-router-dom';
import StyledTextField from '../common/styled/StyledTextField';

function LoginForm({ setSentOTP, setPhone }) {
  const theme = useTheme();
  const [phoneError, setPhoneError] = useState('');
  const [serviceError, setServiceError] = useState(false);
  const [userAccountError, setUserAccountError] = useState(false);
  const [sendingOTP, setSendingOTP] = useState(false);

  const isValidPhone = (phone) => {
    const phoneRegex = /^[0-9]{10}$/;
    return phoneRegex.test(phone);
  };

  function resetErrors() {
    setServiceError(false);
    setUserAccountError(false);
    setPhoneError('');
  }

  function handleOTPError(errorCode) {
    if (errorCode === ErrorCode.UNREGISTERED_NUMBER) setUserAccountError(true);
    else setServiceError(true);
  }

  const handleSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const phone = formData.get('phone');
    if (isValidPhone(phone)) {
      try {
        setPhone(phone);
        setSendingOTP(true);
        resetErrors();
        const response = await axiosClient.post('otp/send-otp-login', {
          phoneNumber: phone,
        });
        if (response.data.status === ResponseStatus.SUCCESS) {
          setSentOTP(true);
        } else {
          handleOTPError(response.data.errorCode);
        }
      } catch (error) {
        console.log(error);
        handleOTPError(error.response?.data.errorCode);
      } finally {
        setSendingOTP(false);
      }
    } else {
      setPhoneError('Enter a valid phone number');
    }
  };

  return (
    <>
      <Stack
        component="form"
        spacing={3}
        sx={{ width: '100%', display: 'flex', alignItems: 'center' }}
        onSubmit={handleSubmit}
        noValidate
      >
        <Typography
          color="textSecondary"
          variant="heavyb2"
          sx={{
            textAlign: 'center',
          }}
        >
          Enter your registered Whatsapp number
        </Typography>
        <Stack spacing={2} sx={{ width: '100%' }}>
          <StyledTextField
            id="phone"
            name="phone"
            variant="outlined"
            type="number"
            label="Whatsapp Number"
            fullWidth
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">+91</InputAdornment>
              ),
            }}
            helperText={phoneError}
            error={phoneError !== '' ? true : false}
          />
          {serviceError && <ServiceErrorAlert />}
          {userAccountError && <LoginUserAccountErrorAlert />}
          <LoadingButton
            loading={sendingOTP && !serviceError}
            variant="contained"
            type="submit"
            buttonStyles={{
              backgroundColor: 'primary.main',
              borderRadius: '25px',
              height: '50px',
            }}
            label="Sign in"
            labelStyles={{
              color: 'white',
            }}
            labelVariant="button1"
            progressSize={24}
            progressThickness={5}
            progressStyles={{
              color: 'white',
            }}
          />
        </Stack>
      </Stack>
      <Stack sx={{ width: '100%' }} spacing={2}>
        <Typography
          variant="heavyb2"
          color="textSecondary"
          sx={{
            textAlign: 'center',
          }}
        >
          Don't have an account yet? Sign up now
        </Typography>
        <Button
          sx={{
            backgroundColor: 'hsl(130, 70%, 40%)',
            height: '50px',
          }}
          variant="contained"
          size="large"
          fullWidth
          component={RouterLink}
          to={'/signup'}
          type="button"
        >
          <Typography
            sx={{
              textTransform: 'none',
            }}
            variant="button1"
          >
            Create new account
          </Typography>
        </Button>
      </Stack>
    </>
  );
}

export default LoginForm;
