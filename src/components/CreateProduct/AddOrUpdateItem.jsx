import { useLazyQuery, useMutation, useQuery } from '@apollo/client';
import {
  Box,
  Button,
  Container,
  Drawer,
  FormControl,
  FormHelperText,
  Grid,
  IconButton,
  MenuItem,
  Select,
  Stack,
  Switch,
  Typography,
  useTheme,
} from '@mui/material';
import { useEffect, useState } from 'react';
import { GET_FACET_VALUE_LIST } from '../../libs/graphql/definitions/facet-definitions';
import {
  CREATE_ASSETS,
  CREATE_PRODUCT,
  CREATE_PRODUCT_VARIANTS,
  DELETE_ASSETS,
  GET_PRODUCT_TO_EDIT,
  UPDATE_PRODUCT,
  UPDATE_PRODUCT_VARIANTS,
} from '../../libs/graphql/definitions/product-definitions';
import UploadIcon from '@mui/icons-material/Upload';
import WestIcon from '@mui/icons-material/West';
import AddAPhotoIcon from '@mui/icons-material/AddAPhoto';
import LoadingButton from '../common/LoadingButton';
import DescriptionEditor from './DescriptionEditor';
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import ImageItem from './ImageItem';
import StyledTextField from '../common/styled/StyledTextField';
import ValidationErrorAlert from '../common/Alerts/ValidationErrorAlert';
import ServiceErrorAlert from '../common/Alerts/ServiceErrorAlert';
import { GET_PRODUCT_SIMPLE } from '../../libs/graphql/definitions/product-definitions';
import UpdateItemSkeleton from './UpdateItemSkeleton';
import CustomSnackBar from '../common/Snackbars/CustomSnackBar';
// import { useNavigate } from 'react-router-dom';

