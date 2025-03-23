import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

interface ConfirmationDialogProps {
  openDialog: boolean;
  message: string;
  onClose: () => void;
  onConfirm: () => void;
}

const ConfirmationDialog: React.FC<ConfirmationDialogProps> = ({
  openDialog,
  message,
  onConfirm,
  onClose,
}) => {
  return (
    <React.Fragment>
      {openDialog && (
        <Dialog
          open={openDialog}
          onClose={onClose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">Confirmation</DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              {message}
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={onConfirm} autoFocus>
              Confirm
            </Button>
            <Button onClick={onClose}>Cancel</Button>
          </DialogActions>
        </Dialog>
      )}
    </React.Fragment>
  );
};

export default ConfirmationDialog;
