import React, { useState } from 'react';
import {
  Box,
  Container,
  IconButton,
  MenuItem,
  Select,
  Stack,
  Typography,
} from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import Grid from '@mui/material/Grid';
import OrderItem from './OrderItem';
import MainAppBar from '../common/MainAppBar';
import WestIcon from '@mui/icons-material/West';

function Orders() {
  const [orderListOption, setOrderListOption] = React.useState(1);
  const changeOrderListOption = (event) => {
    setOrderListOption(event.target.value);
  };

  const [orders, setOrders] = useState([
    {
      id: '1',
      date: '20/12/2024, 12:00 PM',
      customer: 'Rohit',
      phone: 9900964834,
      address: 'GA-102, Urbana Jewels, Jaipur',
      status: 'new',
      opened: false,
      items: [
        {
          name: 'Veg Burger',
          price: 20,
          quantity: 2,
        },
        {
          name: 'French Fries',
          price: 50,
          quantity: 1,
        },
        {
          name: 'Coca Cola',
          price: 5,
          quantity: 3,
        },
        {
          name: 'Veg Burger',
          price: 20,
          quantity: 2,
        },
        {
          name: 'French Fries',
          price: 50,
          quantity: 1,
        },
        {
          name: 'Coca Cola',
          price: 5,
          quantity: 3,
        },
        {
          name: 'Veg Burger',
          price: 20,
          quantity: 2,
        },
        {
          name: 'French Fries',
          price: 50,
          quantity: 1,
        },
        {
          name: 'Coca Cola',
          price: 5,
          quantity: 3,
        },
      ],
    },
    {
      id: '2',
      date: '20/12/2024, 12:00 PM',
      customer:
        'Mohit kumar ksdishdkskdhksdhshdshdkhkhkhkhkhsssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssss',
      phone: 9900964834,
      address:
        'GA-102, Urbana Jewels, JaipurGA-102, Urbana Jewels, JaipurGA-102, Urbana Jewels, JaipurGA-102, Urbana Jewels, JaipurGA-102, Urbana Jewels, JaipurGA-102, Urbana Jewels, JaipurGA-102, Urbana Jewels, JaipurGA-102, Urbana Jewels, JaipurGA-102, Urbana Jewels, JaipurGA-102, Urbana Jewels, JaipurGA-102, Urbana Jewels, Jaipur',
      status: 'new',
      opened: false,
      items: [
        {
          name: 'Veg Burger',
          price: 20,
          quantity: 2,
        },
        {
          name: 'French Fries',
          price: 50,
          quantity: 1,
        },
        {
          name: 'Coca Cola',
          price: 5,
          quantity: 3,
        },
      ],
    },
    {
      id: '3',
      date: '20/12/2024, 12:00 PM',
      customer: 'Shilpi',
      phone: 9900964834,
      address: 'GA-102, Urbana Jewels, Jaipur',
      status: 'new',
      opened: false,
      items: [
        {
          name: 'Veg Burger',
          price: 20,
          quantity: 2,
        },
        {
          name: 'French Fries',
          price: 50,
          quantity: 1,
        },
        {
          name: 'Coca Cola',
          price: 5,
          quantity: 3,
        },
      ],
    },
    {
      id: '4',
      date: '20/12/2024, 12:00 PM',
      customer: 'Pragya',
      phone: 9900964834,
      address: 'GA-102, Urbana Jewels, Jaipur',
      status: 'new',
      opened: false,
      items: [
        {
          name: 'Veg Burger',
          price: 20,
          quantity: 2,
        },
        {
          name: 'French Fries',
          price: 50,
          quantity: 1,
        },
        {
          name: 'Coca Cola',
          price: 5,
          quantity: 3,
        },
      ],
    },
    {
      id: '5',
      date: '20/12/2024, 12:00 PM',
      customer: 'Rohit',
      phone: 9900964834,
      address: 'GA-102, Urbana Jewels, Jaipur',
      status: 'new',
      opened: false,
      items: [
        {
          name: 'Veg Burger',
          price: 20,
          quantity: 2,
        },
        {
          name: 'French Fries',
          price: 50,
          quantity: 1,
        },
        {
          name: 'Coca Cola',
          price: 5,
          quantity: 3,
        },
      ],
    },
    {
      id: '6',
      date: '20/12/2024, 12:00 PM',
      customer: 'Rohit',
      phone: 9900964834,
      address: 'GA-102, Urbana Jewels, Jaipur',
      status: 'new',
      opened: false,
      items: [
        {
          name: 'Veg Burger',
          price: 20,
          quantity: 2,
        },
        {
          name: 'French Fries',
          price: 50,
          quantity: 1,
        },
        {
          name: 'Coca Cola',
          price: 5,
          quantity: 3,
        },
      ],
    },
    {
      id: '7',
      date: '20/12/2024, 12:00 PM',
      customer: 'Mohit',
      phone: 9900964834,
      address: 'GA-102, Urbana Jewels, Jaipur',
      status: 'new',
      opened: false,
      items: [
        {
          name: 'Veg Burger',
          price: 20,
          quantity: 2,
        },
        {
          name: 'French Fries',
          price: 50,
          quantity: 1,
        },
        {
          name: 'Coca Cola',
          price: 5,
          quantity: 3,
        },
      ],
    },
    {
      id: '8',
      date: '20/12/2024, 12:00 PM',
      customer: 'Shilpi',
      phone: 9900964834,
      address: 'GA-102, Urbana Jewels, Jaipur',
      status: 'new',
      opened: false,
      items: [
        {
          name: 'Veg Burger',
          price: 20,
          quantity: 2,
        },
        {
          name: 'French Fries',
          price: 50,
          quantity: 1,
        },
        {
          name: 'Coca Cola',
          price: 5,
          quantity: 3,
        },
      ],
    },
    {
      id: '9',
      date: '20/12/2024, 12:00 PM',
      customer: 'Pragya',
      phone: 9900964834,
      address: 'GA-102, Urbana Jewels, Jaipur',
      status: 'new',
      opened: false,
      items: [
        {
          name: 'Veg Burger',
          price: 20,
          quantity: 2,
        },
        {
          name: 'French Fries',
          price: 50,
          quantity: 1,
        },
        {
          name: 'Coca Cola',
          price: 5,
          quantity: 3,
        },
      ],
    },
    {
      id: '10',
      date: '20/12/2024, 12:00 PM',
      customer: 'Rohit',
      phone: 9900964834,
      address: 'GA-102, Urbana Jewels, Jaipur',
      status: 'new',
      opened: false,
      items: [
        {
          name: 'Veg Burger',
          price: 20,
          quantity: 2,
        },
        {
          name: 'French Fries',
          price: 50,
          quantity: 1,
        },
        {
          name: 'Coca Cola',
          price: 5,
          quantity: 3,
        },
      ],
    },
  ]);

  // Function to fetch the status of an order by id
  // const getStatusById = (id) => {
  //   const order = orders.find((order) => order.id === id);
  //   return order ? order.status : null; // Return status or null if order not found
  // };

  // Function to update the status of an order by id
  const updateStatusById = (id, newStatus) => {
    setOrders((prevOrders) =>
      prevOrders.map((order) =>
        order.id === id ? { ...order, status: newStatus } : order
      )
    );
  };

  // const updateOpenedById = (id, newOpened) => {
  //   setOrders((prevOrders) =>
  //     prevOrders.map((order) =>
  //       order.id === id ? { ...order, opened: newOpened } : order
  //     )
  //   );
  // };

  return (
    <>
      <MainAppBar />
      <Stack
        spacing={2}
        sx={{
          marginTop: '80px',
          display: 'flex',
          width: '100%',
        }}
      >
        <Stack
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
        </Stack>
        <Grid container>
          <Grid item xs={5}>
            <Container>
              <Select
                variant="standard"
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
                <MenuItem value={1}>All Orders</MenuItem>
                <MenuItem value={2}>New Orders</MenuItem>
                <MenuItem value={3}>Accepted Orders</MenuItem>
                <MenuItem value={4}>Rejected Orders</MenuItem>{' '}
                <MenuItem value={5}>Completed Orders</MenuItem>
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
            <OrderItem
              order={order}
              updateStatusById={updateStatusById}
              // updateOpenedById={updateOpenedById}
            />
          ))}
        </Stack>
      </Stack>
    </>
  );
}

export default Orders;
