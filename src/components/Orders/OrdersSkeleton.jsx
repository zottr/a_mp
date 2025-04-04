import { Grid, Skeleton, Divider, Stack, Box } from '@mui/material';

function OrderSkeletonItem() {
  return (
    <Grid
      container
      sx={{ width: '100%', display: 'flex', alignItems: 'center' }}
      spacing={1}
    >
      <Grid item xs={8}>
        <Stack gap={1.5}>
          <Skeleton variant="rounded" width="100%" height="2rem" />
          <Skeleton variant="rounded" width="100%" height="1.4rem" />
        </Stack>
      </Grid>
      <Grid item xs={4}>
        <Stack gap={1.5}>
          <Skeleton variant="rounded" width="100%" height="2rem" />
          <Skeleton variant="rounded" width="100%" height="1.4rem" />
        </Stack>
      </Grid>
    </Grid>
  );
}

function OrdersSkeleton() {
  const numberOfItems = 6;
  return (
    <Stack
      gap={3}
      direction="column"
      sx={{
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        width: '100%',
      }}
    >
      {Array.from({ length: numberOfItems }).map((_, index) => (
        <Box key={index}>
          <OrderSkeletonItem />
          {/* {index < numberOfItems - 1 && <Divider sx={{ mt: 1.5 }} />} */}
        </Box>
      ))}
    </Stack>
  );
}

export default OrdersSkeleton;
