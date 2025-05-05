// hooks/useLogout.ts
import { useMutation } from '@apollo/client';
import { useNavigate } from 'react-router-dom';
import { LOG_OUT } from '../libs/graphql/definitions/auth-definitions';
import { useAuth } from '../context/AuthContext';
import useApolloClient from './useApolloClient';

export default function useLogout() {
  const [logoutAdmin] = useMutation(LOG_OUT);
  const navigate = useNavigate();
  const { unsetAuthToken } = useAuth();
  const client = useApolloClient();

  const handleLogout = async () => {
    try {
      const result = await logoutAdmin();
      if (result?.data?.logout?.success) {
        await client.clearStore();
        unsetAuthToken();
        navigate('/login');
      }
    } catch (err) {
      console.error('Logout failed:', err);
    }
  };

  return handleLogout;
}
