import ErrorAlert from './ErrorAlert';

export default function ValidationErrorAlert() {
  return (
    <ErrorAlert
      title="There are items that require your attention"
      description="Enter correct form details and try again."
    />
  );
}
