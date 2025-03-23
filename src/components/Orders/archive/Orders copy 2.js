import React, { useRef, useEffect, useState } from 'react';
import { useLazyQuery, useMutation } from '@apollo/client';
import {
  Box,
  Container,
  IconButton,
  MenuItem,
  Select,
  Stack,
  Typography,
  CircularProgress,
} from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import Grid from '@mui/material/Grid';
import OrderItem from '../OrderItem';
import WestIcon from '@mui/icons-material/West';
import {
  GET_ORDERS_LIST,
  UPDATE_ORDER_CUSTOM_FIELDS,
} from '../../../libs/graphql/definitions/order-definitions';

function Orders() {
  const ITEMS_PER_LOAD = 10;
  const [filterString, setFilterString] = React.useState({
    adminStatus: { in: ['new', 'accepted', 'rejected', 'completed'] },
  });
  const [orderListOption, setOrderListOption] = React.useState('all');
  const [orders, setOrders] = useState([]);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);

  const [getOrders, { loading, error, data, fetchMore }] = useLazyQuery(
    GET_ORDERS_LIST,
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
    }
  );

  const [updateOrder] = useMutation(UPDATE_ORDER_CUSTOM_FIELDS);

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

  const lastOrderRef = useRef();

  useEffect(() => {
    getOrders();
  }, []);

  useEffect(() => {
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
  }, [orders, hasMore, loadingMore, loading]);

  const changeOrderListOption = (event) => {
    if (event.target.value == 'all') {
      setFilterString({
        adminStatus: { in: ['new', 'accepted', 'rejected', 'completed'] },
      });
    } else {
      setFilterString({ adminStatus: { eq: event.target.value } });
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
      <Box sx={{ position: 'relative' }}>
        {/* Loading Overlay */}
        {loading && (
          <Box
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              backgroundColor: 'rgba(255, 255, 255, 0.8)',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              zIndex: 10,
            }}
          >
            <CircularProgress />
          </Box>
        )}
        <Stack
          gap={1}
          sx={{
            display: 'flex',
            width: '100%',
          }}
        >
          {/* <Stack
            direction="row"
            sx={{
              alignItems: 'center',
              // paddingBottom: '20px',
              display: 'flex',
            }}
          >
            <RouterLink
              to={'/home'}
              style={{ textDecoration: 'none', margin: 0 }}
            >
              <Box display="flex" alignItems="center">
                <IconButton sx={{ position: 'absolute', marginLeft: '30px' }}>
                  <WestIcon
                    fontSize="medium"
                    sx={{
                      color: 'brown',
                    }}
                  />
                </IconButton>
              </Box>
            </RouterLink>
            <Typography
              variant="h4"
              sx={{
                fontColor: 'black',
                textAlign: 'center',
                margin: 'auto',
              }}
            >
              Orders
            </Typography>
          </Stack> */}
          <Grid container>
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
                  <MenuItem value={'completed'}>
                    <Typography variant="label2">Completed Orders</Typography>
                  </MenuItem>
                </Select>
              </Container>
            </Grid>
            <Grid item xs={8}></Grid>
          </Grid>
          <Stack
            direction="column"
            //gap={2}
            sx={{
              display: 'flex',
              flexDirection: 'column',
              overflowX: 'hidden',
            }}
          >
            {orders.map((order, index) => (
              <div
                ref={index === orders.length - 1 ? lastOrderRef : null}
                key={order.id}
              >
                <OrderItem order={order} updateStatusById={handleUpdateOrder} />
              </div>
            ))}
          </Stack>
        </Stack>
      </Box>
    </>
  );
}

export default Orders;
