import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Slide from '@mui/material/Slide';
import { Typography } from '@mui/material';
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
}) {
  const theme = useTheme();
  console.log('adminUser', adminUser);
  const handleMessageCustomer = () => {
    let message = '';
    if (status === 'accepted') {
      message = `We have received your order 📦 with order id _*#${orderId}*_ ✅ and it will be delivered shortly 🚚 - *${adminUser?.customFields.businessName}*`;
      // message = `We have received your order with order id #${orderId}, we will deliver it soon.`;
    } else if (status === 'rejected') {
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
        <DialogTitle>
          {status === 'accepted' && (
            <Typography variant="h6">Order Accepted</Typography>
          )}
          {status === 'rejected' && (
            <Typography variant="h6">Order Rejected</Typography>
          )}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-slide-description">
            {status === 'accepted' && (
              <Typography variant="b1">
                Send order confirmation message via Whatsapp
              </Typography>
            )}
            {status === 'rejected' && (
              <Typography variant="b1">
                Send order rejection message via Whatsapp
              </Typography>
            )}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            variant="contained"
            size="medium"
            onClick={handleMessageCustomer}
            sx={{
              backgroundColor: 'hsl(142.4,70.2%,42.6%)',
              '&:hover': {
                backgroundColor: 'hsl(142.4,70.2%,35%)',
              },
              color: 'white', // Sets text and icon color to white
              display: 'flex',
              gap: 1,
              alignItems: 'center',
              height: '3rem',
              borderRadius: '40px',
            }}
          >
            <WhatsAppIcon fontSize="medium" />
            <Typography variant="button1">Message Customer</Typography>
          </Button>

          <Button variant="text" size="large" onClick={handleClose}>
            <Typography variant="button1" color={theme.palette.grey[400]}>
              skip
            </Typography>
          </Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}
