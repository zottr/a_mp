import { Box, Button, Grid, Stack, Typography } from '@mui/material';
import ArrowRightIcon from '@mui/icons-material/ArrowRight';
import NewReleasesIcon from '@mui/icons-material/NewReleases';
import { useEffect, useState } from 'react';
import { useQuery } from '@apollo/client';
import { GET_COUNT_NEW_ORDERS } from '../libs/graphql/definitions/order-definitions';
import { useUserContext } from '../hooks/useUserContext';
import NotificationsSkeleton from './NotificationsSkeleton';
import { useNavigate } from 'react-router-dom';

interface NotifificationsProps {
  type: string;
}

const Notifications: React.FC<NotifificationsProps> = ({ type }) => {
  const [hasNewOrders, setHasNewOrders] = useState(false);
  const [storeLogoPresent, setStoreLogoPresent] = useState(false);
  const [storeTaglinePresent, setStoreTaglinePresent] = useState(false);
  const [upiInfoPresent, setUpiInfoPresent] = useState(false);
  const { adminUser } = useUserContext();
  const navigate = useNavigate();

  const { loading, error, data, fetchMore } = useQuery(GET_COUNT_NEW_ORDERS, {
    variables: {
      options: {
        filter: {
          adminStatus: { in: ['new'] },
        },
      },
    },
    skip: type === 'services',
    fetchPolicy: 'network-only',
    onCompleted: (fetchedData) => {
      if (fetchedData.orders?.totalItems > 0) setHasNewOrders(true);
    },
  });

  useEffect(() => {
    if (adminUser != null) {
      console.log(adminUser);
      if (adminUser.customFields.businessLogo != null)
        setStoreLogoPresent(true);
      if (
        adminUser.customFields.tagline != null &&
        adminUser.customFields.tagline !== ''
      )
        setStoreTaglinePresent(true);
      if (
        type === 'seller' &&
        (adminUser.customFields.upiId !== '' ||
          adminUser.customFields.upiPhone !== '' ||
          adminUser.customFields.upiScan !== null)
      )
        setUpiInfoPresent(true);
    }
  }, [adminUser]);

  return (
    <>
      <Typography
        variant="h7"
        color="grey.800"
        sx={{
          textAlign: 'center',
          margin: 'auto',
        }}
      >
        Notifications
      </Typography>
      {(loading || adminUser === null) && (
        <Box sx={{ mt: 1 }}>
          <NotificationsSkeleton />
        </Box>
      )}
      {!loading && adminUser !== null && (
        <Stack
          sx={{
            mt: 1,
            display: 'flex',
            alignItems: 'flex-start',
          }}
        >
          {type === 'seller' && hasNewOrders && (
            <Grid container sx={{ width: '100%' }}>
              <Grid
                item
                xs={1}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <NewReleasesIcon
                  fontSize="medium"
                  sx={{ color: 'success.main' }}
                />
              </Grid>
              <Grid
                item
                xs={11}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'flex-start',
                }}
              >
                <Typography variant="b2" sx={{ ml: 1 }}>
                  You have new orders!
                </Typography>
                <Button
                  sx={{ color: 'primary.main' }}
                  onClick={() => {
                    navigate('/seller/orders');
                  }}
                >
                  <Typography variant="button2">View Orders</Typography>
                </Button>
              </Grid>
            </Grid>
          )}
          {!storeLogoPresent && (
            <Grid container sx={{ width: '100%' }}>
              <Grid
                item
                xs={1}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <ArrowRightIcon
                  fontSize="large"
                  sx={{
                    color: 'success.main',
                  }}
                />
              </Grid>
              <Grid
                item
                xs={11}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'flex-start',
                }}
              >
                <Typography variant="b2" sx={{ ml: 1 }}>
                  Add an account logo
                </Typography>
                <Button
                  sx={{ color: 'primary.light' }}
                  onClick={() => {
                    navigate(`/${type}/customize`);
                  }}
                >
                  <Typography variant="button2">Add Logo</Typography>
                </Button>
              </Grid>
            </Grid>
          )}
          {!storeTaglinePresent && (
            <Grid container sx={{ width: '100%' }}>
              <Grid
                item
                xs={1}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <ArrowRightIcon
                  fontSize="large"
                  sx={{
                    color: 'success.main',
                  }}
                />
              </Grid>
              <Grid
                item
                xs={11}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'flex-start',
                }}
              >
                <Typography variant="b2" sx={{ ml: 1 }}>
                  Add an account tagline
                </Typography>
                <Button
                  sx={{ color: 'primary.light' }}
                  onClick={() => {
                    navigate(`/${type}/customize`);
                  }}
                >
                  <Typography variant="button2">Add Tagline</Typography>
                </Button>
              </Grid>
            </Grid>
          )}
          {type === 'seller' && !upiInfoPresent && (
            <Grid container sx={{ width: '100%' }}>
              <Grid
                item
                xs={1}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <ArrowRightIcon
                  fontSize="large"
                  sx={{
                    color: 'success.main',
                  }}
                />
              </Grid>
              <Grid
                item
                xs={11}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'flex-start',
                }}
              >
                <Typography variant="b2" sx={{ ml: 1 }}>
                  Add UPI account details
                </Typography>
                <Button
                  sx={{ color: 'primary.light' }}
                  onClick={() => {
                    navigate('/seller/payment-settings');
                  }}
                >
                  <Typography variant="button2">Update UPI</Typography>
                </Button>
              </Grid>
            </Grid>
          )}
        </Stack>
      )}
    </>
  );
};

export default Notifications;
