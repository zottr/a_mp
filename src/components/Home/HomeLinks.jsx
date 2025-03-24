import { Box, Button, Stack, Typography, useTheme } from '@mui/material';
import React from 'react';
import ListAltIcon from '@mui/icons-material/ListAlt';
import StoreIcon from '@mui/icons-material/Store';
import EditIcon from '@mui/icons-material/Edit';
import SettingsIcon from '@mui/icons-material/Settings';
import CurrencyRupeeIcon from '@mui/icons-material/CurrencyRupee';

function HomeLinks() {
  const theme = useTheme();

  return (
    <Stack
      direction="row"
      sx={{ display: 'flex', justifyContent: 'space-between' }}
    >
      <Button>
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
      <Button>
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
      <Button>
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
      <Button>
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

export default HomeLinks;
