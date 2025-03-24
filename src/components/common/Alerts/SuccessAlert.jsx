import { Alert, AlertTitle, Typography, useTheme } from '@mui/material';
import TaskAltIcon from '@mui/icons-material/TaskAlt';

function SuccessAlert({ title, description }) {
  const theme = useTheme();
  return (
    <>
      <Alert
        severity="success"
        variant="standard"
        icon={<TaskAltIcon fontSize="large" />}
        sx={{ display: 'flex', alignItems: 'center' }}
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

export default SuccessAlert;
