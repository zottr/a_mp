// src/components/LoginForm.tsx
import React, { useState } from 'react';
import { TextField, Button, Container, Typography, Box } from '@mui/material';
import { useMutation } from '@apollo/client';
import { ATTEMPT_LOGIN } from '../../libs/graphql/definitions/auth-definitions';
import { useNavigate } from 'react-router-dom';

const LoginFormOld = ({ onLogin }) => {
  const navigate = useNavigate();
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState(null);
  const [loginUser] = useMutation(ATTEMPT_LOGIN);

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const result = await loginUser({
        variables: {
          username: `${phone}@testabc.com`,
          password: password,
          rememberMe: true,
        },
      });
      switch (result.data.login.__typename) {
        case 'CurrentUser':
          // handle success
          onLogin();
          navigate('/home');
          break;
        case 'InvalidCredentialsError':
          setErrorMessage(result.data?.login.message);
          break;
        case 'NativeAuthStrategyError':
        default:
          setErrorMessage('Something went wrong please try again later');
      }
    } catch (err) {
      setErrorMessage('Something went wrong please try again later');
      console.error('User login failed:', err);
    }
  };

  const handleSignUp = () => {
    navigate('/signup-phone-verification');
  };

  const handleForgotPassword = () => {
    navigate('/password-phone-verification');
  };

  return (
    <Container>
      <Typography variant="h4">Login</Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          label="Username"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="Email or mobile number"
          fullWidth
          margin="normal"
        />
        <TextField
          label="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Enter your password"
          fullWidth
          margin="normal"
        />
        {errorMessage && (
          <Typography color="error" variant="b2">
            {errorMessage}
          </Typography>
        )}
        <Box mt={2}>
          <Button type="submit" variant="contained" color="primary" fullWidth>
            Login
          </Button>
        </Box>
        <Box mt={2} display="flex" justifyContent="space-between">
          <Button variant="text" color="primary" onClick={handleSignUp}>
            Sign Up
          </Button>
          <Button variant="text" color="primary" onClick={handleForgotPassword}>
            Forgot Password?
          </Button>
        </Box>
      </form>
    </Container>
  );
};

export default LoginFormOld;
