import ErrorAlert from './ErrorAlert';

export default function OTPExpiredErrorAlert() {
  return (
    <ErrorAlert
      title="Verification code expired"
      description="Generate a new verification code."
    />
  );
}
