import React from 'react';
import {
  Box,
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
  const [phoneNum, setPhoneNum] = useState(''); // for accessing phone number here
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
        setPhoneNum(phone); //for accessing phone number in current page
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
        gap={3}
        sx={{ width: '100%', display: 'flex', alignItems: 'center' }}
        onSubmit={handleSubmit}
        noValidate
      >
        <Typography
          variant="h5"
          sx={{
            color: theme.palette.grey[900],
          }}
        >
          Log In
        </Typography>
        <Box sx={{ textAlign: 'center' }}>
          <Typography
            variant="b1"
            sx={{ color: theme.palette.grey[700], textAlign: 'center' }}
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
            helperText={phoneError}
            error={phoneError !== '' ? true : false}
            sx={{
              mt: 1.5,
            }}
          />
        </Box>
        {serviceError && <ServiceErrorAlert />}
        {userAccountError && <LoginUserAccountErrorAlert phone={phoneNum} />}
        <LoadingButton
          loading={sendingOTP && !serviceError}
          // loading={true}
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
        <Stack gap={2} sx={{ mt: 2 }}>
          <Typography
            variant="b1"
            sx={{ color: theme.palette.grey[700], textAlign: 'center' }}
          >
            Don't have an account yet? Sign up now
          </Typography>
          <Button
            sx={{
              backgroundColor: 'secondary.main',
              '&:hover, &:focus, &:active': {
                backgroundColor: 'secondary.main',
              },
              height: '55px',
              borderRadius: '25px',
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
                color: 'grey.800',
              }}
              variant="button1"
            >
              Create new account
            </Typography>
          </Button>
        </Stack>
      </Stack>
    </>
  );
}

export default LoginForm;
