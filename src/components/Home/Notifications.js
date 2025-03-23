import {
  Alert,
  Box,
  Button,
  Container,
  Divider,
  Grid,
  Paper,
  Stack,
  Typography,
} from '@mui/material';
import ArrowRightIcon from '@mui/icons-material/ArrowRight';
import NewReleasesIcon from '@mui/icons-material/NewReleases';
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';

function Notifications() {
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
      <Stack
        sx={{
          mt: 1,
          display: 'flex',
          alignItems: 'flex-start',
        }}
      >
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
            <NewReleasesIcon fontSize="medium" sx={{ color: 'success.main' }} />
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
            <Button sx={{ color: 'primary.main' }}>
              <Typography variant="button2">View Orders</Typography>
            </Button>
          </Grid>
        </Grid>
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
              Add a store logo
            </Typography>
            <Button sx={{ color: 'primary.main' }}>
              <Typography variant="button2">Add Logo</Typography>
            </Button>
          </Grid>
        </Grid>
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
            <Button sx={{ color: 'primary.main' }}>
              <Typography variant="button2">Update UPI</Typography>
            </Button>
          </Grid>
        </Grid>
        {/* <Stack
              direction="row"
              sx={{
                display: 'flex',
                alignItems: 'center',
                width: '100%',
                justifyContent: 'space-between',
              }}
            >
              <Stack direction="row" gap={1}>
                <NewReleasesIcon
                  fontSize="medium"
                  sx={{ color: 'success.light' }}
                />
                <Typography variant="b2">You have new orders!</Typography>
              </Stack>
              <Button>
                <Typography variant="button2">View Orders</Typography>
              </Button>
            </Stack>
            <Divider />
            <Stack
              direction="row"
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                width: '100%',
              }}
            >
              <Stack direction="row" gap={1}>
                <FiberManualRecordIcon
                  sx={{
                    color: 'error.main',
                    fontSize: '12px',
                  }}
                />
                <Typography variant="b2">Add a store logo</Typography>
              </Stack>
              <Button>
                <Typography variant="button2">View Orders</Typography>
              </Button>
            </Stack>
            <Divider />
            <Stack
              direction="row"
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                width: '100%',
              }}
            >
              <FiberManualRecordIcon
                sx={{
                  color: 'error.main',
                  fontSize: '12px',
                }}
              />
              <Typography variant="b2">Update UPI information</Typography>
              <Button>
                <Typography variant="button2">View Orders</Typography>
              </Button>
            </Stack> */}
      </Stack>
    </>
  );
}

export default Notifications;