const AddOrUpdateItem = ({
  handleDialogClose,
  adminId,
  adminName,
  sellerFacetValueId,
  callbackOnAdd,
  productToEditId,
  productToEdit,
  initialAssets,
}) => {
  const [createAssets] = useMutation(CREATE_ASSETS);
  const [createProduct] = useMutation(CREATE_PRODUCT);
  const [createProductVariant] = useMutation(CREATE_PRODUCT_VARIANTS);
  const [deleteAssets] = useMutation(DELETE_ASSETS);
  const [updateProduct] = useMutation(UPDATE_PRODUCT);
  const [updateProductVariant] = useMutation(UPDATE_PRODUCT_VARIANTS);
  const [mainImageIndex, setMainImageIndex] = useState('');
  const [creatingOrUpdatingProduct, setCreatingOrUpdatingProduct] =
    useState(false);
  const [productUpdated, setProductUpdated] = useState(false);
  const [productToEdit2, setProductToEdit2] = useState(null);

  const [existingImages, setExistingImages] = useState([]);
  const [existingImagesToRemove, setExistingImagesToRemove] = useState([]);
  const [newImages, setNewImages] = useState([]);
  const [newImagePreviews, setNewImagePreviews] = useState([]);

  //product image selection
  const [imageDrawerOpen, setImageDrawerOpen] = useState(false); // State for the Drawer
  const [image, setImage] = useState(null); // State for the selected image

  // Function to handle the drawer open and close
  const toggleImageDrawer = (open) => () => {
    setImageDrawerOpen(open);
  };

  // Function to handle file upload
  const handleFileUpload = (event) => {
    if (event.target.files) {
      const file = event.target.files[0];
      const preview = URL.createObjectURL(file);
      setImage({ file, preview });
    }
  };

  const theme = useTheme();

  const initialData = productToEdit2 || {
    id: '',
    name: '',
    description: '',
    price: null,
    enabled: true,
    categoryId: 'choose_category_label',
    category: '',
    mainImage: '',
    previewMainImage: '',
  };

  const [product, setProduct] = useState(initialData);

  const [validationErrors, setValidationErrors] = useState({
    name: false,
    description: false,
    price: false,
    image: false,
    category: false,
    mainImage: false,
    images: false,
  });
  const [serviceError, setServiceError] = useState(false);
  const [hasValidationErrors, setHasValidationErrors] = useState(false);

  const resetValidationErrors = () => {
    setServiceError(false);
    setValidationErrors((prev) =>
      Object.keys(prev).reduce((acc, key) => {
        acc[key] = false;
        return acc;
      }, {})
    );
    setHasValidationErrors(false);
  };

  const validationErrorMessages = {
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
          facetId: { eq: `${import.meta.env.VITE_VENDURE_CATEGORY_FACET_ID}` },
        },
      },
    },
  });

  const [fetchProduct, { loading, error, data }] = useLazyQuery(
    GET_PRODUCT_TO_EDIT,
    {
      variables: {
        id: productToEditId,
      },
      fetchPolicy: 'network-only',
      onCompleted: (fetchedData) => {
        console.log(fetchedData);
        const category = fetchedData.product.facetValues?.find(
          (obj) =>
            obj.facetId === `${import.meta.env.VITE_VENDURE_CATEGORY_FACET_ID}`
        );

        //create images by adding cover image as well
        const allImages = [...fetchedData.product.assets];

        if (allImages && fetchedData.product.featuredAsset) {
          allImages.push(fetchedData.product.featuredAsset);
        }

        //temp fix for http
        // Replace "https" with "http" in the preview property for all items
        const updatedAllImages = allImages.map((item) => ({
          ...item, // Spread the other properties
          preview: item.preview.replace('https://', 'http://'), // Modify the preview property
        }));

        setExistingImages(updatedAllImages);

        setProductToEdit2({
          id: fetchedData.product.id,
          name: fetchedData.product.name,
          description: fetchedData.product.description,
          price: fetchedData.product.variants[0]?.price,
          enabled: fetchedData.product.enabled,
          categoryId: category?.id,
          category: category?.name ?? '',
          mainImage: fetchedData.product.featuredAsset,
          previewMainImage: fetchedData.product.featuredAsset?.preview,
        });
      },
    }
  );

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

  const handleNewImage = (event) => {
    //close image drawer
    setImageDrawerOpen(false);
    if (event.target.files) {
      const files = Array.from(event.target.files);
      const previewImages = files.map((file) => URL.createObjectURL(file));
      setNewImages((prev) => [...prev, ...files]);
      setNewImagePreviews((prev) => [...prev, ...previewImages]);
    }
  };

  const handleRemoveImage = (index, isNew, closeImageMenu) => {
    closeImageMenu();
    if (isNew) {
      if (mainImageIndex === `new-${index}`) {
        setMainImageIndex('');
      } else if (mainImageIndex && mainImageIndex.startsWith('new-')) {
        const mainIndex = parseInt(mainImageIndex.split('-')[1], 10);
        if (mainIndex > index) {
          setMainImageIndex(`new-${mainIndex - 1}`);
        }
      }

      let updatedImages = [...newImages];
      let updatedPreviewImages = [...newImagePreviews];
      updatedImages = updatedImages.filter((_, i) => i !== index);
      updatedPreviewImages = updatedPreviewImages.filter((_, i) => i !== index);
      setNewImages(updatedImages);
      setNewImagePreviews(updatedPreviewImages);
    } else {
      if (mainImageIndex === `existing-${index}`) {
        setMainImageIndex('');
      } else if (mainImageIndex && mainImageIndex.startsWith('existing-')) {
        const mainIndex = parseInt(mainImageIndex.split('-')[1], 10);
        if (mainIndex > index) {
          setMainImageIndex(`new-${mainIndex - 1}`);
        }
      }
      const removedAsset = existingImages[index];
      setExistingImagesToRemove([...existingImagesToRemove, removedAsset.id]);
      setExistingImages(existingImages.filter((_, i) => i !== index));
    }
  };

  const handleSelectCoverImage = (index, existing, closeImageMenu) => {
    closeImageMenu();
    setMainImageIndex(existing ? `existing-${index}` : `new-${index}`);
  };

  const resetForm = () => {
    console.log('reset form called');
    setProduct({
      id: '',
      name: '',
      description: '',
      price: null,
      enabled: true,
      categoryId: '',
      category: '',
      mainImage: '',
      previewMainImage: '',
    });
  };

  // const handleSubmitold = async (event) => {
  //   event.preventDefault();
  //   setCreatingOrUpdatingProduct(true);
  //   let featuredAsset;
  //   let remainingAssets = [];
  //   resetValidationErrors();

  //   if (!product.name) {
  //     setValidationErrors((prev) => ({
  //       ...prev,
  //       name: true,
  //     }));
  //   }
  //   if (!product.price) {
  //     setValidationErrors((prev) => ({
  //       ...prev,
  //       price: true,
  //     }));
  //   }
  //   if (!product.category) {
  //     setValidationErrors((prev) => ({
  //       ...prev,
  //       category: true,
  //     }));
  //   }
  //   if (product.name && product.price && product.category) {
  //     if (productToEditId != null && productToEdit2 != null) {
  //       if (removedImages && removedImages?.length > 0) {
  //         try {
  //           await deleteAssets({
  //             variables: {
  //               input: { assetIds: removedImages },
  //             },
  //           });
  //         } catch (err) {
  //           setServiceError(true);
  //           console.error('Failed to delete assets:', err);
  //         }
  //       }
  //       let newlyAddedAssets = [];
  //       if (product.images && product.images?.length > 0) {
  //         try {
  //           const result = await createAssets({
  //             variables: {
  //               input: Array.from(product.images).map((file) => ({
  //                 file,
  //               })),
  //             },
  //           });
  //           newlyAddedAssets = result?.data?.createAssets;
  //         } catch (err) {
  //           setServiceError(true);
  //           console.error('Failed to add assets:', err);
  //         }
  //       }
  //       if (mainImageIndex && mainImageIndex.startsWith('existing-')) {
  //         const mainIndex = parseInt(mainImageIndex.split('-')[1], 10);
  //         featuredAsset = existingAssets.splice(mainIndex, 1)[0]?.id;
  //         console.log('Removed featured asset');
  //       } else if (mainImageIndex && mainImageIndex.startsWith('new-')) {
  //         const mainIndex = parseInt(mainImageIndex.split('-')[1], 10);
  //         featuredAsset = newlyAddedAssets.splice(mainIndex, 1)[0]?.id;
  //       }
  //       const existingAssetIds = existingAssets?.map((asset) => asset.id);
  //       const newAssetIds = newlyAddedAssets?.map((asset) => asset.id);
  //       remainingAssets = [...existingAssetIds, ...newAssetIds];

  //       try {
  //         const result = await updateProduct({
  //           variables: {
  //             input: {
  //               id: product.id,
  //               translations: {
  //                 name: product.name,
  //                 description: product.description,
  //                 slug: product.name
  //                   ?.trim()
  //                   ?.replace(/\W+/g, '-')
  //                   .toLowerCase(),
  //                 languageCode: `${process.env.VITE_VENDURE_LANGUAGE_CODE}`,
  //               },
  //               enabled: product.enabled,
  //               facetValueIds: [sellerFacetValueId, product.categoryId], //remove only category facet id and add new one
  //               featuredAssetId: featuredAsset,
  //               assetIds: remainingAssets,
  //             },
  //           },
  //         });

  //         const updatedProd = result?.data?.updateProduct;

  //         if (!!result?.data) {
  //           const variantsResult = await updateProductVariant({
  //             variables: {
  //               input: {
  //                 id: updatedProd?.variantList?.items[0].id,
  //                 price: Number(product.price),
  //               },
  //             },
  //           });
  //           updatedProd.variants = variantsResult.data.updateProductVariants;
  //         }
  //         console.log(updatedProd);
  //         setProductUpdated(true);
  //       } catch (err) {
  //         setServiceError(true);
  //         console.error('Failed to update product:', err);
  //       }
  //     } else {
  //       //upload assets first
  //       if (product.images && product.images?.length > 0) {
  //         try {
  //           const result = await createAssets({
  //             variables: {
  //               input: Array.from(product.images).map((file) => ({
  //                 file,
  //               })),
  //             },
  //           });
  //           const allAssets = result?.data?.createAssets;
  //           if (allAssets.length === 1) {
  //             featuredAsset = allAssets[0].id;
  //           } else {
  //             featuredAsset = allAssets.splice(mainImageIndex, 1)[0]?.id;
  //             remainingAssets = allAssets.map((asset) => asset.id);
  //           }
  //         } catch (err) {
  //           console.error('Failed to add assets:', err);
  //           setServiceError(true);
  //         }
  //       }

  //       try {
  //         const result = await createProduct({
  //           variables: {
  //             input: {
  //               translations: {
  //                 name: product.name,
  //                 description: product.description,
  //                 slug: product.name
  //                   ?.trim()
  //                   ?.replace(/\W+/g, '-')
  //                   .toLowerCase(),
  //                 languageCode: `${process.env.VITE_VENDURE_LANGUAGE_CODE}`,
  //               },
  //               enabled: product.enabled,
  //               facetValueIds: [sellerFacetValueId, product.categoryId],
  //               featuredAssetId: featuredAsset,
  //               assetIds: remainingAssets,
  //               customFields: {
  //                 adminId: adminId,
  //                 adminName: adminName,
  //               },
  //             },
  //           },
  //         });

  //         const newProd = result?.data?.createProduct;
  //         if (!!result?.data) {
  //           const variantsResult = await createProductVariant({
  //             variables: {
  //               input: {
  //                 productId: result?.data?.createProduct?.id,
  //                 sku:
  //                   result?.data?.createProduct?.slug +
  //                   '-' +
  //                   result?.data?.createProduct?.id,
  //                 price: Number(product.price),
  //                 translations: {
  //                   name: product.name,
  //                   languageCode: 'en',
  //                 },
  //               },
  //             },
  //           });
  //           newProd.variants = variantsResult.data.createProductVariants;
  //         }
  //         callbackOnAdd(newProd);
  //         afterProductCreated();
  //       } catch (err) {
  //         console.error('Failed to add product:', err);
  //         setServiceError(true);
  //       }
  //     }
  //   } else {
  //     setHasValidationErrors(true);
  //   }
  //   setCreatingOrUpdatingProduct(false);
  // };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setCreatingOrUpdatingProduct(true);
    resetValidationErrors();
    if (!product.name) {
      setValidationErrors((prev) => ({
        ...prev,
        name: true,
      }));
    }
    if (!product.price) {
      setValidationErrors((prev) => ({
        ...prev,
        price: true,
      }));
    }
    if (!product.category) {
      setValidationErrors((prev) => ({
        ...prev,
        category: true,
      }));
    }
    if (product.name && product.price && product.category) {
      if (productToEditId != null && productToEdit2 != null) {
        updateExistingProduct();
      } else {
        createNewProduct();
      }
    } else {
      setHasValidationErrors(true);
      setCreatingOrUpdatingProduct(false);
    }
  };

  const createNewProduct = async () => {
    let featuredAsset;
    let remainingAssets = [];
    //upload assets first
    if (newImages.length > 0) {
      try {
        const result = await createAssets({
          variables: {
            input: Array.from(newImages).map((file) => ({
              file,
            })),
          },
        });
        const allAssets = result?.data?.createAssets;
        if (allAssets.length === 1) {
          featuredAsset = allAssets[0].id;
        } else {
          featuredAsset = allAssets.splice(mainImageIndex, 1)[0]?.id;
          remainingAssets = allAssets.map((asset) => asset.id);
        }
      } catch (err) {
        console.error('Failed to add assets:', err);
        setServiceError(true);
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
              languageCode: `${import.meta.env.VITE_VENDURE_LANGUAGE_CODE}`,
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
      afterProductCreated();
    } catch (err) {
      console.error('Failed to add product:', err);
      setServiceError(true);
    } finally {
      setCreatingOrUpdatingProduct(false);
    }
  };

  const updateExistingProduct = async () => {
    console.log(product);
    let featuredAsset;
    let remainingAssets = [];
    if (existingImagesToRemove && existingImagesToRemove?.length > 0) {
      console.log('deleting assets');
      try {
        await deleteAssets({
          variables: {
            input: { assetIds: existingImagesToRemove },
          },
        });
      } catch (err) {
        setServiceError(true);
        console.error('Failed to delete assets:', err);
      }
    }
    let newlyAddedAssets = [];
    if (newImages.length > 0) {
      try {
        const result = await createAssets({
          variables: {
            input: Array.from(newImages).map((file) => ({
              file,
            })),
          },
        });
        newlyAddedAssets = result?.data?.createAssets;
      } catch (err) {
        setServiceError(true);
        console.error('Failed to add assets:', err);
      }
    }
    if (mainImageIndex && mainImageIndex.startsWith('existing-')) {
      const mainIndex = parseInt(mainImageIndex.split('-')[1], 10);
      featuredAsset = existingImages.splice(mainIndex, 1)[0]?.id;
      console.log('Removed featured asset');
    } else if (mainImageIndex && mainImageIndex.startsWith('new-')) {
      const mainIndex = parseInt(mainImageIndex.split('-')[1], 10);
      featuredAsset = newlyAddedAssets.splice(mainIndex, 1)[0]?.id;
    }
    const existingAssetIds = existingImages?.map((asset) => asset.id);
    const newAssetIds = newlyAddedAssets?.map((asset) => asset.id);
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
              languageCode: `${import.meta.env.VITE_VENDURE_LANGUAGE_CODE}`,
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
      setProductUpdated(true);
    } catch (err) {
      setServiceError(true);
      console.error('Failed to update product:', err);
    } finally {
      setCreatingOrUpdatingProduct(false);
    }
  };

  function afterProductCreated() {
    // setCreatedProduct(true);
    // setTimeout(() => {
    //   handleDialogClose();
    // }, 1000);
    handleDialogClose();
  }

  useEffect(() => {
    if (productToEditId != null) {
      fetchProduct();
    }
  }, [fetchProduct, productToEditId]);

  useEffect(() => {
    if (productToEditId != null && productToEdit2 != null) {
      setProduct(productToEdit2);
      if (existingImages) {
        const index = existingImages?.length ? existingImages.length - 1 : -1;
        setMainImageIndex(`existing-${index}`);
      }
    }
  }, [productToEdit2, existingImages, productToEditId]);

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
          variant="h6"
          color={theme.palette.grey[900]}
          sx={{
            textAlign: 'center',
            margin: 'auto',
          }}
        >
          {productToEditId != null ? 'Edit Product' : 'Add new product'}
        </Typography>
      </Stack>
      {productToEditId != null && loading && <UpdateItemSkeleton />}
      {(productToEditId == null || (productToEditId != null && !loading)) && (
        <Container sx={{ px: 3 }}>
          <Stack
            component="form"
            noValidate
            autoComplete="off"
            onSubmit={handleSubmit}
            gap={3}
            sx={{ mt: 5, display: 'flex', alignItems: 'center' }}
          >
            <Stack width="100%" gap={1}>
              <Typography variant="heavylabel1" color="grey.800">
                Product Name
              </Typography>
              <StyledTextField
                id="name"
                name="name"
                variant="outlined"
                value={product.name}
                onChange={handleChange}
                placeholder="Enter name of product"
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
                Product Description
              </Typography>
              <DescriptionEditor
                value={product.description}
                setValue={setDescription}
              />
            </Stack>
            <Stack width="100%" gap={1}>
              <Typography variant="heavylabel1" color="grey.800">
                Product Price
              </Typography>
              <StyledTextField
                id="price"
                name="price"
                variant="outlined"
                type="number"
                value={product.price}
                onChange={handleChange}
                placeholder="Enter product price in rupees (₹)"
                size="small"
                helperText={
                  validationErrors.price && validationErrorMessages.price
                }
                error={validationErrors.price}
                sx={{
                  width: '100%',
                  borderWidth: '20px',
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
                Product Category
              </Typography>
              <FormControl
                fullWidth
                error={validationErrors.category}
                sx={{
                  '& .MuiFormLabel-root.Mui-error': {
                    color: theme.palette.error.main,
                  },
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '8px', // Adjust the border radius as needed
                    borderStyle: 'solid',
                    borderWidth: '1px',
                    borderColor: 'grey.600',
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
                  '& .MuiOutlinedInput-root.Mui-error': {
                    borderColor: theme.palette.error.main,
                  },
                }}
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
                  {categories?.facetValues?.items?.map((item) => (
                    <MenuItem key={item.id} value={item.id}>
                      {item.name}
                    </MenuItem>
                  ))}
                </Select>
                {validationErrors.category && (
                  <FormHelperText error>
                    {validationErrorMessages.category}
                  </FormHelperText>
                )}
              </FormControl>
            </Stack>
            <Stack width="100%" gap={1}>
              <Typography variant="heavylabel1" color="grey.800">
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
              gap={3}
              sx={{ display: 'flex', alignItems: 'flex-start' }}
            >
              <Button
                variant="contained"
                color="primary"
                sx={{
                  borderRadius: '25px',
                }}
                onClick={toggleImageDrawer(true)}
              >
                <AddPhotoAlternateIcon sx={{ fontSize: '35px' }} />
                <Typography variant="button1">Add Images</Typography>
              </Button>
              <Grid container spacing={1}>
                {existingImages.map((asset, index) => (
                  <Grid item xs={6}>
                    <ImageItem
                      existing={true}
                      index={index}
                      mainImageIndex={mainImageIndex}
                      imageSrc={asset.preview}
                      handleSelectCoverImage={handleSelectCoverImage}
                      handleRemoveImage={handleRemoveImage}
                    />
                  </Grid>
                ))}
                {newImagePreviews.map((image, index) => (
                  <Grid item xs={6}>
                    <ImageItem
                      existing={false}
                      index={index}
                      mainImageIndex={mainImageIndex}
                      imageSrc={image}
                      handleSelectCoverImage={handleSelectCoverImage}
                      handleRemoveImage={handleRemoveImage}
                    />
                  </Grid>
                ))}
              </Grid>
            </Stack>
            {hasValidationErrors && <ValidationErrorAlert />}
            {serviceError && <ServiceErrorAlert />}
            <Stack sx={{ width: '100%' }} gap={2}>
              <LoadingButton
                loading={creatingOrUpdatingProduct}
                variant="contained"
                type="submit"
                buttonStyles={{
                  backgroundColor: 'primary.dark',
                  borderRadius: '25px',
                }}
                buttonContainerStyles={{
                  width: '100%',
                  height: '55px',
                }}
                label={
                  productToEditId == null ? 'Create Product' : 'Update Product'
                }
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
              <Button
                variant="outlined"
                onClick={handleDialogClose}
                fullWidth
                sx={{
                  borderRadius: '25px',
                  borderWidth: '1px',
                  borderColor: '#1565c0',
                  width: '100%',
                  height: '55px',
                }}
              >
                <Typography variant="button1">Go Back</Typography>
              </Button>
            </Stack>
          </Stack>
        </Container>
      )}
      {/* Drawer for image upload options */}
      <Drawer
        disablePortal={true}
        anchor="bottom"
        open={imageDrawerOpen}
        onClose={toggleImageDrawer(false)}
        sx={{ height: '50%' }}
      >
        <Box sx={{ px: 3, py: 2 }}>
          <Typography variant="h6" sx={{ color: 'grey.800' }}>
            Add product images
          </Typography>
          <Grid container spacing={1} direction="column" sx={{ mt: 1 }}>
            <Grid item>
              <Button
                component="label"
                fullWidth
                variant="outlined"
                sx={{ p: 1, borderColor: 'primary.dark', borderRadius: '20px' }}
              >
                <input
                  accept="image/*"
                  id="capture-image"
                  type="file"
                  capture="environment"
                  onChange={handleNewImage}
                  style={{ display: 'none' }}
                />
                <AddAPhotoIcon sx={{ mr: 1, color: 'primary.dark' }} />
                <Typography variant="button1">Take a photo</Typography>
              </Button>
            </Grid>
            <Grid item>
              <Button
                component="label"
                fullWidth
                variant="outlined"
                sx={{ p: 1, borderColor: 'primary.dark', borderRadius: '20px' }}
              >
                <UploadIcon sx={{ mr: 1, color: 'primary.dark' }} />
                <Typography variant="button1">Upload from gallery</Typography>
                <input
                  accept="image/*"
                  type="file"
                  hidden
                  multiple
                  onChange={handleNewImage}
                />
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Drawer>
      <CustomSnackBar
        message="Product updated successfully"
        severity="success"
        color="success"
        duration={3000}
        vertical="top"
        horizontal="center"
        open={productUpdated}
        handleClose={() => {
          setProductUpdated(false);
        }}
      />
    </Box>
  );
};

export default AddOrUpdateItem;
