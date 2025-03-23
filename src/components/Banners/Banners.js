import { Box, Fab, Typography } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import React from 'react';

function Banners() {
  return (
    <Box sx={{ mb: 5 }}>
      <Fab
        variant="extended"
        color="secondary"
        aria-label="add new product"
        onClick={false} // Open the dialog on click
        sx={{
          position: 'fixed',
          bottom: '20px',
          right: '20px',
          height: '50px',
        }}
      >
        <AddIcon sx={{ fontSize: '28px' }} />
        <Typography
          variant="button1"
          sx={{
            textTransform: 'none',
          }}
        >
          Add Banner
        </Typography>
      </Fab>
    </Box>
  );
}

export default Banners;
