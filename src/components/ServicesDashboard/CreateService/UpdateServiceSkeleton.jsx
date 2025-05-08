import { Container, Skeleton, Stack } from '@mui/material';

function UpdateItemSkeleton() {
  return (
    <>
      <Container sx={{ px: 1 }}>
        <Stack gap={5} sx={{ mt: 5, display: 'flex', alignItems: 'center' }}>
          <Stack sx={{ width: '100%' }}>
            <Skeleton variant="text" width="40%" animation="wave" />
            <Skeleton
              variant="rounded"
              width="100%"
              height="2.7rem"
              animation="wave"
            />
          </Stack>
          <Stack sx={{ width: '100%' }}>
            <Skeleton variant="text" width="40%" animation="wave" />
            <Skeleton
              variant="rounded"
              width="100%"
              height="220px"
              animation="wave"
            />
          </Stack>
          <Stack sx={{ width: '100%' }}>
            <Skeleton variant="text" width="40%" animation="wave" />
            <Skeleton
              variant="rounded"
              width="100%"
              height="2.7rem"
              animation="wave"
            />
          </Stack>
          <Stack sx={{ width: '100%' }}>
            <Skeleton variant="text" width="40%" animation="wave" />
            <Skeleton
              variant="rounded"
              width="100%"
              height="3.7rem"
              animation="wave"
            />
          </Stack>
        </Stack>
      </Container>
    </>
  );
}

export default UpdateItemSkeleton;
