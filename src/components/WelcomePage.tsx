import { Box, Button, Stack, Typography, useTheme } from '@mui/material';
import Logo from '/logos/zottr_logo_large.svg';
import sellerImage from '/svg/seller.svg';
import servicesImage from '/svg/services.svg';
import { useUserContext } from '../hooks/useUserContext';
import { useNavigate } from 'react-router-dom';
import { isLocalStorageAvailable } from '../utils/CommonUtils';

function WelcomePage() {
  const theme = useTheme();
  const { adminUser } = useUserContext();
  const navigate = useNavigate();
  // const [defaultHome, setDefaultHome] = useState(true);

  // useEffect(() => {
  //   if (isLocalStorageAvailable()) {
  //     const zottrHome = localStorage.getItem('zottrHome');
  //     if (zottrHome === 'seller') navigate('/seller/home');
  //     else if (zottrHome === 'services') navigate('/services/home');
  //   }
  //   setDefaultHome(false);
  // }, []);

  return (
    <>
      <Stack direction="row" sx={{ bgcolor: 'white' }}>
        <Stack
          sx={{
            width: '100%',
            display: 'flex',
            p: 1,
          }}
        >
          <Typography
            variant="h4"
            sx={{
              color: theme.palette.grey[800],
            }}
          >
            Welcome,
          </Typography>
          <Typography
            variant="h6"
            sx={{
              ml: 1,
              color: theme.palette.grey[800],
              overflowWrap: 'break-word',
              wordBreak: 'break-word',
            }}
          >
            {adminUser?.firstName}
          </Typography>
        </Stack>
        <Box display="flex" justifyContent="flex-end" sx={{ p: 2 }}>
          <img src={Logo} alt="zottr logo" height="36px" />
        </Box>
      </Stack>
      <Stack
        gap={2}
        sx={{
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          bgcolor: 'white',
        }}
      >
        <Stack
          gap={1}
          sx={{
            width: '100%',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          {/* <img src={sellerImage} alt="zottr logo" width="100%" height="270px" /> */}
          <Box
            sx={{
              overflow: 'hidden', // hides any overflow caused by zoom
              width: '100%',
              height: 'auto',
            }}
          >
            <Box
              component="img"
              src={sellerImage}
              alt="zottr logo"
              sx={{
                width: '100%',
                height: 'auto',
                objectFit: 'cover',
                transform: 'scale(1)', // zoom by 10%
                transformOrigin: 'top', // zoom from center
              }}
            />
          </Box>
          <Button
            onClick={() => {
              // if (isLocalStorageAvailable()) {
              //   localStorage.setItem('zottrHome', 'seller');
              // }
              navigate('/seller/home');
            }}
            variant="contained"
            sx={{
              height: '70px',
              width: '250px',
              borderRadius: '50px',
              bgcolor: 'primary.main',
              '&:hover, &:focus, &:active': {
                bgcolor: 'primary.main',
              },
            }}
          >
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              Sell Products
            </Typography>
          </Button>
        </Stack>
        <Typography variant="h7" sx={{ color: 'grey.700' }}>
          OR
        </Typography>
        <Stack
          gap={1}
          sx={{
            width: '100%',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Button
            onClick={() => {
              // if (isLocalStorageAvailable()) {
              //   localStorage.setItem('zottrHome', 'services');
              // }
              navigate('/services/home');
            }}
            variant="contained"
            sx={{
              height: '70px',
              width: '250px',
              borderRadius: '50px',
              bgcolor: 'secondary.light',
              '&:hover, &:focus, &:active': {
                bgcolor: 'secondary.main',
              },
            }}
          >
            <Typography
              variant="h6"
              sx={{ fontWeight: 600, color: 'grey.900' }}
            >
              Provide Services
            </Typography>
          </Button>
          <Box
            sx={{
              overflow: 'hidden', // hides any overflow caused by zoom
              width: '100%',
              height: 'auto',
            }}
          >
            <Box
              component="img"
              src={servicesImage}
              alt="zottr logo"
              sx={{
                width: '100%',
                height: 'auto',
                objectFit: 'cover',
                transform: 'scale(1)', // zoom by 10%
                transformOrigin: 'top', // zoom from center
              }}
            />
          </Box>
          {/* <Box
            component="img"
            src={servicesImage}
            alt="zottr logo"
            // width="130%"
            sx={{ objectFit: 'cover' }}
          /> */}
          {/* <img src={servicesImage} alt="zottr logo" width="100%" /> */}
        </Stack>
      </Stack>
    </>
  );
}

export default WelcomePage;
