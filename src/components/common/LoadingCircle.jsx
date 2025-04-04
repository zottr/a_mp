import { CircularProgress, Stack, Typography } from '@mui/material';
import React from 'react';

function LoadingCircle({
  message,
  textVariant = 'heavylabel1',
  textColor = 'grey.900',
  color = 'primary',
  size = 45,
  thickness = 4,
}) {
  return (
    <Stack
      gap={2}
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <CircularProgress size={size} thickness={thickness} color={color} />
      <Typography
        variant={textVariant}
        color={textColor}
        sx={{ wordBreak: 'break-word', overflowWrap: 'break-word' }}
      >
        {message}
      </Typography>
    </Stack>
  );
}

export default LoadingCircle;
