import { Button, Container, Stack, Typography, useTheme } from '@mui/material';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { CheckCircle } from '@mui/icons-material'; // CheckCircleIcon from MUI
import { motion } from 'framer-motion'; // Import framer-motion
import { AUTHENTICATE_ADMIN_VIA_OTP } from '../../libs/graphql/definitions/auth-definitions';
import { useMutation } from '@apollo/client';
import ServiceErrorAlert from '../common/Alerts/ServiceErrorAlert';
import { useState } from 'react';

function SignUpSuccess({ phone, otp }) {
  const theme = useTheme();
  const navigate = useNavigate();
  const [authenticateAdmin] = useMutation(AUTHENTICATE_ADMIN_VIA_OTP);

  const loginAndNavigateToHome = async () => {
    try {
      const result = await authenticateAdmin({
        variables: {
          phoneNumber: phone,
          otp: otp,
        },
      });
      switch (result.data.authenticate.__typename) {
        case 'CurrentUser':
          navigate('/home');
          break;
        case 'InvalidCredentialsError':
        case 'NativeAuthStrategyError':
        default:
          navigate('/login');
      }
    } catch (error) {
      console.log(error);
      navigate('/login');
    }
  };

  return (
    <Container
      sx={{
        px: 5,
        mt: '100px',
        animation: 'slideInFromRight 0.2s ease-out', // Applying the animation
      }}
    >
      <Stack className="flexCenter" gap={5}>
        <Stack gap={1} className="flexCenter">
          {/* Animated CheckCircle Icon */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{
              duration: 0.8,
              ease: 'easeOut',
              // Adding a bounce effect after scaling
              scale: {
                type: 'spring',
                stiffness: 300,
                damping: 8,
                restDelta: 0.001, // To make it settle completely
              },
            }}
          >
            <CheckCircle
              sx={{ fontSize: '120px', color: theme.palette.success.main }}
            />
          </motion.div>
          <Typography
            variant="h5"
            color="success.light"
            sx={{ fontWeight: '500' }}
          >
            Congratulations
          </Typography>
        </Stack>
        <Typography
          variant="heavyb1"
          sx={{
            textAlign: 'center',
            color: theme.palette.grey[600],
          }}
        >
          Your seller account has been created successfully!
        </Typography>
        <Button
          onClick={loginAndNavigateToHome}
          variant="contained"
          sx={{ width: '100%', height: '50px', borderRadius: '25px' }}
        >
          <Typography variant="button1">Go To Dashboard</Typography>
        </Button>
      </Stack>
    </Container>
  );
}

export default SignUpSuccess;
