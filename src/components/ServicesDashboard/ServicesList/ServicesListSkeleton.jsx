import { Grid, Skeleton, Divider } from '@mui/material';

function ServiceSkeletonItem() {
  return (
    <Grid
      container
      sx={{ width: '100%', display: 'flex', alignItems: 'center' }}
      spacing={1}
    >
      <Grid item xs={3}>
        <Skeleton variant="rounded" width="5rem" height="5rem" />
      </Grid>
      <Grid item xs={9}>
        <Skeleton variant="text" sx={{ fontSize: '1.2rem' }} />
      </Grid>
    </Grid>
  );
}

function ServicesListSkeleton() {
  const numberOfItems = 3;
  return (
    <>
      {Array.from({ length: numberOfItems }).map((_, index) => (
        <div key={index}>
          <ServiceSkeletonItem />
          {index < numberOfItems - 1 && <Divider sx={{ my: 2 }} />}
        </div>
      ))}
    </>
  );
}

export default ServicesListSkeleton;
