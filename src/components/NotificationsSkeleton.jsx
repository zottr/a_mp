import { Container, Skeleton, Stack } from '@mui/material';

function NotificationsSkeleton() {
  return (
    <>
      <Skeleton variant="text" animation="wave" width="100%" />
      <Skeleton variant="text" animation="wave" width="100%" />
      <Skeleton variant="text" animation="wave" width="100%" />
    </>
  );
}

export default NotificationsSkeleton;
