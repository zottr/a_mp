import ErrorAlert from './ErrorAlert';

export default function LoginUserAccountErrorAlert({ phone }) {
  return (
    <ErrorAlert
      title={`${phone} is not registered with us.`}
      description="Try a registered number or create a new account."
    />
  );
}
