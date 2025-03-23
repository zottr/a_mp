import React, { useState } from 'react';
import MainAppBar from '../common/MainAppBar';
import {
  Box,
  Button,
  Container,
  FormControl,
  Grid,
  IconButton,
  InputAdornment,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  Switch,
  TextField,
  Typography,
  useTheme,
} from '@mui/material';
import AddItemNavigation from './AddItemNavigation';
import WestIcon from '@mui/icons-material/West';
import HomeIcon from '@mui/icons-material/Home';
import DescriptionEditor from './DescriptionEditor';
import AddAPhotoIcon from '@mui/icons-material/AddAPhoto';
import LoadingButton from '../common/LoadingButton';
import { useQuery } from '@apollo/client';
import { GET_FACET_VALUE_LIST } from '../../libs/graphql/definitions/facet-definitions';

function AddOrUpdateItem({ handleDialogClose }) {
  const theme = useTheme();

  const { data: categories } = useQuery(GET_FACET_VALUE_LIST, {
    variables: {
      options: {
        filter: {
          facetId: { eq: `${process.env.REACT_APP_VENDURE_CATEGORY_FACET_ID}` },
        },
      },
    },
  });

  //product data
  const [desc, setDesc] = useState(null);
  const [category, setCategory] = useState('choose_category_label');

  //error states
  const [nameError, setNameError] = useState(false);
  const [priceError, setPriceError] = useState(false);
  const [serviceError, setServiceError] = useState(false);

  function resetErrorStates() {
    setServiceError(false);
    setNameError(false);
    setPriceError(false);
  }

  function handleCategoryChange(e) {
    const { value } = e.target;
    setCategory(value);
  }

  const handleSubmit = async (event) => {
    event.preventDefault();
    resetErrorStates();
    const formData = new FormData(event.target);
    const name = formData.get('name');
    const price = formData.get('price');
    if (name === '') setNameError(true);
    if (price === '' || isNaN(price)) setPriceError(true);
    console.log(desc);
  };

  return (
    <Box sx={{ mb: 5 }}>
      <Stack
        direction="row"
        sx={{ display: 'flex', alignItems: 'center', mt: 5 }}
      >
        <IconButton
          onClick={handleDialogClose}
          sx={{ position: 'absolute', marginLeft: '25px' }}
        >
          <WestIcon fontSize="medium" sx={{ color: 'primary.main' }} />
        </IconButton>
        <Typography
          variant="h5"
          color={theme.palette.grey[900]}
          sx={{
            textAlign: 'center',
            margin: 'auto',
          }}
        >
          Add new product
        </Typography>
      </Stack>
      <Container sx={{ px: 2 }}>
        <Stack
          component="form"
          onSubmit={handleSubmit}
          gap={3}
          sx={{ mt: 5, display: 'flex', alignItems: 'center' }}
        >
          <Stack width="100%" gap={1}>
            <Typography variant="heavyb1" color="grey.800">
              Product Name *
            </Typography>
            <TextField
              id="name"
              name="name"
              variant="outlined"
              placeholder="Enter name of product"
              size="small"
              helperText={nameError && 'Enter a valid product name'}
              error={nameError}
              sx={{
                width: '100%',
                '& input::placeholder': {
                  color: 'grey.900', // Change placeholder color
                  fontSize: '1rem', // Adjust font size if needed
                  fontStyle: 'italic', // Optional: Make it italic
                  fontFamily: 'Poppins, sans-serif',
                },
                '& .MuiInputLabel-root.Mui-error': {
                  color: theme.palette.error.main,
                },
                '& .MuiOutlinedInput-root.Mui-error .MuiOutlinedInput-notchedOutline':
                  {
                    borderWidth: '1.5px',
                    borderStyle: 'solid',
                  },
                '& .MuiFormHelperText-root.Mui-error': {
                  color: theme.palette.error.main,
                  fontSize: '0.875rem',
                  fontWeight: 400,
                  lineHeight: 1.43,
                  letterSpacing: '0.01071em',
                  fontStyle: 'normal',
                },
              }}
            />
          </Stack>
          <Stack width="100%" gap={1}>
            <Typography variant="heavyb1" color="grey.800">
              Product Description
            </Typography>
            <DescriptionEditor value={desc} setValue={setDesc} />
          </Stack>
          <Stack width="100%" gap={1}>
            <Typography variant="heavyb1" color="grey.800">
              Product Price *
            </Typography>
            <TextField
              id="price"
              name="price"
              variant="outlined"
              type="number"
              placeholder="Enter product price in rupees (₹)"
              size="small"
              helperText={priceError && 'Enter a valid product price'}
              error={priceError}
              sx={{
                width: '100%',
                borderWidth: '20px',
                '& input::placeholder': {
                  color: 'grey.900', // Change placeholder color
                  fontSize: '1rem', // Adjust font size if needed
                  fontStyle: 'italic', // Optional: Make it italic
                  fontFamily: 'Poppins, sans-serif',
                },
                '& .MuiInputLabel-root.Mui-error': {
                  color: theme.palette.error.main,
                },
                '& .MuiOutlinedInput-root.Mui-error .MuiOutlinedInput-notchedOutline':
                  {
                    borderWidth: '1.5px',
                    borderStyle: 'solid',
                  },
                '& .MuiFormHelperText-root.Mui-error': {
                  color: theme.palette.error.main,
                  fontSize: '0.875rem',
                  fontWeight: 400,
                  lineHeight: 1.43,
                  letterSpacing: '0.01071em',
                  fontStyle: 'normal',
                },
              }}
            />
          </Stack>
          <Stack width="100%" gap={1}>
            <Typography variant="heavyb1" color="grey.800">
              Product Category *
            </Typography>
            {categories?.facetValues?.items && (
              <FormControl
                fullWidth
                // error={!!errors.category}
              >
                <Select
                  name="category"
                  value={category}
                  onChange={handleCategoryChange}
                >
                  <MenuItem value="choose_category_label" disabled>
                    <Typography
                      variant="b1"
                      sx={{ color: 'grey.500', fontStyle: 'italic' }}
                    >
                      Choose a category
                    </Typography>
                  </MenuItem>
                  {categories?.facetValues?.items.map((item) => (
                    <MenuItem key={item.id} value={item.id}>
                      {item.name}
                    </MenuItem>
                  ))}
                </Select>
                {/* {errors.category && (
                  <FormHelperText error>{errors.category}</FormHelperText>
                )} */}
              </FormControl>
            )}
          </Stack>
          <Stack width="100%" gap={1}>
            <Typography variant="heavyb1" color="grey.800">
              Display on store
            </Typography>
            <Switch color="primary" defaultChecked onChange={{}} checked />
          </Stack>
          <Stack
            width="100%"
            gap={2}
            sx={{ display: 'flex', alignItems: 'flex-start' }}
          >
            <Typography variant="heavyb1" color="grey.800">
              Add few product images
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={6}>
                <Box
                  className="flexCenter"
                  sx={{
                    width: '100%',
                    aspectRatio: 1,
                    border: '0.15rem dashed #bdbdbd',
                  }}
                >
                  <IconButton>
                    <AddAPhotoIcon
                      sx={{ fontSize: '50px', color: 'primary.main' }}
                    />
                  </IconButton>
                </Box>
              </Grid>
            </Grid>
          </Stack>
          <LoadingButton
            loading={false}
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
            label="Create Product"
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
        </Stack>
      </Container>
    </Box>
  );
}

export default AddOrUpdateItem;
