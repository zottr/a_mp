import { Alert, AlertTitle, Typography, useTheme } from '@mui/material';
import TaskAltIcon from '@mui/icons-material/TaskAlt';

function SuccessAlert({ title, description }) {
  const theme = useTheme();
  return (
    <>
      <Alert
        severity="success"
        color=""
        variant="standard"
        icon={<TaskAltIcon fontSize="large" />}
        sx={{ display: 'flex', alignItems: 'center' }}
      >
        <AlertTitle>
          <Typography variant="heavyb1">{title}</Typography>
        </AlertTitle>
        <Typography variant="b2">{description}</Typography>
      </Alert>
    </>
  );
}

export default SuccessAlert;
