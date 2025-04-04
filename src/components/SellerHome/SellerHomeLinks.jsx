import { Box, Button, Stack, Typography, useTheme } from '@mui/material';
import React from 'react';
import ListAltIcon from '@mui/icons-material/ListAlt';
import StoreIcon from '@mui/icons-material/Store';
import EditIcon from '@mui/icons-material/Edit';
import SettingsIcon from '@mui/icons-material/Settings';
import CurrencyRupeeIcon from '@mui/icons-material/CurrencyRupee';
import { useNavigate } from 'react-router-dom';

function SellerHomeLinks() {
  const theme = useTheme();
  const navigate = useNavigate();

  return (
    <Stack
      direction="row"
      sx={{ display: 'flex', justifyContent: 'space-between' }}
    >
      <Button
        onClick={() => {
          navigate('/seller/orders');
        }}
      >
        <Stack
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <ListAltIcon fontSize="small" sx={{ color: 'grey.800' }} />
          <Typography variant="button2" sx={{ color: 'grey.800' }}>
            Orders
          </Typography>
        </Stack>
      </Button>
      <Button
        onClick={() => {
          navigate('/seller/customize');
        }}
      >
        <Stack
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <StoreIcon fontSize="small" sx={{ color: 'grey.800' }} />
            <EditIcon
              sx={{
                color: theme.palette.grey[800],
                fontSize: '14px',
              }}
            />
          </Box>
          <Typography variant="button2" sx={{ color: 'grey.800' }}>
            Customize
          </Typography>
        </Stack>
      </Button>
      <Button
        onClick={() => {
          navigate('/seller/settings');
        }}
      >
        <Stack
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <SettingsIcon fontSize="small" sx={{ color: 'grey.800' }} />
          <Typography variant="button2" sx={{ color: 'grey.800' }}>
            Settings
          </Typography>
        </Stack>
      </Button>
      <Button
        onClick={() => {
          navigate('/seller/payment-settings');
        }}
      >
        <Stack
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <CurrencyRupeeIcon fontSize="small" sx={{ color: 'grey.800' }} />
          <Typography variant="button2" sx={{ color: 'grey.800' }}>
            UPI
          </Typography>
        </Stack>
      </Button>
    </Stack>
  );
}

export default SellerHomeLinks;
