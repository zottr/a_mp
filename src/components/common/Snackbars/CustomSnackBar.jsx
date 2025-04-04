import { Alert, Paper, Snackbar, Typography } from '@mui/material';
import React from 'react';

function CustomSnackBar({
  message,
  severity, //error,info,success,warning
  color = 'success',
  duration,
  vertical,
  horizontal,
  open,
  handleClose,
}) {
  return (
    <Snackbar
      autoHideDuration={duration}
      open={open}
      onClose={() => {
        handleClose(false);
      }}
      anchorOrigin={{ vertical: vertical, horizontal: horizontal }}
    >
      <Paper>
        <Alert
          variant="filled"
          severity={severity}
          color={color}
          sx={{
            '& .MuiAlert-icon': { fontSize: '24px' },
          }}
        >
          <Typography variant="heavylabel1">{message}</Typography>
        </Alert>
      </Paper>
    </Snackbar>
  );
}

export default CustomSnackBar;
