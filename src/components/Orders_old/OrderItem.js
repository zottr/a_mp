import {
  Box,
  Chip,
  Container,
  Drawer,
  Grid,
  IconButton,
  Slide,
  Typography,
  useTheme,
} from '@mui/material';
import { useState } from 'react';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import OrderDetails from './OrderDetails';

function OrderItem({ order, updateStatusById }) {
  const theme = useTheme();
  let statusLabelColor = '#ffffff';
  let statusLabelTextColor = '#ffffff';
  let cellColor = 'hsl(0, 100%, 100%)';

  if (order.opened) cellColor = 'hsl(0, 0%, 96%)';

  switch (order.status) {
    case 'accepted':
      statusLabelColor = 'hsl(122, 39%, 55%)';
      break;
    case 'rejected':
      statusLabelColor = 'hsl(150, 12%, 52%)';
      break;
    case 'new':
      statusLabelColor = 'hsl(0, 65%, 51%)';
      break;
    case 'completed':
      statusLabelColor = 'hsl(123,46.2%,33%)';
      break;
    default:
      statusLabelColor = '#ffffff';
  }

  let labelSx = {
    backgroundColor: statusLabelColor,
    color: statusLabelTextColor,
  };
  let cellSx = { backgroundColor: cellColor };

  //Order details drawer
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [slideIn, setSlideIn] = useState(false);
  const handleOpen = () => {
    setDrawerOpen(true); // Open the Drawer
    setTimeout(() => setSlideIn(true), 0); // Trigger the Slide animation
  };
  const handleClose = () => {
    setSlideIn(false); // Trigger the Slide close animation
    //setTimeout(() => setDrawerOpen(false), 300); // Close the Drawer after animation ends
    setDrawerOpen(false);
  };

  return (
    <>
      <Box
        sx={{
          ...cellSx,
          paddingBottom: '20px',
          paddingTop: '20px',
          transition: 'background-color 0.3s ease', // Smooth transition for color change
          '&:hover': {
            backgroundColor: 'rgba(0, 0, 0, 0.1)', // Background color on hover for desktop
          },
          '@media (hover: none)': {
            '&:active': {
              backgroundColor: 'rgba(0, 0, 0, 0.1)', // Background color on touch for mobile
            },
          },
        }}
        onClick={handleOpen}
      >
        <Container>
          <Grid container>
            <Grid item container spacing={1} alignItems={'center'} xs={11}>
              <Grid
                item
                xs={6}
                sx={{ display: 'flex', justifyContent: 'flex-start' }}
              >
                <Typography
                  variant="b1"
                  sx={{
                    color: 'black',
                    whiteSpace: 'nowrap', // Allows the text to wrap within the container
                    width: '100%', // Ensure the text takes up the full width of its container
                    textOverflow: 'ellipsis',
                    overflow: 'hidden',
                  }}
                >
                  {order.customer}
                </Typography>
              </Grid>
              <Grid
                item
                xs={6}
                sx={{ display: 'flex', justifyContent: 'flex-end' }}
              >
                <Chip
                  label={order.status}
                  size="small"
                  variant="filled"
                  sx={{ borderRadius: '5px', ...labelSx }}
                />
              </Grid>
              <Grid
                item
                xs={6}
                sx={{ display: 'flex', justifyContent: 'flex-start' }}
              >
                <Box>
                  <Typography
                    variant="b2"
                    color={theme.palette.grey[600]}
                    noWrap
                  >
                    {order.date}
                  </Typography>
                </Box>
              </Grid>
              <Grid
                item
                xs={6}
                sx={{ display: 'flex', justifyContent: 'flex-end' }}
              >
                <Box>
                  <Typography
                    variant="heavyb2"
                    color={theme.palette.grey[600]}
                    sx={{
                      width: '100%',
                      textWrap: 'wrap',
                      wordWrap: 'break-word',
                    }}
                  >
                    Order#{order.id}
                  </Typography>
                </Box>
              </Grid>
            </Grid>
            <Grid item xs={1}>
              <IconButton aria-label="order details">
                <ChevronRightIcon fontSize="medium" />
              </IconButton>
            </Grid>
          </Grid>
        </Container>
      </Box>
      <Drawer
        anchor="right"
        open={drawerOpen}
        onClose={handleClose}
        variant="temporary"
        ModalProps={{
          keepMounted: true, // Keeps the Drawer mounted
        }}
        PaperProps={{
          sx: {
            width: '100%',
            height: '100%',
            display: 'flex',
            overflowY: 'auto', // Make the content scrollable when it's larger than the screen
            padding: 0, // No padding for full width
          },
        }}
      >
        {/* The Slide transition wraps the content */}
        <Slide in={slideIn} direction={slideIn ? 'left' : 'right'}>
          <Box
            sx={{
              paddingY: 3,
              width: '100%',
              height: '100%',
              bgcolor: 'background.paper',
            }}
          >
            <OrderDetails
              order={order}
              close={handleClose}
              updateStatusById={updateStatusById}
              // updateOpenedById={updateOpenedById}
            />
          </Box>
        </Slide>
      </Drawer>
    </>
  );
}

export default OrderItem;
