import ErrorAlert from '../common/Alerts/ErrorAlert';

export default function OrderNotFoundAlert() {
  return (
    <ErrorAlert
      title={`Order not found!`}
      description="Verify and enter correct order URL."
    />
  );
}
