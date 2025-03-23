import {
  Box,
  Button,
  ButtonGroup,
  Chip,
  Divider,
  Grid,
  IconButton,
  Paper,
  Stack,
  Typography,
  useTheme,
} from '@mui/material';
import WestIcon from '@mui/icons-material/West';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import PhoneIcon from '@mui/icons-material/Phone';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import React, { useEffect } from 'react';
import OrderStatusDialog from './OrderStatusDialog';

function OrderDetails({ order, close, updateStatusById }) {
  // if (!order.opened) updateOpenedById(order.id, false);
  const theme = useTheme();
  let statusLabelColor = '#ffffff';
  let statusLabelTextColor = '#ffffff';
  switch (order.status) {
    case 'accepted':
      statusLabelColor = 'hsl(122, 39%, 55%)';
      break;
    case 'rejected':
      statusLabelColor = 'hsl(150, 12%, 52%)';
      break;
    case 'new':
      statusLabelColor = 'hsl(0, 65%, 51%)';
      break;
    case 'completed':
      statusLabelColor = 'hsl(123,46.2%,33%)';
      break;
    default:
      statusLabelColor = '#ffffff';
  }

  let labelSx = {
    backgroundColor: statusLabelColor,
    color: statusLabelTextColor,
  };

  let totalPrice = 0;
  order.items.forEach((item) => {
    totalPrice = totalPrice + item.price * item.quantity;
  });

  const [openDialog, setOpenDialog] = React.useState(false);
  const changeOrderStatus = (status) => {
    updateStatusById(order.id, status);
    if (status !== 'completed') setOpenDialog(true);
  };
  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  return (
    <>
      <Stack
        direction="row"
        sx={{
          alignItems: 'center',
          display: 'flex',
          width: '100%',
        }}
      >
        <Box display="flex" alignItems="center">
          <IconButton
            sx={{ position: 'absolute', marginLeft: '30px' }}
            onClick={close}
          >
            <WestIcon
              fontSize="medium"
              sx={{
                color: 'brown',
              }}
            />
          </IconButton>
        </Box>
        <Typography
          variant="h6"
          sx={{
            fontColor: 'black',
            textAlign: 'center',
            margin: 'auto',
            width: '100%',
          }}
        >
          Order# {order.id}
        </Typography>
      </Stack>
      <Grid
        container
        spacing={4}
        sx={{
          width: '100%',
          marginTop: '10px',
          paddingX: 3, // Ensure no padding is applied
        }}
      >
        <Grid
          container
          item
          xs={12}
          spacing={2}
          sx={{ display: 'flex', justifyContent: 'flex-start' }}
        >
          <Grid item xs={12}>
            <Stack
              direction="row"
              spacing={2}
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'flex-end',
              }}
            >
              <Chip
                label={order.status}
                variant="contained"
                sx={{
                  borderRadius: '20px',
                  borderStyle: 'dashed',
                  borderColor: 'white',
                  borderWidth: 1.5,
                  ...labelSx,
                  width: '120px',
                  height: '35px',
                  fontSize: theme.typography.heavybody2,
                }}
              />
              {order.status === 'accepted' && (
                <Button
                  variant="text"
                  onClick={() => {
                    changeOrderStatus('completed');
                  }}
                >
                  <Typography
                    variant="button2"
                    color={theme.palette.grey[900]}
                    sx={{ textDecoration: 'underline' }}
                  >
                    Mark as completed
                  </Typography>
                </Button>
              )}
            </Stack>
          </Grid>
          <Grid item xs={12}>
            <Stack spacing={1} sx={{ width: '100%' }}>
              <Typography
                variant="heavyb1"
                sx={{
                  wordWrap: 'break-word', // Ensures long words break and wrap onto the next line
                  whiteSpace: 'normal', // Allows the text to wrap within the container
                  width: '100%', // Ensure the text takes up the full width of its container
                }}
              >
                {order.customer}
              </Typography>
              <Stack direction="row" spacing={1}>
                <PhoneIcon fontSize="small" />
                <Typography variant="heavyb2" color={theme.palette.grey[600]}>
                  +91{order.phone}
                </Typography>
              </Stack>
              <Stack direction="row" spacing={1}>
                <LocationOnIcon fontSize="small" />
                <Typography
                  variant="b2"
                  color={theme.palette.grey[600]}
                  sx={{
                    wordWrap: 'break-word', // Ensures long words break and wrap onto the next line
                    whiteSpace: 'normal', // Allows the text to wrap within the container
                    width: '100%', // Ensure the text takes up the full width of its container
                  }}
                >
                  {order.address}
                </Typography>
              </Stack>
              <Stack direction="row" spacing={1}>
                <AccessTimeIcon fontSize="small" />
                <Typography variant="b2" color={theme.palette.grey[600]} noWrap>
                  {order.date}
                </Typography>
              </Stack>
            </Stack>
          </Grid>
        </Grid>
        <Grid item xs={6}>
          <Button
            variant="outlined"
            sx={{
              borderRadius: '25px',
              borderColor: theme.palette.grey[500],
              width: '100%',
            }}
          >
            <Typography variant="button2" color={theme.palette.grey[700]}>
              Chat With Customer
            </Typography>
            <WhatsAppIcon
              fontSize="medium"
              sx={{ color: 'hsl(142.4,70.2%,42.6%)' }}
            />
          </Button>
        </Grid>
        <Grid item xs={6}>
          <Button
            variant="outlined"
            sx={{
              borderRadius: '25px',
              borderColor: theme.palette.grey[500],
              width: '100%',
            }}
          >
            <Typography variant="button2" color={theme.palette.grey[700]}>
              Call Customer
            </Typography>
            <PhoneIcon fontSize="medium" />
          </Button>
        </Grid>
        <Grid item xs={12}>
          <Typography variant="h6" sx={{ mb: 1 }}>
            Order Details
          </Typography>{' '}
          <Stack spacing={0.5}>
            {order.items.map((item) => (
              <Grid container rowSpacing={0.2}>
                <Grid item xs={12}>
                  <Typography variant="heavyb2" color={theme.palette.grey[900]}>
                    {item.name}
                  </Typography>
                </Grid>
                <Grid
                  container
                  item
                  xs={4}
                  sx={{ display: 'flex', justifyContent: 'center' }}
                >
                  <Grid item xs={4}>
                    <Typography
                      variant="heavyb2"
                      color={theme.palette.grey[700]}
                    >
                      ₹{item.price}
                    </Typography>
                  </Grid>
                  <Grid item xs={4}>
                    <Typography
                      variant="heavyb2"
                      color={theme.palette.grey[900]}
                    >
                      x
                    </Typography>
                  </Grid>
                  <Grid item xs={4}>
                    <Typography
                      variant="heavyb2"
                      color={theme.palette.grey[700]}
                    >
                      {item.quantity}
                    </Typography>
                  </Grid>
                </Grid>
                <Grid
                  item
                  xs={6}
                  sx={{ display: 'flex', justifyContent: 'center' }}
                >
                  <Typography variant="heavyb2" color={theme.palette.grey[700]}>
                    ₹{item.quantity * item.price}
                  </Typography>
                </Grid>
              </Grid>
            ))}
          </Stack>
          <Grid item container rowSpacing={1} xs={12}>
            <Grid item xs={8}>
              <Divider
                flexItem
                variant="fullWidth"
                color={theme.palette.grey[500]}
                sx={{ mt: 1 }}
              />
            </Grid>
            <Grid item xs={4} />
            <Grid item xs={4}>
              <Typography variant="heavyb1" color={theme.palette.grey[900]}>
                Grand Total
              </Typography>
            </Grid>
            <Grid
              item
              xs={6}
              sx={{ display: 'flex', justifyContent: 'center' }}
            >
              <Typography variant="heavyb1" color={theme.palette.grey[900]}>
                ₹{totalPrice}
              </Typography>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
      <Box sx={{ height: '90px' }} />
      <Paper
        elevation={12}
        sx={{ position: 'fixed', bottom: 0, width: '100%' }}
      >
        <ButtonGroup
          fullWidth
          variant="contained"
          aria-label="order actions"
          sx={{ height: '55px' }}
        >
          <Button
            disabled={
              order.status === 'accepted' || order.status === 'completed'
            }
            onClick={() => {
              changeOrderStatus('accepted');
            }}
            sx={{
              backgroundColor: 'hsl(84, 100%, 70%)',
              '&:hover': {
                backgroundColor: 'hsl(84, 100%, 70%)',
              },
              '&:focus': {
                backgroundColor: 'hsl(84, 100%, 70%)',
              },
              '&:active': {
                backgroundColor: 'hsl(84, 100%, 70%)',
              },
              color: theme.palette.grey[900],
            }}
            variant="contained"
            startIcon={<CheckIcon />}
          >
            <Typography variant="button1">Accept Order</Typography>
          </Button>
          <Button
            disabled={
              order.status === 'rejected' || order.status === 'completed'
            }
            onClick={() => {
              changeOrderStatus('rejected');
            }}
            sx={{
              borderWidth: 1,
              backgroundColor: '#ffffff',
              '&:hover': {
                backgroundColor: '#ffffff', // Ensure the hover color remains the same
              },
              '&:focus': {
                backgroundColor: '#ffffff', // Ensure the focus color remains the same
              },
              '&:active': {
                backgroundColor: '#ffffff', // Ensure the active color remains the same
              },
              color: theme.palette.grey[900],
            }}
            variant="contained"
            startIcon={<CloseIcon />}
          >
            <Typography variant="button1">Reject Order</Typography>
          </Button>
        </ButtonGroup>
      </Paper>
      <OrderStatusDialog
        open={openDialog}
        handleClose={handleCloseDialog}
        status={order.status}
        updateStatusById={updateStatusById}
      />
    </>
  );
}

export default OrderDetails;
