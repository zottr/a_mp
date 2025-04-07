import { Button, Typography } from '@mui/material';
import LogoutIcon from '@mui/icons-material/Logout';
import { useNavigate } from 'react-router-dom';
import { useMutation } from '@apollo/client';
import { LOG_OUT } from '../../libs/graphql/definitions/auth-definitions';
import { useAuth } from '../../context/AuthContext';
import useApolloClient from '../../hooks/useApolloClient';

function Logout() {
  const navigate = useNavigate();
  const [logoutAdmin] = useMutation(LOG_OUT);
  const { authToken, unsetAuthToken } = useAuth();
  const client = useApolloClient();
  const handleLogout = async () => {
    try {
      const result = await logoutAdmin();
      if (result?.data?.logout?.success) {
        //go back to login
        client.clearStore();
        //remove auth token for logout
        unsetAuthToken();
        navigate('/login');
      }
    } catch (err) {
      console.error(err);
    }
  };
  return (
    <Button onClick={handleLogout}>
      <LogoutIcon fontSize="small" sx={{ mr: 1 }} />
      <Typography variant="button1">Logout</Typography>
    </Button>
  );
}

export default Logout;
