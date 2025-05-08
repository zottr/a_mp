import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Slide from '@mui/material/Slide';
import { Box, CircularProgress, Stack, Typography } from '@mui/material';
import { useTheme } from '@mui/material';
import { openWhatsAppChat } from '../../utils/CommonUtils';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function OrderStatusDialog({
  open,
  handleClose,
  status,
  phoneNumber,
  orderId,
  adminUser,
  changeOrderStatus,
  acceptOrder,
  updating,
}) {
  const theme = useTheme();
  console.log('adminUser', adminUser);
  const handleMessageCustomer = async () => {
    if (acceptOrder) {
      await changeOrderStatus('accepted');
    } else {
      await changeOrderStatus('rejected');
    }
    let message = '';
    if (acceptOrder) {
      message = `We have received your order 📦 with order id _*#${orderId}*_ ✅ and it will be delivered shortly 🚚 - *${adminUser?.customFields.businessName}*`;
      // message = `We have received your order with order id #${orderId}, we will deliver it soon.`;
    } else {
      message = `Oops 😕, we can't deliver your order 📦 with order id _*#${orderId}*_ this time. Sorry for the inconvenience - *${adminUser?.customFields.businessName}*`;
      // message = `Sorry, we won't be able to deliver your order with order id #${orderId}.`;
    }
    openWhatsAppChat(phoneNumber, message);
    handleClose();
  };

  return (
    <React.Fragment>
      <Dialog
        open={open}
        TransitionComponent={Transition}
        keepMounted
        // onClose={handleClose}
        onClose={(e, reason) => {
          if (reason === 'backdropClick' || reason === 'escapeKeyDown') {
            // Prevent closing the dialog
            return;
          }
          handleClose();
        }}
        aria-describedby="alert-dialog-slide-description"
      >
        <Box sx={{ minHeight: 200 }}>
          <DialogTitle>
            {acceptOrder && <Typography variant="h6">Accept Order?</Typography>}
            {!acceptOrder && (
              <Typography variant="h6">Reject Order?</Typography>
            )}
          </DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-slide-description">
              {acceptOrder && (
                <Typography variant="b1">
                  Accept order and send order status to customer via Whatsapp.
                </Typography>
              )}
              {!acceptOrder && (
                <Typography variant="b1">
                  Reject order and send order status to customer via Whatsapp.
                </Typography>
              )}
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button
              variant="contained"
              disabled={updating}
              size="medium"
              onClick={handleMessageCustomer}
              sx={{
                backgroundColor: 'hsl(142.4,70.2%,42.6%)',
                '&:hover': {
                  backgroundColor: 'hsl(142.4,70.2%,35%)',
                },
                color: 'white', // Sets text and icon color to white
                height: '3rem',
                width: '100%',
                borderRadius: '40px',
                '&.Mui-disabled': {
                  backgroundColor: 'hsl(142.4,70.2%,42.6%)',
                },
              }}
            >
              <Stack direction="row" gap={1} className="fcc">
                {!updating && (
                  <>
                    <WhatsAppIcon sx={{ fontSize: '30px' }} />
                    <Typography variant="button1">
                      {acceptOrder ? 'Accept & notify' : 'Reject & notify'}
                    </Typography>
                  </>
                )}
                {updating && (
                  <CircularProgress
                    thickness={5}
                    size={32}
                    sx={{ color: 'white' }}
                  />
                )}
              </Stack>
            </Button>
            <Button
              disabled={updating}
              variant="text"
              size="large"
              onClick={handleClose}
            >
              <Typography variant="button1" color={theme.palette.grey[600]}>
                Cancel
              </Typography>
            </Button>
          </DialogActions>
        </Box>
      </Dialog>
    </React.Fragment>
  );
}
