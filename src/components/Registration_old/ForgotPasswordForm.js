import {
  Box,
  Button,
  Container,
  Grid,
  TextField,
  Typography,
} from '@mui/material';
import { useState } from 'react';
import axiosClient from '../../libs/axios/axiosClient';
import { useLocation, useNavigate } from 'react-router-dom';
import { AxiosError } from 'axios';

const ForgotPasswordForm = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { state } = location;

  const [phone, setPhone] = useState(state.phone || '');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState();
  const [errors, setErrors] = useState({
    password: '',
    confirmPassword: '',
  });

  const handleUpdate = async (event) => {
    event.preventDefault();

    let validationErrors = {
      password: '',
      confirmPassword: '',
    };

    if (!password) {
      validationErrors.password = 'Password is required';
    }

    if (password !== confirmPassword) {
      validationErrors.confirmPassword = 'Passwords do not match';
    }

    if (Object.values(validationErrors).some((error) => error)) {
      setErrors(validationErrors);
    } else {
      setErrors({
        password: '',
        confirmPassword: '',
      });
    }

    try {
      const response = await axiosClient.patch('admin-user/update-password', {
        phoneNumber: phone,
        password,
      });
      if (response.status === 200 || response.status === 201) {
        setMessage(response.data.message);
      }
    } catch (error) {
      if (error instanceof AxiosError) {
        setErrors({
          password: '',
          confirmPassword: error?.response?.data?.message,
        });
      } else {
        setErrors({
          password: '',
          confirmPassword: 'Failed to update password, please try again later',
        });
      }
      console.error('Error updating password:', error);
    }
  };

  return (
    <Container>
      <form onSubmit={handleUpdate}>
        <Grid container direction="row" alignItems="center">
          <Grid item xs={2}>
            <Typography variant="b1">New Password*</Typography>
          </Grid>
          <Grid item xs={10}>
            <TextField
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              fullWidth
              margin="normal"
              error={!!errors.password}
              helperText={errors.password}
              required
            />
          </Grid>
          <Grid item xs={2}>
            <Typography variant="b1">Confirm New Password*</Typography>
          </Grid>
          <Grid item xs={10}>
            <TextField
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm your password"
              fullWidth
              margin="normal"
              error={!!errors.confirmPassword}
              helperText={errors.confirmPassword}
              required
            />
          </Grid>
          <Grid item xs={2}>
            <Typography color="success.main">{message}</Typography>
          </Grid>
          <Grid container item xs={10} justifyContent={'space-between'}>
            <Button
              sx={{ width: '200px', marginTop: '5px' }}
              type="submit"
              variant="contained"
              color="primary"
            >
              Update Password
            </Button>
            <Button
              variant="text"
              color="primary"
              onClick={() => navigate('/login')}
            >
              Continue
            </Button>
          </Grid>
        </Grid>
      </form>
    </Container>
  );
};

export default ForgotPasswordForm;
