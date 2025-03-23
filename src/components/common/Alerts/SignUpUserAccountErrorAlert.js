import ErrorAlert from './ErrorAlert';

export default function SignUpUserAccountErrorAlert({ phone }) {
  return (
    <ErrorAlert
      title={`${phone} is associated with an existing account`}
      description="Try to login or use a different number."
    />
  );
}
