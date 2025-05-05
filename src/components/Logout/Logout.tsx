import { Button, Typography } from '@mui/material';
import LogoutIcon from '@mui/icons-material/Logout';
import useLogout from '../../hooks/useLogout';

function Logout() {
  const handleLogout = useLogout();
  return (
    <Button onClick={handleLogout}>
      <LogoutIcon fontSize="small" sx={{ mr: 1 }} />
      <Typography variant="button1">Logout</Typography>
    </Button>
  );
}

export default Logout;
