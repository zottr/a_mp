import ErrorAlert from './ErrorAlert';

export default function OTPInvalidErrorAlert() {
  return (
    <ErrorAlert
      title="Incorrect verification code"
      description="Enter correct code."
    />
  );
}
