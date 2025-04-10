// src/components/RegisterForm.tsx
import React, { useState } from 'react';
import {
  TextField,
  Button,
  Typography,
  IconButton,
  Box,
  Grid,
} from '@mui/material';
import { ApolloError, useMutation } from '@apollo/client';
import { UPDATE_ACTIVE_ADMINISTRATOR } from '../../libs/graphql/definitions/administrator-definitions';
import {
  CREATE_ASSETS,
  DELETE_ASSETS,
} from '../../libs/graphql/definitions/product-definitions';
import DeleteIcon from '@mui/icons-material/Delete';
import { useUserContext } from '../../hooks/useUserContext';

const EditProfile = ({ onUpdateCallback, onCancelCallback }) => {
  const { adminUser } = useUserContext();
  const [name, setName] = useState(adminUser?.firstName);
  const [businessName, setBusinessName] = useState(
    adminUser?.customFields?.businessName
  );
  const [businessUrl, setBusinessUrl] = useState(
    adminUser?.customFields?.businessUrl
  );
  const [phoneNumber, setPhoneNumber] = useState(
    adminUser?.customFields?.phoneNumber
  );
  const [upiId, setUpiId] = useState(adminUser?.customFields?.upiId);
  const [upiPhone, setUpiPhone] = useState(adminUser?.customFields?.upiPhone);
  const [upiName, setUpiName] = useState(adminUser?.customFields?.upiName);
  const [businessLogoId, setBusinessLogoId] = useState(
    adminUser?.customFields?.businessLogo?.id
  );
  const [bannerId, setBannerId] = useState(adminUser?.customFields?.banner?.id);
  const [upiScanId, setUpiScanId] = useState(
    adminUser?.customFields?.upiScan?.id
  );
  const [deleteAssetIds, setDeleteAssetIds] = useState([]);
  const [formData, setFormData] = useState({
    businessLogo: null,
    upiScan: null,
    banner: null,
  });
  const [filePreview, setFilePreview] = useState({
    businessLogo: adminUser?.customFields?.businessLogo?.preview,
    upiScan: adminUser?.customFields?.upiScan?.preview,
    banner: adminUser?.customFields?.banner?.preview,
  });
  const [errors, setErrors] = useState({
    name: '',
    businessName: '',
    phoneNumber: '',
    upiPhone: '',
  });

  const [updateUser] = useMutation(UPDATE_ACTIVE_ADMINISTRATOR);
  const [createAssets] = useMutation(CREATE_ASSETS);
  const [deleteAssets] = useMutation(DELETE_ASSETS);

  const validatePhone = (phone) => {
    const phoneRegex = /^[0-9]{10}$/;
    return phoneRegex.test(phone);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    let validationErrors = {
      name: '',
      businessName: '',
      phoneNumber: '',
      upiPhone: '',
    };

    if (!name) {
      validationErrors.name = 'Name is required';
    }

    if (!businessName) {
      validationErrors.businessName = 'Business name is required';
    }

    if (upiPhone && !validatePhone(upiPhone)) {
      validationErrors.upiPhone = 'Invalid phone number format for UPI';
    }

    if (Object.values(validationErrors).some((error) => error)) {
      setErrors(validationErrors);
    } else {
      setErrors({
        name: '',
        businessName: '',
        phoneNumber: '',
        upiPhone: '',
      });

      let getBusinessLogoId = businessLogoId;
      let getUpiScanId = upiScanId;
      let getBannerId = bannerId;
      try {
        //all three assets together
        if (formData.businessLogo && formData.upiScan && formData.banner) {
          const assetResult = await createAssets({
            variables: {
              input: Array.from([
                formData.businessLogo,
                formData.upiScan,
                formData.banner,
              ]).map((file) => ({ file })),
            },
          });
          getBusinessLogoId = assetResult?.data?.createAssets?.[0].id;
          getUpiScanId = assetResult?.data?.createAssets?.[1].id;
          getBannerId = assetResult?.data?.createAssets?.[2].id;
        } else {
          if (formData.upiScan != null) {
            const assetResult = await createAssets({
              variables: {
                input: Array.from([formData.upiScan]).map((file) => ({
                  file,
                })),
              },
            });
            getUpiScanId = assetResult?.data?.createAssets?.[0].id;
          }
          if (formData.businessLogo != null) {
            const assetResult = await createAssets({
              variables: {
                input: Array.from([formData.businessLogo]).map((file) => ({
                  file,
                })),
              },
            });
            getBusinessLogoId = assetResult?.data?.createAssets?.[0].id;
          }

          if (formData.banner != null) {
            const assetResult = await createAssets({
              variables: {
                input: Array.from([formData.banner]).map((file) => ({
                  file,
                })),
              },
            });
            getBannerId = assetResult?.data?.createAssets?.[0].id;
          }
        }
      } catch (err) {
        console.error('Failed to create asset' + err);
      }

      const adminInput = {
        firstName: name,
        lastName: '',
        customFields: {
          businessName: businessName,
          upiId: upiId,
          upiPhone: upiPhone,
          upiScanId: getUpiScanId,
          upiName: upiName,
          businessLogoId: getBusinessLogoId,
          bannerId: getBannerId,
          businessUrl: businessUrl,
        },
      };

      try {
        const updateResult = await updateUser({
          variables: {
            input: adminInput,
          },
        });
        onUpdateCallback(updateResult.data.updateActiveAdministrator);
      } catch (err) {
        if (err instanceof ApolloError) {
          console.error('Update error:', err?.message);
        } else {
          console.error('Registration error:', err);
        }
      }

      //delete old assets
      try {
        if (deleteAssetIds.length > 0) {
          await deleteAssets({
            variables: {
              input: {
                assetIds: deleteAssetIds,
                force: true,
                deleteFromAllChannels: true,
              },
            },
          });
        }
      } catch (err) {
        console.error('Failed to delete assets:', err);
      }
    }
  };

  async function onAssetUpload(event) {
    const { target } = event;
    if (target.validity.valid) {
      const { name, files } = target;
      setFormData({
        ...formData,
        [name]: files[0],
      });

      setFilePreview({
        ...filePreview,
        [name]: URL.createObjectURL(files[0]),
      });
    }

    event.target.value = null;
  }

  const handleFileDelete = (file, name) => {
    if (file) {
      URL.revokeObjectURL(file);
      setFormData({
        ...formData,
        [name]: null,
      });
    } else if (adminUser?.customFields[name]?.id) {
      if (name === 'businessLogo') setBusinessLogoId(null);
      if (name === 'upiScan') setUpiScanId(null);
      if (name === 'banner') setBannerId(null);
      deleteAssetIds.push(adminUser.customFields[name]?.id);
      setDeleteAssetIds(deleteAssetIds);
    }
    setFilePreview({
      ...filePreview,
      [name]: null,
    });
  };

  const renderFilePreview = (file, name) => {
    let filePath = null;
    if (file) {
      filePath = URL.createObjectURL(file);
    } else if (adminUser?.customFields[name]?.id) {
      filePath = adminUser.customFields[name]?.preview;
    }
    if (name === 'businessLogo') filePath = filePreview.businessLogo;
    if (name === 'upiScan') filePath = filePreview.upiScan;
    if (name === 'banner') filePath = filePreview.banner;

    return filePath ? (
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <img src={filePath} alt="preview" width="100" />
        <IconButton
          onClick={() => handleFileDelete(file, name)}
          color="error"
          aria-label="delete"
        >
          <DeleteIcon />
        </IconButton>
      </Box>
    ) : null;
  };

  return (
    <Box sx={{ marginTop: '40px' }}>
      <form onSubmit={handleSubmit}>
        <Grid container direction="row" alignItems="center">
          <Grid item xs={2}>
            <Typography variant="b1">Name*</Typography>
          </Grid>
          <Grid item xs={10}>
            <TextField
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your name"
              fullWidth
              margin="normal"
              error={!!errors.name}
              helperText={errors.name}
              required
            />
          </Grid>
          <Grid item xs={2}>
            <Typography variant="b1">Phone*</Typography>
          </Grid>
          <Grid item xs={10}>
            <TextField
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              placeholder="Enter your phone number"
              fullWidth
              margin="normal"
              error={!!errors.phoneNumber}
              helperText={errors.phoneNumber}
              disabled
            />
          </Grid>
          <Grid item xs={2}>
            <Typography variant="b1">Business Name*</Typography>
          </Grid>
          <Grid item xs={10}>
            <TextField
              value={businessName}
              onChange={(e) => setBusinessName(e.target.value)}
              placeholder="Enter your business name"
              fullWidth
              margin="normal"
              error={!!errors.businessName}
              helperText={errors.businessName}
              required
            />
          </Grid>
          <Grid item xs={2}>
            <Typography variant="b1">Business Link*</Typography>
          </Grid>
          <Grid item xs={10}>
            <TextField
              value={businessUrl}
              onChange={(e) => setBusinessUrl(e.target.value)}
              placeholder="Enter your business url link"
              fullWidth
              margin="normal"
            />
          </Grid>
          <Grid item xs={2}>
            <Typography variant="b1">Business Logo</Typography>
          </Grid>
          <Grid item xs={10}>
            <Button
              sx={{ width: '200px', marginBottom: '5px' }}
              variant="contained"
              component="label"
            >
              Upload
              <input
                type="file"
                hidden
                name="businessLogo"
                onChange={onAssetUpload}
              />
            </Button>
            {renderFilePreview(formData.businessLogo, 'businessLogo')}
          </Grid>
          <Grid item xs={2}>
            <Typography variant="b1">Business Banner</Typography>
          </Grid>
          <Grid item xs={10}>
            <Button
              sx={{ width: '200px', marginBottom: '5px' }}
              variant="contained"
              component="label"
            >
              Upload
              <input
                type="file"
                hidden
                name="banner"
                onChange={onAssetUpload}
              />
            </Button>
            {renderFilePreview(formData.banner, 'banner')}
          </Grid>
          <Grid item xs={2}>
            <Typography variant="b1">UPI ID</Typography>
          </Grid>
          <Grid item xs={10}>
            <TextField
              value={upiId}
              onChange={(e) => setUpiId(e.target.value)}
              placeholder="Enter your UPI ID (optional)"
              fullWidth
              margin="normal"
            />
          </Grid>
          <Grid item xs={2}>
            <Typography variant="b1">UPI Phone Number</Typography>
          </Grid>
          <Grid item xs={10}>
            <TextField
              value={upiPhone}
              onChange={(e) => setUpiPhone(e.target.value)}
              placeholder="Enter your UPI phone number (optional)"
              fullWidth
              margin="normal"
              error={!!errors.upiPhone}
              helperText={errors.upiPhone}
            />
          </Grid>
          <Grid item xs={2}>
            <Typography variant="b1">UPI Banking Name</Typography>
          </Grid>
          <Grid item xs={10}>
            <TextField
              value={upiName}
              onChange={(e) => setUpiName(e.target.value)}
              placeholder="Enter your UPI banking name (optional)"
              fullWidth
              margin="normal"
            />
          </Grid>
          <Grid item xs={2}>
            <Typography variant="b1">UPI Scanner Image</Typography>
          </Grid>
          <Grid item xs={10}>
            <Button
              sx={{ width: '200px', marginTop: '5px' }}
              variant="contained"
              component="label"
            >
              Upload
              <input
                type="file"
                hidden
                name="upiScan"
                onChange={onAssetUpload}
              />
            </Button>
            {renderFilePreview(formData.upiScan, 'upiScan')}
          </Grid>
          <Grid item xs={2}>
            <Typography variant="b1"></Typography>
          </Grid>
          <Grid container item xs={10} justifyContent={'space-around'}>
            <Button
              sx={{ width: '200px', marginTop: '5px' }}
              type="submit"
              variant="contained"
              color="primary"
            >
              Update
            </Button>
            <Button
              sx={{ width: '200px', marginTop: '5px' }}
              variant="contained"
              color="primary"
              onClick={onCancelCallback}
            >
              Cancel
            </Button>
          </Grid>
        </Grid>
      </form>
    </Box>
  );
};

export default EditProfile;
