import ErrorAlert from './ErrorAlert';

export default function Error404Alert() {
  return (
    <ErrorAlert
      title="Error 404: Page not found"
      description="Please enter a valid web address."
      variant="outlined"
    />
  );
}
