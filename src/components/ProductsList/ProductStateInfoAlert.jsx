import * as React from 'react';
import Snackbar from '@mui/material/Snackbar';
import Grow from '@mui/material/Grow';
import { Box, SnackbarContent, Typography } from '@mui/material';

export default function ProductStateInfoAlert({
  item,
  value,
  open,
  handleClose,
}) {
  let message = '';
  if (value) message = `${item} is now displayed in store`;
  else message = `${item} won't be displayed in store`;
  return (
    <div>
      <Snackbar
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        open={open}
        onClose={handleClose}
        TransitionComponent={Grow}
        sx={{ bottom: '20px' }}
        key={`${item}${value}`}
        autoHideDuration={2000}
      >
        <SnackbarContent
          // style={{ backgroundColor: 'snow' }}
          message={
            <Box sx={{ display: 'flex', justifyContent: 'center' }}>
              <Typography
                variant="b2"
                sx={{
                  textWrap: 'wrap',
                  wordWrap: 'break-word',
                }}
              >
                {message}
              </Typography>
            </Box>
          }
        />
      </Snackbar>
    </div>
  );
}
