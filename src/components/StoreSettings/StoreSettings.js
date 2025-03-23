import React, { useEffect, useState } from 'react';
import MainAppBar from '../common/MainAppBar';
import {
  Alert,
  Avatar,
  Box,
  Button,
  CircularProgress,
  Container,
  Snackbar,
  Stack,
  Typography,
  useTheme,
} from '@mui/material';
import StyledTextField from '../common/styled/StyledTextField';
import LoadingButton from '../common/LoadingButton';
import StoreIcon from '@mui/icons-material/Store';
import StorefrontIcon from '@mui/icons-material/Storefront';
import { useUserContext } from '../../hooks/useUserContext';
import { UPDATE_ACTIVE_ADMINISTRATOR } from '../../libs/graphql/definitions/administrator-definitions';
import { ApolloError, useMutation } from '@apollo/client';
import CustomSnackBar from '../common/Snackbars/CustomSnackBar';
import {
  CREATE_ASSETS,
  DELETE_ASSETS,
} from '../../libs/graphql/definitions/product-definitions';
import ValidationErrorAlert from '../common/Alerts/ValidationErrorAlert';
import ServiceErrorAlert from '../common/Alerts/ServiceErrorAlert';
import StoreSettingsBreadcrumbs from './StoreSettingsBreadcrumbs';
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';

