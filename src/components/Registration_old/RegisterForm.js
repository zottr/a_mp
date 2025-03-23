// src/components/RegisterForm.tsx
import React, { useState } from 'react';
import {
  TextField,
  Button,
  Container,
  Typography,
  IconButton,
  Box,
  Grid,
} from '@mui/material';
import { ApolloError, useMutation } from '@apollo/client';
import { CREATE_ADMINISTRATOR } from '../../libs/graphql/definitions/administrator-definitions';
import { CreateAdministratorInput } from '../../libs/graphql/generated-types';
import { CREATE_ASSETS } from '../../libs/graphql/definitions/product-definitions';
import {
  ATTEMPT_LOGIN,
  LOG_OUT,
} from '../../libs/graphql/definitions/auth-definitions';
import {
  CREATE_FACET_VALUES,
  DELETE_FACET_VALUES,
} from '../../libs/graphql/definitions/facet-definitions';
import { useLocation, useNavigate } from 'react-router-dom';
import DeleteIcon from '@mui/icons-material/Delete';

const RegisterForm = ({ logout }) => {
  const location = useLocation();
  const { state } = location;

  const [name, setName] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [phone, setPhone] = useState(state.phone || '');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [upiId, setUpiId] = useState('');
  const [upiPhone, setUpiPhone] = useState('');
  const [upiName, setUpiName] = useState('');
  const [facetValueId, setFacetValueId] = useState('');
  const [formData, setFormData] = useState({
    businessLogo: null,
    upiScannerImage: null,
  });

  const [errors, setErrors] = useState({
    name: '',
    businessName: '',
    phone: '',
    password: '',
    confirmPassword: '',
    upiPhone: '',
  });

  const navigate = useNavigate();

  const [loginSuperAdmin] = useMutation(ATTEMPT_LOGIN);
  const [logoutSuperAdmin] = useMutation(LOG_OUT);

  const [registerUser] = useMutation(CREATE_ADMINISTRATOR);
  const [createAssets] = useMutation(CREATE_ASSETS);
  const [createFacetValue] = useMutation(CREATE_FACET_VALUES);
  const [deleteFacetValue] = useMutation(DELETE_FACET_VALUES);

  const validatePhone = (phone) => {
    const phoneRegex = /^[0-9]{10}$/;
    return phoneRegex.test(phone);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    let validationErrors = {
      name: '',
      businessName: '',
      phone: '',
      password: '',
      confirmPassword: '',
      upiPhone: '',
    };

    if (!name) {
      validationErrors.name = 'Name is required';
    }

    if (!businessName) {
      validationErrors.businessName = 'Business name is required';
    }

    if (!validatePhone(phone)) {
      validationErrors.phone = 'Invalid phone number format';
    }

    if (!password) {
      validationErrors.password = 'Password is required';
    }

    if (password !== confirmPassword) {
      validationErrors.confirmPassword = 'Passwords do not match';
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
        phone: '',
        password: '',
        confirmPassword: '',
        upiPhone: '',
      });

      try {
        await loginSuperAdmin({
          variables: {
            username: `${process.env.REACT_APP_SUPERADMIN_USERNAME}`,
            password: `${process.env.REACT_APP_SUPERADMIN_PASSWORD}`,
            rememberMe: true,
          },
        });
      } catch (err) {
        console.error('Superadmin login failed:', err);
      }

      try {
        const facetResult = await createFacetValue({
          variables: {
            input: {
              facetId: `${process.env.REACT_APP_VENDURE_SELLER_FACET_ID}`,
              code: phone,
              translations: {
                languageCode: `${process.env.REACT_APP_VENDURE_LANGUAGE_CODE}`,
                name: phone,
              },
            },
          },
        });
        if (facetResult?.data?.createFacetValues) {
          setFacetValueId(facetResult?.data?.createFacetValues[0].id);
        }
      } catch (err) {
        console.error('Failed to create facet', err);
      }

      let businessLogoId = null;
      let upiScanId = null;
      try {
        if (formData.businessLogo && formData.upiScannerImage) {
          const assetResult = await createAssets({
            variables: {
              input: Array.from([
                formData.businessLogo,
                formData.upiScannerImage,
              ]).map((file) => ({ file })),
            },
          });
          businessLogoId = assetResult?.data?.createAssets?.[0].id;
          upiScanId = assetResult?.data?.createAssets?.[1].id;
        } else if (formData.businessLogo == null) {
          const assetResult = await createAssets({
            variables: {
              input: Array.from([formData.upiScannerImage]).map((file) => ({
                file,
              })),
            },
          });
          upiScanId = assetResult?.data?.createAssets?.[0].id;
        } else {
          const assetResult = await createAssets({
            variables: {
              input: Array.from([formData.businessLogo]).map((file) => ({
                file,
              })),
            },
          });
          businessLogoId = assetResult?.data?.createAssets?.[0].id;
        }
      } catch (err) {
        console.log('Failed to upload file' + err);
      }

      const adminInput = {
        firstName: name,
        emailAddress: `${phone}@testabc.com`,
        lastName: '',
        password: password,
        roleIds: ['3'],
        customFields: {
          phone: phone,
          business: businessName,
          upiId: upiId,
          upiPhone: upiPhone,
          upiScanId: upiScanId,
          upiName: upiName,
          businessLogoId: businessLogoId,
        },
      };

      try {
        const data = await registerUser({
          variables: {
            input: adminInput,
          },
        });
        console.log(data);
        navigate('/login');
      } catch (err) {
        //delete facet will create again once successful
        if (facetValueId) {
          try {
            await deleteFacetValue({
              variables: {
                ids: [facetValueId],
              },
            });
          } catch (err) {
            console.error('Failed to delete facet value:', err);
          }
        }
        if (err instanceof ApolloError) {
          console.error('Registration error:', err?.message);
          if (err?.message.includes('UNIQUE constraint failed')) {
            validationErrors.phone = 'This phone number is already registered';
            setErrors(validationErrors);
          }
        } else {
          console.error('Registration error:', err);
        }
      } finally {
        await logoutSA();
      }
    }
  };

  async function logoutSA() {
    try {
      await logoutSuperAdmin();
      logout();
    } catch (err) {
      console.error('Logout superadmin failed:', err);
    }
  }

  async function onAssetUpload(event) {
    const { target } = event;
    if (target.validity.valid) {
      const { name, files } = target;
      setFormData({
        ...formData,
        [name]: files[0],
      });
    }
  }

  const handleFileDelete = (file, name) => {
    URL.revokeObjectURL(file);
    setFormData({
      ...formData,
      [name]: null,
    });
  };

  const renderFilePreview = (file, name) => {
    return file ? (
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <img src={URL.createObjectURL(file)} alt="preview" width="100" />
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
    <Container>
      <Typography variant="h4">Register</Typography>
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
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="Enter your phone number"
              fullWidth
              margin="normal"
              error={!!errors.phone}
              helperText={errors.phone}
              inputProps={{ readOnly: true }}
            />
          </Grid>
          <Grid item xs={2}>
            <Typography variant="b1">Password*</Typography>
          </Grid>
          <Grid item xs={10}>
            <TextField
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              fullWidth
              margin="normal"
              error={!!errors.password}
              helperText={errors.password}
              required
            />
          </Grid>
          <Grid item xs={2}>
            <Typography variant="b1">Confirm Password*</Typography>
          </Grid>
          <Grid item xs={10}>
            <TextField
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm your password"
              fullWidth
              margin="normal"
              error={!!errors.confirmPassword}
              helperText={errors.confirmPassword}
              required
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
                name="upiScannerImage"
                onChange={onAssetUpload}
              />
            </Button>
            {renderFilePreview(formData.upiScannerImage, 'upiScannerImage')}
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
              Register
            </Button>
          </Grid>
        </Grid>
      </form>
    </Container>
  );
};

export default RegisterForm;
