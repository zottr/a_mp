import React, { useEffect, useState } from 'react';
import MainAppBar from '../common/MainAppBar';
import {
  Avatar,
  Box,
  Button,
  CircularProgress,
  Container,
  Stack,
  Typography,
  useTheme,
} from '@mui/material';
import LoadingButton from '../common/LoadingButton';
import logo1 from '/logos/zottr_logo_small1_white.svg';
import StorefrontIcon from '@mui/icons-material/Storefront';
import { useUserContext } from '../../hooks/useUserContext';
import { UPDATE_ACTIVE_ADMINISTRATOR } from '../../libs/graphql/definitions/administrator-definitions';
import { ApolloError, useMutation } from '@apollo/client';
import CustomSnackBar from '../common/Snackbars/CustomSnackBar';
import {
  CREATE_ASSETS,
  DELETE_ASSETS,
} from '../../libs/graphql/definitions/product-definitions';
import ServiceErrorAlert from '../common/Alerts/ServiceErrorAlert';
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import { AccountCustomizationBreadcrumbs } from './AccountCustomizationBreadcrumbs';
import StyledTextField from '../common/styled/StyledTextField';
import PersonIcon from '@mui/icons-material/Person';

interface AccountCustomizationProps {
  type: any;
}

const AccountCustomization: React.FC<AccountCustomizationProps> = ({
  type,
}) => {
  const theme = useTheme();
  const { adminUser, setAdminUser } = useUserContext();
  const [loading, setLoading] = useState(true);

  const [updateUser] = useMutation(UPDATE_ACTIVE_ADMINISTRATOR);
  const [createAssets] = useMutation(CREATE_ASSETS);
  const [deleteAssets] = useMutation(DELETE_ASSETS);

  const [updating, setUpdating] = useState(false);
  const [updated, setUpdated] = useState(false);

  //store logo states
  const [logo, setLogo] = useState(null);
  const [logoId, setLogoId] = useState('');
  const [logoPreview, setLogoPreview] = useState('');
  const [newLogo, setNewLogo] = useState(false);
  const [deleteLogo, setDeleteLogo] = useState(false);

  //store tagline states
  const [tagline, setTagline] = useState('');

  //store banner states
  const [banner, setBanner] = useState(null);
  const [bannerId, setBannerId] = useState('');
  const [bannerPreview, setBannerPreview] = useState('');
  const [newBanner, setNewBanner] = useState(false);
  const [deleteBanner, setDeleteBanner] = useState(false);

  //Update settings when adminUser changes
  useEffect(() => {
    console.log(adminUser);
    if (adminUser !== null) {
      if (adminUser?.customFields?.businessLogo !== null) {
        setLogoPreview(adminUser?.customFields?.businessLogo?.preview);
        setLogo(adminUser?.customFields?.businessLogo);
        setLogoId(adminUser?.customFields?.businessLogo?.id);
      }
      if (adminUser?.customFields?.banner1 !== null) {
        setBannerPreview(adminUser?.customFields?.banner1?.preview);
        setBanner(adminUser?.customFields?.banner1);
        setBannerId(adminUser?.customFields?.banner1?.id);
      }
      if (adminUser?.customFields?.tagline !== null) {
        setTagline(adminUser?.customFields?.tagline);
      }
      setLoading(false); //Data fetched, stop loading
    }
  }, [adminUser]);

  const [serviceError, setServiceError] = useState(false);

  const resetFormStates = () => {
    setServiceError(false);
    setUpdated(false);
    setUpdating(false);
  };

  const handleSubmit = async (event: any) => {
    event.preventDefault();
    resetFormStates();
    setUpdating(true);
    try {
      let logoAssetId = logoId;
      let bannerAssetId = bannerId;
      if (deleteLogo) logoAssetId = '';
      if (deleteBanner) bannerAssetId = '';
      if (newLogo) {
        const assetResult = await createAssets({
          variables: {
            input: Array.from([logo]).map((file) => ({
              file,
            })),
          },
        });
        logoAssetId = assetResult?.data?.createAssets?.[0].id;
        setLogoId(logoAssetId);
      }
      if (newBanner) {
        const assetResult = await createAssets({
          variables: {
            input: Array.from([banner]).map((file) => ({
              file,
            })),
          },
        });
        bannerAssetId = assetResult?.data?.createAssets?.[0].id;
        setBannerId(bannerAssetId);
      }
      const adminInput = {
        customFields: {
          businessLogoId: logoAssetId,
          banner1Id: bannerAssetId,
          tagline: tagline,
        },
      };
      const result = await updateUser({
        variables: {
          input: adminInput,
        },
      });
      //update local admin user state
      if (result.data) {
        console.log(result.data);
        setAdminUser((prev) => {
          if (!prev) return prev; // Avoid modifying if `prev` is null
          return {
            ...prev,
            customFields: {
              ...prev.customFields,
              businessLogo:
                result.data.updateActiveAdministrator.customFields.businessLogo,
              banner1:
                result.data.updateActiveAdministrator.customFields.banner1,
              tagline:
                result.data.updateActiveAdministrator.customFields.tagline,
            },
          };
        });
      }
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
      if (deleteBanner) {
        await deleteAssets({
          variables: {
            input: {
              assetIds: [bannerId],
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
      setNewBanner(false);
      setDeleteBanner(false);
    }

    setUpdating(false);
  };

  function onLogoUpload(event: any) {
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
  function onBannerUpload(event: any) {
    const { target } = event;
    if (target.validity.valid) {
      const { files } = target;
      setBanner(files[0]);
      setBannerPreview(URL.createObjectURL(files[0]));
      setNewBanner(true);
      setDeleteBanner(false);
    }
    //event.target.value = null;
  }

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
            <AccountCustomizationBreadcrumbs type={type} />
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
                Customize profile
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
            <Container sx={{ px: 2 }}>
              <Stack
                component="form"
                noValidate
                autoComplete="off"
                onSubmit={handleSubmit}
                gap={4}
                sx={{ mt: 3, display: 'flex', alignItems: 'center' }}
              >
                <Stack width="100%" gap={2}>
                  <Stack width="100%">
                    <Typography variant="heavylabel1" color="grey.800">
                      Your Logo
                    </Typography>
                    <Typography
                      variant="b2"
                      color="grey.600"
                      sx={{ fontStyle: 'italic' }}
                    >
                      Add your business logo
                    </Typography>
                  </Stack>
                  <Stack
                    direction="row"
                    gap={5}
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
                          logoPreview !== ''
                            ? 'transparent'
                            : 'primary.surface',
                        // border: '1px solid grey',
                        '& img': {
                          objectFit: 'contain', // Ensures image covers the Avatar
                          objectPosition: 'center', // Centers the image focus
                        },
                      }}
                    >
                      {/* <StorefrontIcon sx={{ fontSize: '80px' }} /> */}
                      <img src={logo1} alt="Logo" style={{ height: '65px' }} />
                    </Avatar>
                    <Stack gap={1}>
                      <Button
                        variant="outlined"
                        component="label"
                        sx={{
                          width: '100%',
                          height: '2.8rem',
                          borderRadius: '25px',
                          borderColor: 'grey.700',
                          '&:hover, &:focus, &:active': {
                            borderColor: 'grey.700',
                          },
                        }}
                      >
                        {logoPreview !== '' ? (
                          <EditIcon
                            fontSize="small"
                            sx={{
                              mr: '8px',
                              color: 'grey.700',
                            }}
                          />
                        ) : (
                          <AddIcon
                            fontSize="medium"
                            sx={{
                              mr: '8px',
                              color: 'grey.700',
                            }}
                          />
                        )}

                        <Typography
                          variant="button2"
                          sx={{ color: 'grey.700' }}
                        >
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
                            height: '2.8rem',
                            borderRadius: '25px',
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
                            sx={{ mr: '8px', color: 'grey.700' }}
                          />
                          <Typography
                            variant="button2"
                            sx={{ color: 'grey.700' }}
                          >
                            Remove Logo
                          </Typography>
                        </Button>
                      )}
                    </Stack>
                  </Stack>
                </Stack>
                <Stack width="100%" gap={2}>
                  <Stack>
                    <Typography variant="heavylabel1" color="grey.800">
                      Your Tagline
                    </Typography>
                    <Typography
                      variant="b2"
                      color="grey.600"
                      sx={{ fontStyle: 'italic' }}
                    >
                      A short statement introducing your products & services
                    </Typography>
                  </Stack>
                  <StyledTextField
                    id="tagline"
                    name="tagline"
                    variant="outlined"
                    value={tagline}
                    onChange={(event) => {
                      const { value } = event.target;
                      setTagline(value);
                    }}
                    placeholder="Your tagline here"
                    size="small"
                    // helperText={
                    //   validationErrors.nameEmpty &&
                    //   validationErrorMessages.nameEmpty
                    // }
                    // error={validationErrors.nameEmpty}
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
                <Stack width="100%" gap={2}>
                  <Stack width="100%">
                    <Typography variant="heavylabel1" color="grey.800">
                      Your Banner
                    </Typography>
                    <Typography
                      variant="b2"
                      color="grey.600"
                      sx={{ fontStyle: 'italic' }}
                    >
                      Promote your products & services
                    </Typography>
                  </Stack>
                  <Stack
                    direction="column"
                    gap={1}
                    sx={{
                      width: '100%',
                      display: 'flex',
                      alignItems: 'center',
                    }}
                  >
                    {bannerPreview !== '' && (
                      <Box
                        component="img"
                        src={bannerPreview}
                        alt={`banner-preview`}
                        sx={{
                          p: 3,
                          objectFit: 'cover',
                          width: '100%',
                          // aspectRatio: 1,
                        }}
                      />
                    )}
                    <Stack gap={1}>
                      <Button
                        variant="outlined"
                        component="label"
                        sx={{
                          height: '2.8rem',
                          borderRadius: '25px',
                          borderColor: 'grey.700',
                          '&:hover, &:focus, &:active': {
                            borderColor: 'grey.700',
                          },
                        }}
                      >
                        {bannerPreview !== '' ? (
                          <EditIcon
                            fontSize="small"
                            sx={{ mr: '8px', color: 'grey.700' }}
                          />
                        ) : (
                          <AddIcon
                            fontSize="medium"
                            sx={{ mr: '8px', color: 'grey.700' }}
                          />
                        )}

                        <Typography
                          variant="button2"
                          sx={{ color: 'grey.700' }}
                        >
                          {bannerPreview !== ''
                            ? 'Change Banner'
                            : 'Add Banner'}
                        </Typography>
                        <input
                          type="file"
                          hidden
                          name="businessLogo"
                          onChange={onBannerUpload}
                        />
                      </Button>
                      {bannerPreview !== '' && (
                        <Button
                          variant="outlined"
                          component="label"
                          sx={{
                            height: '2.8rem',
                            borderRadius: '25px',
                            borderColor: 'grey.700',
                            '&:hover, &:focus, &:active': {
                              borderColor: 'grey.700',
                            },
                          }}
                          onClick={() => {
                            setNewBanner(false);
                            setDeleteBanner(true);
                            setBannerPreview('');
                          }}
                        >
                          <DeleteIcon
                            fontSize="small"
                            sx={{ mr: '8px', color: 'grey.700' }}
                          />
                          <Typography
                            variant="button2"
                            sx={{ color: 'grey.700' }}
                          >
                            Remove Banner
                          </Typography>
                        </Button>
                      )}
                    </Stack>
                  </Stack>
                </Stack>
                {serviceError && <ServiceErrorAlert />}
                <LoadingButton
                  loading={updating}
                  variant="contained"
                  type="submit"
                  onClick={() => {}}
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
                  color="success"
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

export default AccountCustomization;
