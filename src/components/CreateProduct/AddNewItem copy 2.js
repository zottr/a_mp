import { useMutation, useQuery } from '@apollo/client';
import {
  Box,
  Button,
  Card,
  CardActions,
  CardMedia,
  Checkbox,
  Container,
  FormControl,
  FormControlLabel,
  FormHelperText,
  Grid,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  Stack,
  Switch,
  TextField,
  Tooltip,
  Typography,
  useTheme,
} from '@mui/material';
import { ChangeEvent, useEffect, useState } from 'react';
import { GET_FACET_VALUE_LIST } from '../../libs/graphql/definitions/facet-definitions';
import {
  CREATE_ASSETS,
  CREATE_PRODUCT,
  CREATE_PRODUCT_VARIANTS,
  DELETE_ASSETS,
  UPDATE_PRODUCT,
  UPDATE_PRODUCT_VARIANTS,
} from '../../libs/graphql/definitions/product-definitions';
import {
  Asset,
  Product as gqlProduct,
} from '../../libs/graphql/generated-types';
import DeleteIcon from '@mui/icons-material/Delete';
import StarIcon from '@mui/icons-material/Star';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import WestIcon from '@mui/icons-material/West';
import AddAPhotoIcon from '@mui/icons-material/AddAPhoto';
import LoadingButton from '../common/LoadingButton';
import DescriptionEditor from './DescriptionEditor';

