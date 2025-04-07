import {
  Box,
  Button,
  Container,
  Grid,
  IconButton,
  TextField,
  Typography,
} from '@mui/material';
import { useState } from 'react';
import DeleteIcon from '@mui/icons-material/Delete';
import axios from 'axios';

function SecondaryInfoForm({ sellerData, setSellerData }) {
  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!sellerData.sellerName) {
      setErrors({
        ...errors,
        sellerName: 'Name is required',
      });
    }
    if (!sellerData.businessName) {
      setErrors({
        ...errors,
        businessName: 'Business Name is required',
      });
    }
    if (!Object.values(errors).some((error) => error)) {
      setErrors({
        sellerName: '',
        businessName: '',
      });
    }
    //send sellerData to REST endpoint in a POST request
    // Construct FormData object
    const formData = new FormData();

    // Append string fields
    formData.append('sellerName', sellerData.sellerName);
    formData.append('businessName', sellerData.businessName);
    formData.append('upiID', sellerData.upiID);
    formData.append('upiPhone', sellerData.upiPhone);
    formData.append('upiName', sellerData.upiName);

    // Append file fields (ensure file inputs have a valid File object)
    if (sellerData.businessLogo) {
      formData.append('businessLogo', sellerData.businessLogo);
    }

    if (sellerData.businessBanner) {
      formData.append('businessBanner', sellerData.businessBanner);
    }

    if (sellerData.upiQR) {
      formData.append('upiQR', sellerData.upiQR);
    }

    try {
      // Send FormData using Axios POST
      const response = await axios.post(
        'http://localhost:3004/mpregistration/mpseller',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );
    } catch (error) {
      console.error(
        'Error uploading form data:',
        error.response || error.message
      );
    }
  };

  const [errors, setErrors] = useState({
    sellerName: '',
    businessName: '',
  });

  async function onAssetUpload(event, field_name) {
    const { target } = event;
    if (target.validity.valid) {
      const { files } = target;
      setSellerData({
        ...sellerData,
        [field_name]: files[0],
      });
    }
  }

  const handleFileDelete = (file, name) => {
    URL.revokeObjectURL(file);
    setSellerData({
      ...sellerData,
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
            <Typography variant="b1">UPI ID</Typography>
          </Grid>
          <Grid item xs={10}>
            <TextField
              value={sellerData.upiID}
              onChange={(e) => {
                setSellerData({
                  ...sellerData,
                  upiID: e.target.value,
                });
              }}
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
              value={sellerData.upiPhone}
              onChange={(e) => {
                setSellerData({
                  ...sellerData,
                  upiPhone: e.target.value,
                });
              }}
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
              value={sellerData.upiName}
              onChange={(e) => {
                setSellerData({
                  ...sellerData,
                  upiName: e.target.value,
                });
              }}
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
                accept="image/*"
                hidden
                name="upiScannerImage"
                onChange={(e) => {
                  onAssetUpload(e, 'upiQR');
                }}
              />
            </Button>
            {renderFilePreview(sellerData.upiScannerImage, 'upiScannerImage')}
          </Grid>
          <Grid item xs={2}>
            <Typography variant="b1"></Typography>
          </Grid>
          <Grid item xs={10} justifyContent={'space-around'}>
            <Button
              sx={{ width: '200px', marginTop: '5px' }}
              type="submit"
              variant="contained"
              color="primary"
            >
              submit
            </Button>
          </Grid>
        </Grid>
      </form>
    </Container>
  );
}

export default SecondaryInfoForm;
