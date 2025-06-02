import { Grid, Skeleton, Divider } from '@mui/material';

function ProductSkeletonItem() {
  return (
    <Grid
      container
      sx={{ width: '100%', display: 'flex', alignItems: 'center' }}
      spacing={1}
    >
      <Grid item xs={3}>
        <Skeleton
          variant="rounded"
          width="5rem"
          height="5rem"
          animation="wave"
        />
      </Grid>
      <Grid item xs={9}>
        <Skeleton variant="text" sx={{ fontSize: '1.2rem' }} animation="wave" />
      </Grid>
    </Grid>
  );
}

function ProductListSkeleton() {
  const numberOfItems = 4;
  return (
    <>
      {Array.from({ length: numberOfItems }).map((_, index) => (
        <div key={index}>
          <ProductSkeletonItem />
          {index < numberOfItems - 1 && <Divider sx={{ mt: 2.3 }} />}
        </div>
      ))}
    </>
  );
}

export default ProductListSkeleton;
