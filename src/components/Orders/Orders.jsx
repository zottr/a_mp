import React, { useRef, useEffect, useState } from 'react';
import { useMutation, useQuery } from '@apollo/client';
import {
  Box,
  Container,
  MenuItem,
  Select,
  Stack,
  Typography,
  CircularProgress,
  useTheme,
  Divider,
} from '@mui/material';
import Grid from '@mui/material/Grid';
import OrderItem from './OrderItem';
import {
  GET_ORDERS_PREVIEW_LIST,
  UPDATE_ORDER_CUSTOM_FIELDS,
} from '../../libs/graphql/definitions/order-definitions';
import MainAppBar from '../common/MainAppBar';
import OrdersBreadcrumbs from './OrdersBreadcrumbs';
import LoadingCircle from '../common/LoadingCircle';
import OrdersSkeleton from './OrdersSkeleton';
import { useUserContext } from '../../hooks/useUserContext';
import { useNavigate } from 'react-router-dom';

function Orders() {
  const navigate = useNavigate();
  const ITEMS_PER_LOAD = 10;
  const { adminUser } = useUserContext();
  const [filterString, setFilterString] = React.useState({
    adminId: { eq: adminUser?.id },
    adminStatus: { in: ['new', 'accepted', 'rejected', 'delivered'] },
  });
  const [orderListOption, setOrderListOption] = React.useState('all');
  const [orders, setOrders] = useState([]); //contains all the fetched orders, this variable is needed to enable infinite scroll functionality
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const theme = useTheme();

  const { loading, error, data, fetchMore } = useQuery(
    GET_ORDERS_PREVIEW_LIST,
    {
      variables: {
        options: {
          skip: 0,
          take: ITEMS_PER_LOAD,
          filter: filterString,
          sort: { createdAt: 'DESC' },
        },
      },
      fetchPolicy: 'cache-and-network',
      onCompleted: (fetchedData) => {
        setOrders(fetchedData.orders.items);
        setHasMore(
          fetchedData.orders.items.length < fetchedData.orders.totalItems
        );
      },
      onError: (error) => {
        console.error('Error fetching orders:', error);
        if (
          error.graphQLErrors?.some(
            (err) =>
              err.extensions?.code === 'FORBIDDEN' ||
              err.extensions?.code === 'UNAUTHORIZED'
          )
        ) {
          localStorage.removeItem('zottrAdminAuthToken');
          navigate('/login', { replace: true });
        }
      },
    }
  );

  const [updateOrder] = useMutation(UPDATE_ORDER_CUSTOM_FIELDS);

  const lastOrderRef = useRef();

  useEffect(() => {
    const loadMore = () => {
      if (loadingMore || !hasMore) return;
      setLoadingMore(true);
      fetchMore({
        variables: {
          options: {
            skip: orders.length,
            take: ITEMS_PER_LOAD,
            filter: filterString,
            sort: { createdAt: 'DESC' },
          },
        },
      })
        .then(({ data: fetchedData }) => {
          const newOrders = fetchedData.orders.items;
          setOrders((prevOrders) => [...prevOrders, ...newOrders]);
          setHasMore(
            fetchedData.orders.items.length + orders.length <
              fetchedData.orders.totalItems
          );
        })
        .catch((error) => {
          console.error('Error fetching more orders:', error);
        })
        .finally(() => {
          setLoadingMore(false);
        });
    };

    if (loading || !hasMore) return;

    const handleIntersect = (entries) => {
      const [entry] = entries;
      if (entry.isIntersecting) {
        loadMore();
      }
    };

    const currentObserver = new IntersectionObserver(handleIntersect, {
      root: null,
      rootMargin: '200px',
      threshold: 1.0,
    });

    if (lastOrderRef.current) {
      currentObserver.observe(lastOrderRef.current);
    }

    return () => {
      if (lastOrderRef.current) {
        currentObserver.unobserve(lastOrderRef.current);
      }
    };
  }, [orders, hasMore, loadingMore, loading, fetchMore, filterString]);

  const changeOrderListOption = (event) => {
    if (event.target.value == 'all') {
      setFilterString({
        adminId: { eq: adminUser?.id },
        adminStatus: { in: ['new', 'accepted', 'rejected', 'delivered'] },
      });
    } else {
      setFilterString({
        adminId: { eq: adminUser?.id },
        adminStatus: { eq: event.target.value },
      });
    }
    setOrderListOption(event.target.value);
    setOrders([]);
  };

  const handleUpdateOrder = async (id, newStatus) => {
    try {
      const { data } = await updateOrder({
        variables: {
          input: {
            id,
            customFields: {
              adminStatus: newStatus, // Example field update
            },
          },
        },
      });

      // Update local state
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order.id === id
            ? { ...order, customFields: data.setOrderCustomFields.customFields }
            : order
        )
      );
    } catch (err) {
      console.error('Error updating order:', err.message);
    }
  };

  if (error) return <p>Error loading orders: {error.message}</p>;

  return (
    <>
      <MainAppBar />
      <Box
        sx={{
          pt: 8,
          pb: 2,
          bgcolor: 'primary.surface',
        }}
      >
        <Container
          sx={{
            bgcolor: 'white',
            maxWidth: 'calc(100% - 24px)',
            // borderTopLeftRadius: '10px',
            // borderTopRightRadius: '10px',
            borderRadius: '10px',
            minHeight: '100vh',
            p: 1,
          }}
        >
          <Stack gap={1}>
            <OrdersBreadcrumbs />
            <Stack
              direction="row"
              sx={{ display: 'flex', alignItems: 'center' }}
            >
              <Typography
                variant="h6"
                color={theme.palette.grey[900]}
                sx={{
                  textAlign: 'center',
                  margin: 'auto',
                }}
              >
                Orders
              </Typography>
            </Stack>
          </Stack>
          {/* {loading && (
            <Box sx={{ mt: 15 }}>
              <LoadingCircle message="Fetching orders..." />
            </Box>
          )} */}
          <Grid container sx={{ my: 2 }}>
            <Grid item xs={5}>
              <Container>
                <Select
                  variant="outlined"
                  value={orderListOption}
                  onChange={changeOrderListOption}
                  size="small"
                  sx={{
                    backgroundColor: 'transparent', // Remove any background color
                    '&:hover': {
                      backgroundColor: 'transparent', // No hover background color
                    },
                    '&.Mui-focused': {
                      backgroundColor: 'transparent', // No focus background color
                    },
                    '& .MuiSelect-select': {
                      backgroundColor: 'transparent', // Ensure the inner select field is also transparent
                    },
                  }}
                >
                  <MenuItem value={'all'}>
                    <Typography variant="label2">All Orders</Typography>
                  </MenuItem>
                  <MenuItem value={'new'}>
                    <Typography variant="label2">New Orders </Typography>
                  </MenuItem>
                  <MenuItem value={'accepted'}>
                    <Typography variant="label2">Accepted Orders</Typography>
                  </MenuItem>
                  <MenuItem value={'rejected'}>
                    <Typography variant="label2">Rejected Orders</Typography>
                  </MenuItem>
                  <MenuItem value={'delivered'}>
                    <Typography variant="label2">Completed Orders</Typography>
                  </MenuItem>
                </Select>
              </Container>
            </Grid>
          </Grid>
          <Stack
            gap={1}
            sx={{
              display: 'flex',
              width: '100%',
              mt: 3,
            }}
          >
            {loading && <OrdersSkeleton />}
            {!loading && (
              <Stack
                direction="column"
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  overflow: 'hidden',
                  width: '100%',
                }}
              >
                {/*directly display orders using data variable while orders state is being updated in apollo request's onCompleted function, this ensures there won't be any lags displaying data after loading is completed*/}
                {orders.length === 0 &&
                  data.orders?.items?.map((order, index) => (
                    <div
                      ref={index === orders.length - 1 ? lastOrderRef : null}
                      key={order.id}
                    >
                      <OrderItem order={order} />
                    </div>
                  ))}
                {/*use orders state variable to display orders once we have fetched some data.*/}
                {orders.length !== 0 &&
                  orders.map((order, index) => (
                    <div
                      ref={index === orders.length - 1 ? lastOrderRef : null}
                      key={order.id}
                    >
                      <OrderItem
                        order={order}
                        updateStatusById={handleUpdateOrder}
                      />
                      {index !== orders.length - 1 && <Divider />}
                    </div>
                  ))}
                {!hasMore && data?.orders?.totalItems > 5 && (
                  <Stack
                    direction="row"
                    sx={{
                      height: '50px',
                      display: 'flex',
                      alignItems: 'baseline',
                      justifyContent: 'center',
                    }}
                  >
                    <Typography variant="heavyb2" color="secondary.dark">
                      👀 You’ve seen it all!
                    </Typography>
                  </Stack>
                )}
                {orders.length === 0 &&
                  (data.orders == null || data.orders.items.length === 0) && (
                    <Box
                      display="flex"
                      justifyContent="center"
                      alignItems="center"
                      sx={{ mt: 10 }}
                    >
                      <Typography variant="h7" sx={{ color: 'grey.700' }}>
                        No orders found!
                      </Typography>
                    </Box>
                  )}
                {loadingMore && (
                  <Box sx={{ height: '50px', mt: 1 }}>
                    <LoadingCircle message="Loading more..." />
                  </Box>
                )}
              </Stack>
            )}
          </Stack>
        </Container>
      </Box>
    </>
  );
}

export default Orders;