const StoreSettings = () => {
  const theme = useTheme();
  const { adminUser, setAdminUser } = useUserContext();
  const [loading, setLoading] = useState(true);
  const initialSettings = {
    name: '',
    admin: '',
    address: '',
  };

  const [updateUser] = useMutation(UPDATE_ACTIVE_ADMINISTRATOR);
  const [createAssets] = useMutation(CREATE_ASSETS);
  const [deleteAssets] = useMutation(DELETE_ASSETS);

  const [settings, setSettings] = useState(initialSettings);
  const [updating, setUpdating] = useState(false);
  const [updated, setUpdated] = useState(false);

  const [logo, setLogo] = useState(null);
  const [logoId, setLogoId] = useState('');
  const [logoPreview, setLogoPreview] = useState('');
  const [newLogo, setNewLogo] = useState(false);
  const [deleteLogo, setDeleteLogo] = useState(false);

  //Update settings when adminUser changes
  useEffect(() => {
    if (adminUser) {
      setSettings({
        name: adminUser?.customFields.businessName,
        admin: adminUser?.firstName,
        address: adminUser?.customFields.businessAddress,
      });
      if (adminUser?.customFields?.businessLogo) {
        setLogoPreview(adminUser?.customFields?.businessLogo?.preview);
        setLogo(adminUser?.customFields?.businessLogo);
        setLogoId(adminUser?.customFields?.businessLogo?.id);
      }
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
    name: 'Store name cannot be empty',
    admin: 'Admin name cannot be empty',
    address: 'Address cannot be empty',
  };

  const resetFormStates = () => {
    setServiceError(false);
    setUpdated(false);
    setUpdating(false);
    setValidationErrors((prev) =>
      Object.keys(prev).reduce((acc, key) => {
        acc[key] = false;
        return acc;
      }, {})
    );
    setHasValidationErrors(false);
  };

  const handleChangeSettings = (event) => {
    const { name, value } = event.target;
    setSettings((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
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
        let assetId = logoId;
        if (deleteLogo) assetId = '';
        if (newLogo) {
          const assetResult = await createAssets({
            variables: {
              input: Array.from([logo]).map((file) => ({
                file,
              })),
            },
          });
          assetId = assetResult?.data?.createAssets?.[0].id;
          setLogoId(assetId);
        }
        const adminInput = {
          firstName: settings.admin,
          customFields: {
            businessName: settings.name,
            businessAddress: settings.address,
            businessLogoId: assetId,
          },
        };
        const result = await updateUser({
          variables: {
            input: adminInput,
          },
        });
        setUpdated(true);
        if (deleteLogo) {
          await deleteAssets({
            variables: {
              input: {
                assetIds: [logoId],
                force: true,
                deleteFromAllChannels: true,
              },
            },
          });
        }
      } catch (err) {
        console.error(err);
        setServiceError(true);
      } finally {
        setNewLogo(false);
        setDeleteLogo(false);
      }
    } else {
      setHasValidationErrors(true);
    }
    setUpdating(false);
  };

  function onLogoUpload(event) {
    const { target } = event;
    if (target.validity.valid) {
      const { files } = target;
      setLogo(files[0]);
      setLogoPreview(URL.createObjectURL(files[0]));
      setNewLogo(true);
      setDeleteLogo(false);
    }
    //event.target.value = null;
  }

  return (
    <>
      <MainAppBar />
      <Box sx={{ mb: 5 }}>
        <Stack sx={{ mt: 10 }} gap={2}>
          <StoreSettingsBreadcrumbs />
          <Stack direction="row" sx={{ display: 'flex', alignItems: 'center' }}>
            <Typography
              variant="h5"
              color={theme.palette.grey[900]}
              sx={{
                textAlign: 'center',
                margin: 'auto',
              }}
            >
              Store Settings
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
                  Store Name
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
                  Store Manager Name
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
                  Store Address
                </Typography>
                <StyledTextField
                  id="address"
                  name="address"
                  variant="outlined"
                  value={settings.address}
                  multiline
                  rows={3}
                  onChange={handleChangeSettings}
                  placeholder="Where is your store located?"
                  size="small"
                  helperText={
                    validationErrors.address && validationErrorMessages.address
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
              <Stack width="100%">
                <Typography variant="heavylabel1" color="grey.800">
                  Store Logo
                </Typography>
              </Stack>
              <Stack
                direction="row"
                gap={3}
                sx={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                }}
              >
                <Avatar
                  variant="circular"
                  src={logoPreview}
                  sx={{
                    width: '100px',
                    height: '100px',
                    padding: 1.5,
                    bgcolor:
                      logoPreview !== '' ? 'transparent' : 'primary.surface',
                    // border: '1px solid grey',
                    '& img': {
                      objectFit: 'contain', // Ensures image covers the Avatar
                      objectPosition: 'center', // Centers the image focus
                    },
                  }}
                >
                  <StoreIcon sx={{ fontSize: '80px' }} />
                </Avatar>
                <Stack gap={2}>
                  <Button
                    variant="outlined"
                    component="label"
                    sx={{
                      height: '35px',
                      borderRadius: '10px',
                      borderColor: 'grey.700',
                      '&:hover, &:focus, &:active': {
                        borderColor: 'grey.700',
                      },
                      color: theme.palette.grey[900],
                    }}
                  >
                    {logoPreview !== '' ? (
                      <EditIcon
                        fontSize="small"
                        sx={{ mr: 0.5, color: 'grey.700' }}
                      />
                    ) : (
                      <AddIcon
                        fontSize="small"
                        sx={{ mr: 0.5, color: 'grey.700' }}
                      />
                    )}

                    <Typography variant="button2" sx={{ color: 'grey.700' }}>
                      {logoPreview !== '' ? 'Change Logo' : 'Add Logo'}
                    </Typography>
                    <input
                      type="file"
                      hidden
                      name="businessLogo"
                      onChange={onLogoUpload}
                    />
                  </Button>
                  {logoPreview !== '' && (
                    <Button
                      variant="outlined"
                      component="label"
                      sx={{
                        height: '35px',
                        borderRadius: '10px',
                        borderColor: 'grey.700',
                        '&:hover, &:focus, &:active': {
                          borderColor: 'grey.700',
                        },
                      }}
                      onClick={() => {
                        setNewLogo(false);
                        setDeleteLogo(true);
                        setLogoPreview('');
                      }}
                    >
                      <DeleteIcon
                        fontSize="small"
                        sx={{ mr: 0.5, color: 'grey.700' }}
                      />
                      <Typography variant="button2" sx={{ color: 'grey.700' }}>
                        Remove Logo
                      </Typography>
                    </Button>
                  )}
                </Stack>
              </Stack>
              {hasValidationErrors && <ValidationErrorAlert />}
              {serviceError && <ServiceErrorAlert />}
              <LoadingButton
                loading={updating}
                variant="contained"
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
      </Box>
    </>
  );
};

export default StoreSettings;
