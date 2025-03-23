import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import PersonIcon from '@mui/icons-material/Person';
import LogoutIcon from '@mui/icons-material/Logout';
import HomeIcon from '@mui/icons-material/Home';
import { useMutation } from '@apollo/client';
import { useNavigate } from 'react-router-dom';
import { LOG_OUT } from '../../../libs/graphql/definitions/auth-definitions';
import { Tooltip } from '@mui/material';

interface TopAppBarProps {
  logout: () => void;
}

const TopAppBar: React.FC<TopAppBarProps> = ({ logout }) => {
  const navigate = useNavigate();
  const [logoutAdmin] = useMutation(LOG_OUT);

  const handleLogout = async () => {
    try {
      const result = await logoutAdmin();
      if (result?.data?.logout?.success) {
        //go back to login
        logout();
        navigate('/login');
      }
      console.log(result);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <Box sx={{ position: 'relative' }}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Hello
          </Typography>
          <Tooltip title="Profile">
            <IconButton color="inherit" onClick={() => navigate('/home')}>
              <HomeIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Profile">
            <IconButton
              color="inherit"
              onClick={() => navigate('/viewProfile')}
            >
              <PersonIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Logout">
            <IconButton onClick={handleLogout}>
              <LogoutIcon sx={{ color: 'white' }} />
            </IconButton>
          </Tooltip>
        </Toolbar>
      </AppBar>
    </Box>
  );
};

export default TopAppBar;
