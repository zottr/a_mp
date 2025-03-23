import { CircularProgress, Stack, Typography } from '@mui/material';
import React from 'react';

function LoadingCircle({ message }) {
  return (
    <Stack
      gap={2}
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <CircularProgress size={40} thickness={4} />
      <Typography variant="b2">{message}</Typography>
    </Stack>
  );
}

export default LoadingCircle;
