import {
  Box,
  Chip,
  Container,
  Grid,
  IconButton,
  Typography,
  useTheme,
} from '@mui/material';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { Link as RouterLink } from 'react-router-dom';

function OrderItem({ order }) {
  const theme = useTheme();
  let statusLabelColor = '#ffffff';
  let statusLabelTextColor = '#ffffff';
  let cellColor = 'hsl(0, 100%, 100%)';

  // if (order.opened) cellColor = 'hsl(0, 0%, 96%)';

  switch (order.customFields?.adminStatus) {
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
      >
        <Container>
          <Grid
            container
            component={RouterLink}
            to={`/order/${order.id}`}
            sx={{ textDecoration: 'none' }}
          >
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
                  {order.customer?.firstName}
                </Typography>
              </Grid>
              <Grid
                item
                xs={6}
                sx={{ display: 'flex', justifyContent: 'flex-end' }}
              >
                <Chip
                  label={order.customFields?.adminStatus}
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
                    {new Date(order.createdAt).toLocaleString()}
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
    </>
  );
}

export default OrderItem;
