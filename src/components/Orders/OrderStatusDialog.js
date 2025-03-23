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

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function OrderStatusDialog({ open, handleClose, status }) {
  const theme = useTheme();
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
              <Typography variant="b2">
                You have accepted this order. Let customer know that their order
                is confirmed.
              </Typography>
            )}
            {status === 'rejected' && (
              <Typography variant="b2">
                You have declined this order. Let customer know that their order
                won't be delivered.
              </Typography>
            )}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            variant="contained"
            size="large"
            onClick={handleClose}
            // sx={{ backgroundColor: 'hsl(122, 39%, 49%)' }}
          >
            <Typography variant="b1">Message Customer</Typography>
          </Button>
          <Button variant="text" size="large" onClick={handleClose}>
            <Typography variant="button1" color={theme.palette.grey[700]}>
              skip
            </Typography>
          </Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}
