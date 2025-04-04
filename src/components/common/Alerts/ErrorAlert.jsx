import { Alert, AlertTitle, Typography, useTheme } from '@mui/material';
import ErrorIcon from '@mui/icons-material/Error';

function ErrorAlert({ title, description, variant = 'outlined' }) {
  const theme = useTheme();
  return (
    <>
      <Alert
        severity="error"
        variant={variant}
        icon={<ErrorIcon fontSize="large" />}
      >
        <AlertTitle>
          <Typography variant="heavyb1" sx={{ color: theme.palette.grey[900] }}>
            {title}
          </Typography>
        </AlertTitle>
        <Typography variant="b2" sx={{ color: theme.palette.grey[700] }}>
          {description}
        </Typography>
      </Alert>
    </>
  );
}

export default ErrorAlert;
