import { Container, Skeleton, Stack } from '@mui/material';

function OrderDetailsSkeleton() {
  return (
    <>
      <Container sx={{ px: 3 }}>
        <Stack gap={2} sx={{ mt: 2, display: 'flex', alignItems: 'center' }}>
          <Stack
            direction="row"
            sx={{
              width: '100%',
              display: 'flex',
              justifyContent: 'flex-end',
            }}
          >
            <Skeleton
              variant="rounded"
              animation="wave"
              width="40%"
              height="2.5rem"
            />
          </Stack>
          <Stack sx={{ width: '100%' }}>
            <Skeleton
              variant="rounded"
              animation="wave"
              width="45%"
              height="1.5rem"
            />
            <Skeleton variant="text" width="45%" animation="wave" />
            <Skeleton variant="text" width="45%" animation="wave" />
            <Skeleton variant="text" width="45%" animation="wave" />
          </Stack>
          <Stack
            sx={{
              width: '100%',
              display: 'flex',
              justifyContent: 'space-between',
            }}
            direction="row"
          >
            <Skeleton
              variant="rounded"
              width="45%"
              height="3rem"
              sx={{ borderRadius: '25px' }}
              animation="wave"
            />
            <Skeleton
              variant="rounded"
              width="45%"
              height="3rem"
              sx={{ borderRadius: '25px' }}
              animation="wave"
            />
          </Stack>
          <Stack sx={{ width: '100%' }}>
            <Skeleton
              variant="rounded"
              width="45%"
              height="1.8rem"
              sx={{ mb: 1 }}
              animation="wave"
            />
            <Skeleton variant="text" width="40%" animation="wave" />
            <Skeleton
              variant="rounded"
              width="100%"
              height="2rem"
              animation="wave"
            />
            <Skeleton variant="text" width="40%" animation="wave" />
            <Skeleton
              variant="rounded"
              width="100%"
              height="2rem"
              animation="wave"
            />
            <Skeleton variant="text" width="40%" animation="wave" />
            <Skeleton
              variant="rounded"
              width="100%"
              height="2rem"
              animation="wave"
            />
            <Skeleton variant="text" width="40%" animation="wave" />
            <Skeleton
              variant="rounded"
              width="100%"
              height="2rem"
              animation="wave"
            />
          </Stack>
        </Stack>
      </Container>
    </>
  );
}

export default OrderDetailsSkeleton;
