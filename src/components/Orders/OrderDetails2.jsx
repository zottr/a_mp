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
  CircularProgress,
} from '@mui/material';
import WestIcon from '@mui/icons-material/West';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import PhoneIcon from '@mui/icons-material/Phone';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import React, { useState } from 'react';
import OrderStatusDialog from './OrderStatusDialog';
import MainAppBar from '../common/MainAppBar';
import OrderDetailsBreadcrumbs from './OrderDetailsBreadcrumbs';

function OrderDetails2({ order, close, updateStatusById }) {
  // if (!order.opened) updateOpenedById(order.id, false);
  const theme = useTheme();
  const [loading, setLoading] = useState(false);
  const [openDialog, setOpenDialog] = React.useState(false);

  let statusLabelColor = '#ffffff';
  let statusLabelTextColor = '#ffffff';
  switch (order.customFields?.adminStatus) {
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

  const changeOrderStatus = async (status) => {
    setLoading(true);
    try {
      await updateStatusById(order.id, status);
      if (status !== 'completed') setOpenDialog(true);
    } catch (error) {
      console.error('Error updating status:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  return (
    <>
      <MainAppBar />
      <Box sx={{ position: 'relative', mt: 5 }}>
        {/* Loading Overlay */}
        {loading && (
          <Box
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              backgroundColor: 'rgba(255, 255, 255, 0.8)',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              zIndex: 10,
            }}
          >
            <CircularProgress />
          </Box>
        )}
        <OrderDetailsBreadcrumbs id={order.id} />
        <Stack
          sx={{
            alignItems: 'center',
            display: 'flex',
            width: '100%',
            mt: 2,
            mb: 2,
          }}
        >
          <Typography
            variant="h6"
            sx={{
              color: 'grey.900',
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
            paddingX: 3, // Ensure no padding is applied
          }}
        >
          <Grid
            container
            item
            xs={12}
            spacing={2}
            sx={{
              display: 'flex',
              justifyContent: 'flex-start',
            }}
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
                  label={order.customFields?.adminStatus}
                  variant="contained"
                  sx={{
                    borderRadius: '10px',
                    // borderStyle: 'dashed',
                    borderColor: 'white',
                    borderWidth: 1.5,
                    ...labelSx,
                    width: '120px',
                    height: '35px',
                    fontSize: theme.typography.heavybody2,
                  }}
                />
                {order.customFields?.adminStatus === 'accepted' && (
                  <Button
                    variant="text"
                    onClick={() => {
                      changeOrderStatus('completed');
                    }}
                  >
                    <Typography
                      variant="button2"
                      color={theme.palette.grey[700]}
                      sx={{ textDecoration: 'underline' }}
                    >
                      Mark as completed
                    </Typography>
                  </Button>
                )}
              </Stack>
            </Grid>
            <Grid item xs={12}>
              <Stack spacing={1}>
                <Typography
                  variant="heavyb1"
                  sx={{
                    wordWrap: 'break-word', // Ensures long words break and wrap onto the next line
                    whiteSpace: 'normal', // Allows the text to wrap within the container
                    width: '100%', // Ensure the text takes up the full width of its container
                  }}
                >
                  {order.customer?.firstName}
                </Typography>
                <Stack direction="row" spacing={1}>
                  <PhoneIcon fontSize="small" />
                  <Typography variant="heavyb2" color={theme.palette.grey[600]}>
                    +91{order.customer?.phoneNumber}
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
                    {order.shippingAddress?.country}
                  </Typography>
                </Stack>
                <Stack direction="row" spacing={1}>
                  <AccessTimeIcon fontSize="small" />
                  <Typography
                    variant="b2"
                    color={theme.palette.grey[600]}
                    noWrap
                  >
                    {new Date(order.createdAt).toLocaleString()}
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
              }}
            >
              <Typography variant="button2" color={theme.palette.grey[700]}>
                Call Customer
              </Typography>
              <PhoneIcon fontSize="medium" />
            </Button>
          </Grid>
          <Grid item xs={12}>
            <Typography variant="h7" sx={{ mb: 1, color: 'grey.900' }}>
              Order Details
            </Typography>
            <Stack spacing={0.5} sx={{ width: '100%' }}>
              {order.lines?.map((item) => (
                <Grid container rowSpacing={0.5} sx={{ width: '100%' }}>
                  <Grid item xs={12}>
                    <Typography
                      variant="heavyb2"
                      color={theme.palette.grey[900]}
                    >
                      {item.productVariant?.name}
                    </Typography>
                  </Grid>
                  <Grid
                    container
                    item
                    xs={12}
                    sx={{
                      display: 'flex',
                      justifyContent: 'center',
                    }}
                  >
                    <Grid
                      item
                      xs={8}
                      sx={{ display: 'flex', justifyContent: 'flex-start' }}
                    >
                      <Stack direction="row">
                        <Box
                          sx={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            borderWidth: '1.3px',
                            borderStyle: 'solid',
                            borderColor: theme.palette.grey[700],
                            minWidth: '1.3rem',
                            minHeight: '1.3rem',
                            boxSizing: 'border-box',
                            padding: '1px',
                          }}
                        >
                          <Typography
                            variant="heavyb2"
                            color={theme.palette.grey[900]}
                          >
                            {item.quantity}
                          </Typography>
                        </Box>
                        <Typography
                          variant="heavyb2"
                          color={theme.palette.grey[900]}
                        >
                          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;x&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                        </Typography>
                        <Typography
                          variant="heavyb2"
                          color={theme.palette.grey[700]}
                        >
                          ₹{Number(item.unitPrice ?? 0) / 100}
                        </Typography>
                      </Stack>
                    </Grid>
                    <Grid
                      item
                      xs={4}
                      sx={{ display: 'flex', justifyContent: 'flex-start' }}
                    >
                      <Typography
                        variant="heavyb2"
                        color={theme.palette.grey[700]}
                      >
                        ₹{Number(item.linePrice ?? 0) / 100}
                      </Typography>
                    </Grid>
                  </Grid>
                </Grid>
              ))}
            </Stack>
            <Grid container rowSpacing={1} xs={12}>
              <Grid item xs={12}>
                <Divider
                  flexItem
                  variant="fullWidth"
                  color={theme.palette.grey[500]}
                  sx={{ mt: 1 }}
                />
              </Grid>
              <Grid item xs={8}>
                <Typography variant="heavyb1" color={theme.palette.grey[900]}>
                  Grand Total
                </Typography>
              </Grid>
              <Grid
                item
                xs={4}
                sx={{ display: 'flex', justifyContent: 'flex-start' }}
              >
                <Typography variant="heavyb1" color={theme.palette.grey[900]}>
                  ₹{Number(order.total ?? 0) / 100}
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
                order.customFields?.adminStatus === 'accepted' ||
                order.customFields?.adminStatus === 'completed'
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
                order.customFields?.adminStatus === 'rejected' ||
                order.customFields?.adminStatus === 'completed'
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
          status={order.customFields?.adminStatus}
        />
      </Box>
    </>
  );
}

export default OrderDetails2;
