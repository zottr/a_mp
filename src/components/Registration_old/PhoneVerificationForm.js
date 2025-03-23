// src/components/PhoneVerificationForm.tsx
import React, { useState } from 'react';
import { TextField, Button, Container, Typography, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useVerification } from '../../context/VerificationContext';
import axiosClient from '../../libs/axios/axiosClient';

const PhoneVerificationForm = ({ navigateUrl }) => {
  const navigate = useNavigate();
  const { setVerified } = useVerification();
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);

  const validatePhone = (phone) => {
    const phoneRegex = /^[0-9]{10}$/;
    return phoneRegex.test(phone);
  };

  const handleSendOtp = async () => {
    if (!validatePhone(phoneNumber)) {
      setErrorMessage('Phone number is not valid');
      return;
    } else {
      setErrorMessage(null);
    }

    //verify phone number already registered
    try {
      const response = await axiosClient.post('admin-user/not-exists', {
        phoneNumber: phoneNumber,
      });
      if (response?.data?.status === 0) {
        setErrorMessage(response?.data?.message);
        return;
      }
    } catch (error) {
      setErrorMessage('Something went wrong. Please try again.');
      console.error('Error verifying phone:', error);
      return;
    }

    //send otp via whatsapp
    const phone = '91' + phoneNumber;
    try {
      await axiosClient.post('otp/send-otp', { phoneNumber: phone });
      setIsOtpSent(true);
      setErrorMessage(null);
    } catch (error) {
      setErrorMessage('Failed to send OTP. Please try again.');
      console.error('Error sending OTP:', error);
    }
  };

  const handleVerifyOtp = async () => {
    const phone = '91' + phoneNumber;
    try {
      const response = await axiosClient.post('otp/verify-otp', {
        phoneNumber: phone,
        otp,
      });
      if (response.status === 201) {
        setErrorMessage(null);
        setVerified(true);
        navigate(navigateUrl, { state: { phone: phoneNumber } });
      } else {
        setErrorMessage('Invalid OTP. Please try again.');
      }
    } catch (error) {
      setErrorMessage('Failed to verify OTP. Please try again.');
      console.error('Error verifying OTP:', error);
    }
  };

  const handleLogin = () => {
    navigate('/login');
  };

  return (
    <Container>
      <Typography variant="h4">Phone Verification</Typography>
      <TextField
        label="Phone Number"
        value={phoneNumber}
        onChange={(e) => setPhoneNumber(e.target.value)}
        placeholder="Enter your phone number"
        fullWidth
        margin="normal"
        inputProps={{ readOnly: isOtpSent }}
      />
      {isOtpSent && (
        <TextField
          label="OTP"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          placeholder="Enter OTP"
          fullWidth
          margin="normal"
        />
      )}
      {errorMessage && (
        <Typography color="error" variant="b2">
          {errorMessage}
        </Typography>
      )}
      <Box mt={2} display="flex" justifyContent="space-between">
        {!isOtpSent ? (
          <Button onClick={handleSendOtp} variant="contained" color="primary">
            Send OTP to Whatsapp
          </Button>
        ) : (
          <Button onClick={handleVerifyOtp} variant="contained" color="primary">
            Verify OTP
          </Button>
        )}

        <Button variant="text" color="primary" onClick={handleLogin}>
          Back To Login
        </Button>
      </Box>
    </Container>
  );
};

export default PhoneVerificationForm;
