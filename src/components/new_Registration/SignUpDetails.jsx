import {
  Box,
  InputAdornment,
  Stack,
  TextField,
  Typography,
  useTheme,
} from '@mui/material';
import { useState } from 'react';
import LoadingButton from '../common/LoadingButton';
import axiosClient from '../../libs/axios/axiosClient';
import { ResponseStatus } from '../../utils/ResponseStatus';
import ServiceErrorAlert from '../common/Alerts/ServiceErrorAlert';

function SignUpDetails({ phone, setSellerRegistered }) {
  const theme = useTheme();

  //error states
  const [nameError, setNameError] = useState(false);
  const [businessNameError, setBusinessNameError] = useState(false);
  const [addressError, setAdddressError] = useState(false);
  const [serviceError, setServiceError] = useState(false);

  function resetErrorStates() {
    setNameError(false);
    setBusinessNameError(false);
    setAdddressError(false);
    setServiceError(false);
  }

  function isValidFormData(name, businessName, address) {
    return name !== '' && businessName !== '' && address !== '';
  }

  function applyErrorStates(name, businessName, address) {
    if (name === '') setNameError(true);
    if (businessName === '') setBusinessNameError(true);
    if (address === '') setAdddressError(true);
  }

  const handleSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const name = formData.get('seller-name');
    const businessName = formData.get('business-name');
    const address = formData.get('business-address');
    resetErrorStates();
    if (isValidFormData(name, businessName, address)) {
      setSellerRegistered(true);
      try {
        const response = await axiosClient.post('mpregistration/mpseller', {
          sellerName: name,
          businessName: businessName,
          phoneNumber: phone,
        });
        if (response.data.status === ResponseStatus.SUCCESS)
          setSellerRegistered(true);
        else {
          //ideally axios will throw an exception if nest returns a response with an error
          //code, but I call the error handling code here again just for safety if axios
          //doesn't throw an error for some cases
          handleRegistrationError();
        }
      } catch (error) {
        handleRegistrationError();
      }
    } else {
      applyErrorStates(name, businessName, address);
    }
  };

  const handleRegistrationError = () => {
    setServiceError(true);
  };

  return (
    <Box
      sx={{
        animation: 'slideInFromRight 0.2s ease-out', // Applying the animation
      }}
    >
      <Stack
        gap={3}
        noValidate
        sx={{
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
          Enter your details
        </Typography>
        <Stack
          component="form"
          onSubmit={handleSubmit}
          gap={3}
          sx={{ width: '100%' }}
        >
          <Box>
            <Typography variant="b1" sx={{ color: theme.palette.grey[800] }}>
              Your name
            </Typography>
            <TextField
              id="seller-name"
              name="seller-name"
              variant="outlined"
              type="text"
              label="Seller Name"
              fullWidth
              // InputProps={{
              //   startAdornment: (
              //     <InputAdornment position="start">+91</InputAdornment>
              //   ),
              // }}
              helperText={nameError && 'Enter a valid name'}
              error={nameError}
              sx={{
                mt: 1,
                '& .MuiInputLabel-root.Mui-error': {
                  color: theme.palette.error.main,
                },
                '& .MuiOutlinedInput-root.Mui-error .MuiOutlinedInput-notchedOutline':
                  {
                    borderWidth: '1.5px',
                    borderStyle: 'solid',
                  },
                '& .MuiFormHelperText-root.Mui-error': {
                  color: theme.palette.error.main,
                  fontSize: '0.875rem',
                  fontWeight: 400,
                  lineHeight: 1.43,
                  letterSpacing: '0.01071em',
                  fontStyle: 'normal',
                },
              }}
            />
          </Box>
          <Box>
            <Typography variant="b1" sx={{ color: theme.palette.grey[800] }}>
              Name of your business
            </Typography>
            <TextField
              id="business-name"
              name="business-name"
              variant="outlined"
              type="text"
              label="Business Name"
              fullWidth
              // InputProps={{
              //   startAdornment: (
              //     <InputAdornment position="start">+91</InputAdornment>
              //   ),
              // }}
              helperText={businessNameError && 'Enter a valid business name'}
              error={businessNameError}
              sx={{
                mt: 1,
                '& .MuiInputLabel-root.Mui-error': {
                  color: theme.palette.error.main,
                },
                '& .MuiOutlinedInput-root.Mui-error .MuiOutlinedInput-notchedOutline':
                  {
                    borderWidth: '1.5px',
                    borderStyle: 'solid',
                  },
                '& .MuiFormHelperText-root.Mui-error': {
                  color: theme.palette.error.main,
                  fontSize: '0.875rem',
                  fontWeight: 400,
                  lineHeight: 1.43,
                  letterSpacing: '0.01071em',
                  fontStyle: 'normal',
                },
              }}
            />
          </Box>
          <Box>
            <Typography variant="b1" sx={{ color: theme.palette.grey[800] }}>
              Where is your business located ?
            </Typography>
            <TextField
              id="business-address"
              name="business-address"
              variant="outlined"
              type="text"
              label="Business Address"
              fullWidth
              // InputProps={{
              //   startAdornment: (
              //     <InputAdornment position="start">+91</InputAdornment>
              //   ),
              // }}
              helperText={addressError && 'Enter a valid business address'}
              error={addressError}
              sx={{
                mt: 1,
                '& .MuiInputLabel-root.Mui-error': {
                  color: theme.palette.error.main,
                },
                '& .MuiOutlinedInput-root.Mui-error .MuiOutlinedInput-notchedOutline':
                  {
                    borderWidth: '1.5px',
                    borderStyle: 'solid',
                  },
                '& .MuiFormHelperText-root.Mui-error': {
                  color: theme.palette.error.main,
                  fontSize: '0.875rem',
                  fontWeight: 400,
                  lineHeight: 1.43,
                  letterSpacing: '0.01071em',
                  fontStyle: 'normal',
                },
              }}
            />
          </Box>
          <LoadingButton
            loading={false}
            variant="contained"
            type="submit"
            buttonStyles={{
              backgroundColor: 'primary.dark',
              borderRadius: '10px',
            }}
            buttonContainerStyles={{
              mt: 1,
              width: '100%',
              height: '55px',
            }}
            label="Create Seller Account"
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
          {serviceError && <ServiceErrorAlert />}
        </Stack>
      </Stack>
    </Box>
  );
}

export default SignUpDetails;
