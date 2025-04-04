import { useEffect, useState } from 'react';
import MainAppBar from '../common/MainAppBar';
import {
  Box,
  CircularProgress,
  Container,
  Stack,
  Typography,
  useTheme,
} from '@mui/material';
import StyledTextField from '../common/styled/StyledTextField';
import LoadingButton from '../common/LoadingButton';
import { useUserContext } from '../../hooks/useUserContext';
import { UPDATE_ACTIVE_ADMINISTRATOR } from '../../libs/graphql/definitions/administrator-definitions';
import { ApolloError, useMutation } from '@apollo/client';
import CustomSnackBar from '../common/Snackbars/CustomSnackBar';

import ValidationErrorAlert from '../common/Alerts/ValidationErrorAlert';
import ServiceErrorAlert from '../common/Alerts/ServiceErrorAlert';
import AccountSettingsBreadcrumbs from './AccountSettingsBreadcrumbs';

interface AccountSettingsProp {
  type: any;
}

const AccountSettings: React.FC<AccountSettingsProp> = ({ type }) => {
  const theme = useTheme();
  const { adminUser, setAdminUser } = useUserContext();
  const [loading, setLoading] = useState(true);
  const initialSettings = {
    name: '',
    admin: '',
    address: '',
  };

  const [updateUser] = useMutation(UPDATE_ACTIVE_ADMINISTRATOR);

  const [settings, setSettings] = useState(initialSettings);
  const [updating, setUpdating] = useState(false);
  const [updated, setUpdated] = useState(false);

  //Update settings when adminUser changes
  useEffect(() => {
    if (adminUser) {
      setSettings({
        name: adminUser?.customFields.businessName,
        admin: adminUser?.firstName,
        address: adminUser?.customFields.businessAddress,
      });
      setLoading(false); //Data fetched, stop loading
    }
  }, [adminUser]);

  const [validationErrors, setValidationErrors] = useState({
    name: false,
    admin: false,
    address: false,
  });
  const [serviceError, setServiceError] = useState(false);
  const [hasValidationErrors, setHasValidationErrors] = useState(false);

  const validationErrorMessages = {
    name: 'Your business name cannot be empty',
    admin: 'Your name cannot be empty',
    address: 'Your Address cannot be empty',
  };

  const resetFormStates = () => {
    setServiceError(false);
    setUpdated(false);
    setUpdating(false);
    setValidationErrors({
      name: false,
      admin: false,
      address: false,
    });
    setHasValidationErrors(false);
  };

  const handleChangeSettings = (event: any) => {
    const { name, value } = event.target;
    setSettings((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (event: any) => {
    event.preventDefault();
    resetFormStates();
    if (settings.admin === '') {
      setValidationErrors((prev) => ({
        ...prev,
        admin: true,
      }));
    }
    if (settings.name === '') {
      setValidationErrors((prev) => ({
        ...prev,
        name: true,
      }));
    }
    if (settings.address === '') {
      setValidationErrors((prev) => ({
        ...prev,
        address: true,
      }));
    }

    if (
      settings.admin !== '' &&
      settings.name !== '' &&
      settings.address !== ''
    ) {
      setUpdating(true);
      try {
        const adminInput = {
          firstName: settings.admin,
          customFields: {
            businessName: settings.name,
            businessAddress: settings.address,
          },
        };
        const result = await updateUser({
          variables: {
            input: adminInput,
          },
        });

        //update local admin user state
        if (result.data) {
          setAdminUser((prev) => {
            if (!prev) return prev; // Avoid modifying if `prev` is null
            return {
              ...prev,
              firstName: result.data.updateActiveAdministrator.firstName,
              customFields: {
                ...prev.customFields,
                businessName:
                  result.data.updateActiveAdministrator.customFields
                    .businessName,
                businessAddress:
                  result.data.updateActiveAdministrator.customFields
                    .businessAddress,
              },
            };
          });
        }

        setUpdated(true);
      } catch (err) {
        console.error(err);
        setServiceError(true);
      }
    } else {
      setHasValidationErrors(true);
    }
    setUpdating(false);
  };

  return (
    <>
      <MainAppBar />
      <Box
        sx={{
          pt: 8,
          pb: 2,
          bgcolor: 'primary.surface',
        }}
      >
        <Container
          sx={{
            bgcolor: 'white',
            maxWidth: 'calc(100% - 24px)',
            minHeight: '100vh',
            // borderTopLeftRadius: '10px',
            // borderTopRightRadius: '10px',
            borderRadius: '10px',
            p: 1,
          }}
        >
          <Stack sx={{}} gap={2}>
            <AccountSettingsBreadcrumbs type={type} />
            <Stack
              direction="row"
              sx={{ display: 'flex', alignItems: 'center' }}
            >
              <Typography
                variant="h6"
                color={theme.palette.grey[900]}
                sx={{
                  textAlign: 'center',
                  margin: 'auto',
                }}
              >
                Account Settings
              </Typography>
            </Stack>
          </Stack>
          {loading && (
            <Box
              sx={{
                mt: '40%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <CircularProgress size={50} thickness={5} />
            </Box>
          )}
          {!loading && (
            <Container sx={{ px: 3 }}>
              <Stack
                component="form"
                noValidate
                autoComplete="off"
                onSubmit={handleSubmit}
                gap={3}
                sx={{ mt: 3, display: 'flex', alignItems: 'center' }}
              >
                <Stack width="100%" gap={1}>
                  <Typography variant="heavylabel1" color="grey.800">
                    Your Business Name
                  </Typography>
                  <StyledTextField
                    id="name"
                    name="name"
                    variant="outlined"
                    value={settings.name}
                    onChange={handleChangeSettings}
                    placeholder="Enter name of your business"
                    size="small"
                    helperText={
                      validationErrors.name && validationErrorMessages.name
                    }
                    error={validationErrors.name}
                    sx={{
                      width: '100%',
                      '& input::placeholder': {
                        color: 'grey.900', // Change placeholder color
                        fontSize: '1rem', // Adjust font size if needed
                        fontStyle: 'italic', // Optional: Make it italic
                        fontFamily: 'Poppins, sans-serif',
                      },
                    }}
                  />
                </Stack>
                <Stack width="100%" gap={1}>
                  <Typography variant="heavylabel1" color="grey.800">
                    Your Name
                  </Typography>
                  <StyledTextField
                    id="admin"
                    name="admin"
                    variant="outlined"
                    value={settings.admin}
                    onChange={handleChangeSettings}
                    placeholder="Enter your name"
                    size="small"
                    helperText={
                      validationErrors.admin && validationErrorMessages.admin
                    }
                    error={validationErrors.admin}
                    sx={{
                      width: '100%',
                      '& input::placeholder': {
                        color: 'grey.900', // Change placeholder color
                        fontSize: '1rem', // Adjust font size if needed
                        fontStyle: 'italic', // Optional: Make it italic
                        fontFamily: 'Poppins, sans-serif',
                      },
                    }}
                  />
                </Stack>
                <Stack width="100%" gap={1}>
                  <Typography variant="heavylabel1" color="grey.800">
                    Your Address
                  </Typography>
                  <StyledTextField
                    id="address"
                    name="address"
                    variant="outlined"
                    value={settings.address}
                    multiline
                    rows={3}
                    onChange={handleChangeSettings}
                    placeholder="Where are you located?"
                    size="small"
                    helperText={
                      validationErrors.address &&
                      validationErrorMessages.address
                    }
                    error={validationErrors.address}
                    sx={{
                      width: '100%',
                      '& input::placeholder': {
                        color: 'grey.900', // Change placeholder color
                        fontSize: '1rem', // Adjust font size if needed
                        fontStyle: 'italic', // Optional: Make it italic
                        fontFamily: 'Poppins, sans-serif',
                      },
                    }}
                  />
                </Stack>
                {hasValidationErrors && <ValidationErrorAlert />}
                {serviceError && <ServiceErrorAlert />}
                <LoadingButton
                  loading={updating}
                  variant="contained"
                  onClick={() => {}}
                  type="submit"
                  buttonStyles={{
                    backgroundColor: 'primary.main',
                    borderRadius: '25px',
                  }}
                  buttonContainerStyles={{
                    width: '100%',
                    height: '55px',
                  }}
                  label="Update Settings"
                  labelStyles={{
                    color: 'white',
                  }}
                  labelVariant="button1"
                  progressSize={24}
                  progressThickness={5}
                  progressStyles={{
                    color: 'white',
                  }}
                />
                <CustomSnackBar
                  message="Settings updated successfully"
                  severity="success"
                  duration={2000}
                  vertical="top"
                  horizontal="center"
                  open={updated}
                  handleClose={() => {
                    setUpdated(false);
                  }}
                />
              </Stack>
            </Container>
          )}
        </Container>
      </Box>
    </>
  );
};

export default AccountSettings;