const AddOrUpdateItem = ({
  handleDialogClose,
  adminId,
  adminName,
  sellerFacetValueId,
  callbackOnAdd,
  productToEdit,
  initialAssets,
}) => {
  const [createAssets] = useMutation(CREATE_ASSETS);
  const [createProduct] = useMutation(CREATE_PRODUCT);
  const [createProductVariant] = useMutation(CREATE_PRODUCT_VARIANTS);
  const [deleteAssets] = useMutation(DELETE_ASSETS);
  const [updateProduct] = useMutation(UPDATE_PRODUCT);
  const [updateProductVariant] = useMutation(UPDATE_PRODUCT_VARIANTS);
  const [existingAssets, setExistingAssets] = useState(initialAssets || []);
  const [removedImages, setRemovedImages] = useState([]);
  const [mainImageIndex, setMainImageIndex] = useState();

  const theme = useTheme();

  const initialData = productToEdit || {
    id: '',
    name: '',
    description: '',
    price: 0,
    enabled: false,
    categoryId: 'choose_category_label',
    category: '',
    images: [],
    previewImages: [],
    mainImage: '',
    previewMainImage: '',
  };

  const [product, setProduct] = useState(initialData);

  const [errors, setErrors] = useState({
    name: false,
    description: false,
    price: false,
    image: false,
    category: false,
    mainImage: false,
    images: false,
  });

  const errorMessages = {
    name: 'Enter a valid product name',
    description: '',
    price: 'Enter a valid product price',
    image: '',
    category: 'Choose a category',
    mainImage: '',
    images: '',
  };

  const { data: categories } = useQuery(GET_FACET_VALUE_LIST, {
    variables: {
      options: {
        filter: {
          facetId: { eq: `${process.env.REACT_APP_VENDURE_CATEGORY_FACET_ID}` },
        },
      },
    },
  });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setProduct((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  function setDescription(value) {
    setProduct((prev) => ({
      ...prev,
      description: value,
    }));
  }

  const handleCategoryChange = (event) => {
    const { value } = event.target;
    setProduct((prev) => ({
      ...prev,
      categoryId: value,
      category:
        categories?.facetValues?.items?.find((obj) => obj.id === value)?.name ??
        '',
    }));
  };

  const handleImageChange = (event) => {
    if (event.target.files) {
      const files = Array.from(event.target.files);
      const previewImages = files.map((file) => URL.createObjectURL(file));
      setProduct((prev) => ({
        ...prev,
        images: [...prev.images, ...files],
        previewImages: [...prev.previewImages, ...previewImages],
      }));
      setErrors((prev) => ({
        ...prev,
        mainImage: '',
        images: '',
      }));
    }
  };

  const handleRemoveImage = (index, isNew) => {
    if (isNew) {
      if (mainImageIndex === `new-${index}`) {
        setMainImageIndex('');
      } else if (mainImageIndex && mainImageIndex.startsWith('new-')) {
        const mainIndex = parseInt(mainImageIndex.split('-')[1], 10);
        if (mainIndex > index) {
          setMainImageIndex(`new-${mainIndex - 1}`);
        }
      }
      setProduct((prev) => {
        const updatedImages = [...prev.images];
        const updatedPreviewImages = [...prev.previewImages];
        updatedImages.filter((_, i) => i !== index);
        updatedPreviewImages.filter((_, i) => i !== index);
        return {
          ...prev,
          images: updatedImages,
          previewImages: updatedPreviewImages,
        };
      });
    } else {
      if (mainImageIndex === `existing-${index}`) {
        setMainImageIndex('');
      } else if (mainImageIndex && mainImageIndex.startsWith('existing-')) {
        const mainIndex = parseInt(mainImageIndex.split('-')[1], 10);
        if (mainIndex > index) {
          setMainImageIndex(`new-${mainIndex - 1}`);
        }
      }
      const removedAsset = existingAssets[index];
      setRemovedImages([...removedImages, removedAsset.id]);
      setExistingAssets(existingAssets.filter((_, i) => i !== index));
    }
  };

  const handleSelectMainImage = (index, isNew) => {
    setMainImageIndex(isNew ? `new-${index}` : `existing-${index}`);
  };

  const resetForm = () => {
    setProduct({
      id: '',
      name: '',
      description: '',
      price: 0,
      enabled: true,
      categoryId: '',
      category: '',
      images: [],
      previewImages: [],
      mainImage: '',
      previewMainImage: '',
    });
  };

  const handleSubmit = async () => {
    let featuredAsset;
    let remainingAssets = [];
    let validationErrors = {
      name: '',
      description: '',
      price: '',
      image: '',
      category: '',
      mainImage: '',
      images: '',
    };
    if (!product.name) {
      validationErrors.name = 'Name is required';
    }

    if (!product.description) {
      validationErrors.description = 'Description is required';
    }

    if (!product.price) {
      validationErrors.price = 'Price is required';
    }

    if (product.images?.length < 1 && existingAssets.length < 1) {
      validationErrors.images = 'Atleast one image is required';
    }

    if (!mainImageIndex && product.images?.length > 1) {
      validationErrors.mainImage = 'Please select main image for cover';
    }

    if (!product.category) {
      validationErrors.category = 'Please select a category';
    }

    if (Object.values(validationErrors).some((error) => error)) {
      setErrors(validationErrors);
      return;
    } else {
      setErrors({
        name: '',
        description: '',
        price: '',
        image: '',
        category: '',
        mainImage: '',
        images: '',
      });
    }

    if (productToEdit) {
      if (removedImages && removedImages?.length > 0) {
        try {
          await deleteAssets({
            variables: {
              input: { assetIds: removedImages },
            },
          });
        } catch (err) {
          console.error('Failed to delete assets:', err);
        }
      }

      let newlyAddedAssets = [];
      if (product.images && product.images?.length > 0) {
        try {
          const result = await createAssets({
            variables: {
              input: Array.from(product.images).map((file) => ({
                file,
              })),
            },
          });
          newlyAddedAssets = result?.data?.createAssets;
        } catch (err) {
          console.error('Failed to add assets:', err);
        }
      }

      console.log(mainImageIndex);
      if (mainImageIndex && mainImageIndex.startsWith('existing-')) {
        const mainIndex = parseInt(mainImageIndex.split('-')[1], 10);
        featuredAsset = existingAssets.splice(mainIndex, 1)[0]?.id;
        console.log('Removed featured asset');
      } else if (mainImageIndex && mainImageIndex.startsWith('new-')) {
        const mainIndex = parseInt(mainImageIndex.split('-')[1], 10);
        featuredAsset = newlyAddedAssets.splice(mainIndex, 1)[0]?.id;
      }

      const existingAssetIds = existingAssets?.map((asset: any) => asset.id);
      const newAssetIds = newlyAddedAssets?.map((asset: any) => asset.id);
      remainingAssets = [...existingAssetIds, ...newAssetIds];

      try {
        const result = await updateProduct({
          variables: {
            input: {
              id: product.id,
              translations: {
                name: product.name,
                description: product.description,
                slug: product.name?.trim()?.replace(/\W+/g, '-').toLowerCase(),
                languageCode: `${process.env.REACT_APP_VENDURE_LANGUAGE_CODE}`,
              },
              enabled: product.enabled,
              facetValueIds: [sellerFacetValueId, product.categoryId], //remove only category facet id and add new one
              featuredAssetId: featuredAsset,
              assetIds: remainingAssets,
            },
          },
        });

        const updatedProd = result?.data?.updateProduct;

        if (!!result?.data) {
          const variantsResult = await updateProductVariant({
            variables: {
              input: {
                id: updatedProd?.variantList?.items[0].id,
                price: Number(product.price),
              },
            },
          });
          updatedProd.variants = variantsResult.data.updateProductVariants;
        }
        console.log(updatedProd);
      } catch (err) {
        console.error('Failed to add product:', err);
      }
    } else {
      //upload assets first
      if (product.images && product.images?.length > 0) {
        try {
          const result = await createAssets({
            variables: {
              input: Array.from(product.images).map((file) => ({
                file,
              })),
            },
          });
          const allAssets = result?.data?.createAssets;
          if (allAssets.length === 1) {
            featuredAsset = allAssets[0].id;
          } else {
            featuredAsset = allAssets.splice(mainImageIndex, 1)[0]?.id;
            remainingAssets = allAssets.map((asset: any) => asset.id);
          }
        } catch (err) {
          console.error('Failed to add assets:', err);
        }
      }

      try {
        const result = await createProduct({
          variables: {
            input: {
              translations: {
                name: product.name,
                description: product.description,
                slug: product.name?.trim()?.replace(/\W+/g, '-').toLowerCase(),
                languageCode: `${process.env.REACT_APP_VENDURE_LANGUAGE_CODE}`,
              },
              enabled: product.enabled,
              facetValueIds: [sellerFacetValueId, product.categoryId],
              featuredAssetId: featuredAsset,
              assetIds: remainingAssets,
              customFields: {
                adminId: adminId,
                adminName: adminName,
              },
            },
          },
        });

        const newProd = result?.data?.createProduct;
        if (!!result?.data) {
          const variantsResult = await createProductVariant({
            variables: {
              input: {
                productId: result?.data?.createProduct?.id,
                sku:
                  result?.data?.createProduct?.slug +
                  '-' +
                  result?.data?.createProduct?.id,
                price: Number(product.price),
                translations: {
                  name: product.name,
                  languageCode: 'en',
                },
              },
            },
          });
          newProd.variants = variantsResult.data.createProductVariants;
        }
        callbackOnAdd(newProd);
        resetForm();
      } catch (err) {
        console.error('Failed to add product:', err);
      }
    }
  };

  useEffect(() => {
    if (productToEdit) {
      setProduct(productToEdit);
      if (initialAssets) {
        const index = initialAssets?.length ? initialAssets.length - 1 : -1;
        setMainImageIndex(`existing-${index}`);
      }
    }
  }, [productToEdit, initialAssets]);

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
          {productToEdit ? 'Update Product' : 'Add new product'}
        </Typography>
      </Stack>
      <Container sx={{ px: 2 }}>
        <Stack
          component="form"
          noValidate
          autoComplete="off"
          onSubmit={handleSubmit}
          gap={3}
          sx={{ mt: 5, display: 'flex', alignItems: 'center' }}
        >
          <Stack width="100%" gap={1}>
            <Typography variant="heavyb1" color="grey.800">
              Product Name <strong>*</strong>
            </Typography>
            <TextField
              id="name"
              name="name"
              variant="outlined"
              value={product.name}
              onChange={handleChange}
              placeholder="Enter name of product"
              size="small"
              helperText={errors.name && errorMessages.name}
              error={errors.name}
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
            <DescriptionEditor
              value={product.description}
              setValue={setDescription}
            />
          </Stack>
          <Stack width="100%" gap={1}>
            <Typography variant="heavyb1" color="grey.800">
              Product Price <strong>*</strong>
            </Typography>
            <TextField
              id="price"
              name="price"
              variant="outlined"
              type="number"
              value={product.price}
              onChange={handleChange}
              placeholder="Enter product price in rupees (₹)"
              size="small"
              helperText={errors.price && errorMessages.price}
              error={errors.price}
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
              Product Category <strong>*</strong>
            </Typography>
            {categories?.facetValues?.items && (
              <FormControl
                fullWidth
                // error={!!errors.category}
              >
                <Select
                  name="category"
                  value={product.categoryId}
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
                {errors.category && (
                  <FormHelperText error>{errors.category}</FormHelperText>
                )}
              </FormControl>
            )}
          </Stack>
          <Stack width="100%" gap={1}>
            <Typography variant="heavyb1" color="grey.800">
              Display on store
            </Typography>
            <Switch
              color="primary"
              checked={product.enabled}
              onChange={(event) => {
                setProduct((prev) => ({
                  ...prev,
                  enabled: event.target.checked,
                }));
              }}
            />
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
                    width: '75%',
                    aspectRatio: 1,
                    border: '0.15rem dashed #1976d2',
                  }}
                >
                  <input
                    accept="image/*"
                    id="capture-image"
                    type="file"
                    capture="environment"
                    onChange={handleImageChange}
                    style={{ display: 'none' }}
                  />
                  <label htmlFor="capture-image">
                    <Tooltip title="Capture and Upload">
                      <IconButton
                        color="primary"
                        aria-label="capture"
                        component="span"
                      >
                        <AddAPhotoIcon
                          sx={{ fontSize: '50px', color: 'primary.main' }}
                        />
                      </IconButton>
                    </Tooltip>
                  </label>
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
};

export default AddOrUpdateItem;
