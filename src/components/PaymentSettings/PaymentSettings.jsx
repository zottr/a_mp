import React, { useEffect, useState } from 'react';
import MainAppBar from '../common/MainAppBar';
import {
  Avatar,
  Box,
  Button,
  CircularProgress,
  Container,
  InputAdornment,
  Stack,
  Typography,
  useTheme,
} from '@mui/material';
import StyledTextField from '../common/styled/StyledTextField';
import LoadingButton from '../common/LoadingButton';
import QrCodeIcon from '@mui/icons-material/QrCode';
import PaymentSettingsBreadcrumbs from './PaymentSettingsBreadcrumbs';
import { useUserContext } from '../../hooks/useUserContext';
import { useMutation } from '@apollo/client';
import { UPDATE_ACTIVE_ADMINISTRATOR } from '../../libs/graphql/definitions/administrator-definitions';
import {
  CREATE_ASSETS,
  DELETE_ASSETS,
} from '../../libs/graphql/definitions/product-definitions';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import CustomSnackBar from '../common/Snackbars/CustomSnackBar';
import ValidationErrorAlert from '../common/Alerts/ValidationErrorAlert';
import ServiceErrorAlert from '../common/Alerts/ServiceErrorAlert';

const PaymentSettings = () => {
  const theme = useTheme();
  const { adminUser, setAdminUser } = useUserContext();
  const [loading, setLoading] = useState(true);
  const initialSettings = {
    name: '',
    phone: '',
    id: '',
  };

  const [updateUser] = useMutation(UPDATE_ACTIVE_ADMINISTRATOR);
  const [createAssets] = useMutation(CREATE_ASSETS);
  const [deleteAssets] = useMutation(DELETE_ASSETS);

  const [settings, setSettings] = useState(initialSettings);
  const [updating, setUpdating] = useState(false);
  const [updated, setUpdated] = useState(false);

  const [qr, setQr] = useState(null);
  const [qrId, setQrId] = useState('');
  const [qrPreview, setQrPreview] = useState('');
  const [newQr, setNewQr] = useState(false);
  const [deleteQr, setDeleteQr] = useState(false);

  //Update settings when adminUser changes
  useEffect(() => {
    if (adminUser) {
      setSettings({
        name: adminUser?.customFields.upiName,
        phone: adminUser?.upiPhone,
        id: adminUser?.customFields.upiId,
      });
      if (adminUser?.customFields?.upiScan) {
        setQrPreview(adminUser?.customFields?.upiScan?.preview);
        setQr(adminUser?.customFields?.upiScan);
        setQrId(adminUser?.customFields?.upiScan?.id);
      }
      setLoading(false); //Data fetched, stop loading
    }
  }, [adminUser]);

  const [validationErrors, setValidationErrors] = useState({
    nameEmpty: false,
    phoneEmpty: false,
    idEmpty: false,
    phoneInvalid: false,
    idInvalid: false,
  });

  const [serviceError, setServiceError] = useState(false);
  const [hasValidationErrors, setHasValidationErrors] = useState(false);

  const validationErrorMessages = {
    nameEmpty: 'Bank customer name cannot be empty',
    phoneEmpty: 'UPI phone number cannot be empty',
    idEmpty: 'UPI id cannot be empty',
    phoneInvalid: 'Phone number is not valid',
    idInvalid: 'UPI id is not valid',
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

  const isValidPhone = (phone) => {
    const phoneRegex = /^[0-9]{10}$/;
    return phoneRegex.test(phone);
  };

  const isValidId = (id) => {
    const upiRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+$/;
    return upiRegex.test(id);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    resetFormStates();

    if (settings.name === '') {
      setValidationErrors((prev) => ({
        ...prev,
        nameEmpty: true,
      }));
    }
    if (settings.phone === '') {
      setValidationErrors((prev) => ({
        ...prev,
        phoneEmpty: true,
      }));
    }
    if (!isValidPhone(settings.phone)) {
      setValidationErrors((prev) => ({
        ...prev,
        phoneInvalid: true,
      }));
    }
    if (settings.id === '') {
      setValidationErrors((prev) => ({
        ...prev,
        idEmpty: true,
      }));
    }
    if (!isValidId(settings.id)) {
      setValidationErrors((prev) => ({
        ...prev,
        idInvalid: true,
      }));
    }
    if (
      settings.name !== '' &&
      settings.id !== '' &&
      settings.phone !== '' &&
      isValidPhone(settings.phone) &&
      isValidId(settings.id)
    ) {
      setUpdating(true);
      try {
        let assetId = qrId;
        if (deleteQr) assetId = '';
        if (newQr) {
          const assetResult = await createAssets({
            variables: {
              input: Array.from([qr]).map((file) => ({
                file,
              })),
            },
          });
          assetId = assetResult?.data?.createAssets?.[0].id;
          setQrId(assetId);
        }
        const adminInput = {
          customFields: {
            upiId: settings.id,
            upiPhone: settings.phone,
            upiName: settings.name,
            upiScanId: assetId,
          },
        };
        const result = await updateUser({
          variables: {
            input: adminInput,
          },
        });
        setUpdated(true);
        if (deleteQr) {
          await deleteAssets({
            variables: {
              input: {
                assetIds: [qrId],
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
        setNewQr(false);
        setDeleteQr(false);
      }
    } else {
      setHasValidationErrors(true);
    }
    setUpdating(false);
  };

  function onQrUpload(event) {
    const { target } = event;
    if (target.validity.valid) {
      const { files } = target;
      setQr(files[0]);
      setQrPreview(URL.createObjectURL(files[0]));
      setNewQr(true);
      setDeleteQr(false);
    }
    //event.target.value = null;
  }

  return (
    <>
      <MainAppBar />
      <Box sx={{ mb: 5 }}>
        <Stack sx={{ mt: 10 }} gap={2}>
          <PaymentSettingsBreadcrumbs />
          <Stack gap={2} sx={{ display: 'flex', alignItems: 'center' }}>
            <Typography
              variant="h5"
              color={theme.palette.grey[900]}
              sx={{
                textAlign: 'center',
                margin: 'auto',
              }}
            >
              UPI Payment Settings
            </Typography>
            <Typography
              variant="b1"
              color={theme.palette.grey[600]}
              sx={{
                textAlign: 'center',
                margin: 'auto',
              }}
            >
              Display your UPI information for easy customer payments
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
                  Bank Customer Name
                </Typography>
                <StyledTextField
                  id="name"
                  name="name"
                  variant="outlined"
                  value={settings.name}
                  onChange={handleChangeSettings}
                  placeholder="Enter your full registered name"
                  size="small"
                  helperText={
                    validationErrors.nameEmpty &&
                    validationErrorMessages.nameEmpty
                  }
                  error={validationErrors.nameEmpty}
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
                  UPI Phone Number
                </Typography>
                <StyledTextField
                  id="phone"
                  name="phone"
                  type="number"
                  variant="outlined"
                  value={settings.phone}
                  onChange={handleChangeSettings}
                  placeholder="10 digit registered UPI number"
                  size="small"
                  helperText={
                    (validationErrors.phoneEmpty &&
                      validationErrorMessages.phoneEmpty) ||
                    (validationErrors.phoneInvalid &&
                      validationErrorMessages.phoneInvalid)
                  }
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Typography
                          variant="label1"
                          sx={{ color: theme.palette.grey[600] }}
                        >
                          +91
                        </Typography>
                      </InputAdornment>
                    ),
                  }}
                  error={
                    validationErrors.phoneEmpty || validationErrors.phoneInvalid
                  }
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
                  UPI ID
                </Typography>
                <StyledTextField
                  id="id"
                  name="id"
                  variant="outlined"
                  value={settings.id}
                  onChange={handleChangeSettings}
                  placeholder="Example: upi@okhdfcbank"
                  size="small"
                  helperText={
                    (validationErrors.idEmpty &&
                      validationErrorMessages.idEmpty) ||
                    (validationErrors.idInvalid &&
                      validationErrorMessages.idInvalid)
                  }
                  error={validationErrors.idEmpty || validationErrors.idInvalid}
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
                  UPI QR Code
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
                {qrPreview !== '' && (
                  <Box
                    component="img"
                    src={qrPreview}
                    alt={'upi qr code'}
                    sx={{
                      bgcolor: 'transparent',
                      objectFit: 'contain',
                      objectPosition: 'center',
                      width: '120px',
                    }}
                  />
                )}
                <Stack gap={2}>
                  <Button
                    component="label"
                    variant="outlined"
                    sx={{
                      height: '40px',
                      borderRadius: '10px',
                      borderColor: 'grey.700',
                      '&:hover, &:focus, &:active': {
                        borderColor: 'grey.700',
                      },
                    }}
                  >
                    {qrPreview !== '' ? (
                      <EditIcon
                        fontSize="small"
                        sx={{ mr: 0.5, color: 'grey.700' }}
                      />
                    ) : (
                      <QrCodeIcon
                        fontSize="small"
                        sx={{ mr: 0.5, color: 'grey.700' }}
                      />
                    )}

                    <Typography variant="button2" sx={{ color: 'grey.700' }}>
                      {qrPreview !== '' ? 'Change QR Code' : 'Add QR Code'}
                    </Typography>
                    <input
                      type="file"
                      hidden
                      name="qrCodeInput"
                      onChange={onQrUpload}
                    />
                  </Button>
                  {qrPreview !== '' && (
                    <Button
                      variant="outlined"
                      component="label"
                      sx={{
                        height: '40px',
                        borderRadius: '10px',
                        borderColor: 'grey.700',
                        '&:hover, &:focus, &:active': {
                          borderColor: 'grey.700',
                        },
                      }}
                      onClick={() => {
                        setNewQr(false);
                        setDeleteQr(true);
                        setQrPreview('');
                      }}
                    >
                      <DeleteIcon
                        fontSize="small"
                        sx={{ mr: 0.5, color: 'grey.700' }}
                      />
                      <Typography variant="button2" sx={{ color: 'grey.700' }}>
                        Remove QR Code
                      </Typography>
                    </Button>
                  )}
                </Stack>
              </Stack>
              {hasValidationErrors && <ValidationErrorAlert />}
              {serviceError && <ServiceErrorAlert />}
              <LoadingButton
                loading={false}
                variant="contained"
                type="submit"
                buttonStyles={{
                  backgroundColor: 'secondary.main',
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

export default PaymentSettings;
