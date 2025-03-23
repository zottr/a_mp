import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Paper,
  Stack,
  Typography,
  useTheme,
} from '@mui/material';
import ErrorIcon from '@mui/icons-material/Error';

/*sample usage : 
   <ErrorDialog
          open={userAccountError}
          handleClose={() => {
            setUserAccountError(false);
          }}
          title={`${phone} is already registered`}
          description="Try to login or use a different number"
        />
*/

function ErrorDialog({ open, handleClose, title, description }) {
  const theme = useTheme();
  return (
    <Dialog open={open} onClose={handleClose}>
      <Paper sx={{ p: 2 }}>
        <Stack gap={1.5}>
          <Stack
            direction="row"
            gap={1}
            sx={{ display: 'flex', alignItems: 'flex-start' }}
          >
            <ErrorIcon
              sx={{ color: theme.palette.error.dark, fontSize: '2.3rem' }}
            />
            <Typography variant="h7" sx={{ fontWeight: 500 }}>
              {title}
            </Typography>
          </Stack>
          <Typography variant="b1" sx={{ color: theme.palette.grey[700] }}>
            {description}
          </Typography>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'flex-end',
            }}
          >
            <Button
              variant="contained"
              size="large"
              onClick={handleClose}
              autoFocus
              sx={{ width: '30%' }}
            >
              OK
            </Button>
          </Box>
        </Stack>
      </Paper>
    </Dialog>
  );
}

export default ErrorDialog;
