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

function PrimaryInfoForm({ setPrimaryInfoFilled, formData, setFormData }) {
  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!formData.sellerName) {
      setErrors({
        ...errors,
        sellerName: 'Name is required',
      });
    }
    if (!formData.businessName) {
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
      setPrimaryInfoFilled(true);
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
      setFormData({
        ...formData,
        [field_name]: files[0],
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
              value={formData.sellerName}
              onChange={(e) => {
                setFormData({
                  ...formData,
                  sellerName: e.target.value,
                });
              }}
              placeholder="Enter your name"
              fullWidth
              margin="normal"
              error={errors.sellerName}
              helperText={errors.sellerName}
              required
            />
          </Grid>
          <Grid item xs={2}>
            <Typography variant="b1">Business Name*</Typography>
          </Grid>
          <Grid item xs={10}>
            <TextField
              value={formData.businessName}
              onChange={(e) => {
                setFormData({
                  ...formData,
                  businessName: e.target.value,
                });
              }}
              placeholder="Enter your business name"
              fullWidth
              margin="normal"
              error={errors.businessName}
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
                accept="image/*"
                hidden
                name="businessLogo"
                onChange={(e) => {
                  onAssetUpload(e, 'businessLogo');
                }}
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
                accept="image/*"
                hidden
                name="businessBanner"
                onChange={(e) => {
                  onAssetUpload(e, 'businessBanner');
                }}
              />
            </Button>
            {renderFilePreview(formData.businessBanner, 'businessBanner')}
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
              Proceed
            </Button>
          </Grid>
        </Grid>
      </form>
    </Container>
  );
}

export default PrimaryInfoForm;
