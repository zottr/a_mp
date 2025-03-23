import ErrorAlert from './ErrorAlert';

export default function ServiceErrorAlert() {
  return (
    <ErrorAlert
      title="Oops! Something went wrong"
      description="Please try again after some time."
    />
  );
}
