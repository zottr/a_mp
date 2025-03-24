import {
  Box,
  Button,
  ButtonGroup,
  Chip,
  Divider,
  Grid,
  Paper,
  Stack,
  Typography,
  useTheme,
  CircularProgress,
  Container,
} from '@mui/material';
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
import {
  GET_ORDER,
  UPDATE_ORDER_CUSTOM_FIELDS,
} from '../../libs/graphql/definitions/order-definitions';
import { useParams } from 'react-router-dom';
import { useMutation, useQuery } from '@apollo/client';
import OrderNotFoundAlert from './OrderNotFoundAlert';

function OrderDetails() {
  // if (!data?.order?.opened) updateOpenedById(data?.order?.id, false);
  const theme = useTheme();
  const [updating, setUpdating] = useState(false);
  const [openDialog, setOpenDialog] = React.useState(false);
  const query = useParams();
  const [updateOrder] = useMutation(UPDATE_ORDER_CUSTOM_FIELDS);

  console.log(query.orderId);

  const { loading, error, data } = useQuery(GET_ORDER, {
    variables: {
      id: query.orderId,
    },
    fetchPolicy: 'cache-and-network',
    onCompleted: (fetchedData) => {
      console.log(fetchedData);
    },
  });

  console.log(data?.order);

  let statusLabelColor = '#ffffff';
  let statusLabelTextColor = '#ffffff';
  switch (data?.order?.customFields?.adminStatus) {
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

  const handleUpdateOrder = async (id, newStatus) => {
    try {
      const { data } = await updateOrder({
        variables: {
          input: {
            id,
            customFields: {
              adminStatus: newStatus, // Example field update
            },
          },
        },
      });
    } catch (err) {
      console.error('Error updating order:', err.message);
    }
  };

  const changeOrderStatus = async (status) => {
    setUpdating(true);
    try {
      await handleUpdateOrder(query.orderId, status);
      if (status !== 'completed') setOpenDialog(true);
    } catch (error) {
      console.error('Error updating status:', error);
    } finally {
      setUpdating(false);
    }
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  return (
    <>
      <MainAppBar />
      <Box sx={{ mt: 7, position: 'relative' }}>
        <OrderDetailsBreadcrumbs id={query.orderId} />
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
            Order# {query.orderId}
          </Typography>
        </Stack>
        {(updating || loading) && (
          <Box
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: updating
                ? 'rgba(255, 255, 255, 0.7)'
                : 'transparent',
              zIndex: 1000,
              width: '100vw',
              height: '100vh',
            }}
          >
            <CircularProgress size={40} thickness={4} sx={{ mb: 10 }} />
          </Box>
        )}
        {!loading && data?.order == null && (
          <Container sx={{ mt: 10, px: 3 }}>
            <OrderNotFoundAlert />
          </Container>
        )}
        {!loading && data.order != null && (
          <Box>
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
                      label={data?.order?.customFields?.adminStatus}
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
                    {data?.order?.customFields?.adminStatus === 'accepted' && (
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
                      {data?.order?.customer?.firstName}
                    </Typography>
                    <Stack direction="row" spacing={1}>
                      <PhoneIcon fontSize="small" />
                      <Typography
                        variant="heavyb2"
                        color={theme.palette.grey[600]}
                      >
                        +91{data?.order?.customer?.phoneNumber}
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
                        {data?.order?.shippingAddress?.country}
                      </Typography>
                    </Stack>
                    <Stack direction="row" spacing={1}>
                      <AccessTimeIcon fontSize="small" />
                      <Typography
                        variant="b2"
                        color={theme.palette.grey[600]}
                        noWrap
                      >
                        {new Date(data?.order?.createdAt).toLocaleString()}
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
                  {data?.order?.lines?.map((item) => (
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
                <Grid item container rowSpacing={1} xs={12}>
                  <Grid item xs={12}>
                    <Divider
                      flexItem
                      variant="fullWidth"
                      color={theme.palette.grey[500]}
                      sx={{ mt: 1 }}
                    />
                  </Grid>
                  <Grid item xs={8}>
                    <Typography
                      variant="heavyb1"
                      color={theme.palette.grey[900]}
                    >
                      Grand Total
                    </Typography>
                  </Grid>
                  <Grid
                    item
                    xs={4}
                    sx={{ display: 'flex', justifyContent: 'flex-start' }}
                  >
                    <Typography
                      variant="heavyb1"
                      color={theme.palette.grey[900]}
                    >
                      ₹{Number(data?.order?.total ?? 0) / 100}
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
                    data?.order?.customFields?.adminStatus === 'accepted' ||
                    data?.order?.customFields?.adminStatus === 'completed'
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
                    data?.order?.customFields?.adminStatus === 'rejected' ||
                    data?.order?.customFields?.adminStatus === 'completed'
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
          </Box>
        )}
        <OrderStatusDialog
          open={openDialog}
          handleClose={handleCloseDialog}
          status={data?.order?.customFields?.adminStatus}
        />
      </Box>
    </>
  );
}

export default OrderDetails;
