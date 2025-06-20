import { useLazyQuery, useMutation, useQuery } from '@apollo/client';
import {
  Box,
  Button,
  Container,
  Drawer,
  FormControl,
  FormHelperText,
  Grid,
  MenuItem,
  Select,
  Stack,
  Switch,
  Typography,
  useTheme,
} from '@mui/material';
import React, { useEffect, useState } from 'react';
import { GET_FACET_VALUE_LIST } from '../../libs/graphql/definitions/facet-definitions';
import {
  CREATE_ASSETS,
  CREATE_PRODUCT,
  CREATE_PRODUCT_VARIANTS,
  DELETE_ASSETS,
  DELETE_PRODUCT,
  GET_PRODUCT_TO_EDIT,
  UPDATE_PRODUCT,
  UPDATE_PRODUCT_VARIANTS,
} from '../../libs/graphql/definitions/product-definitions';
import UploadIcon from '@mui/icons-material/Upload';
import AddAPhotoIcon from '@mui/icons-material/AddAPhoto';
import LoadingButton from '../common/LoadingButton';
import DescriptionEditor from './DescriptionEditor';
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import ImageItem from './ImageItem';
import StyledTextField from '../common/styled/StyledTextField';
import ValidationErrorAlert from '../common/Alerts/ValidationErrorAlert';
import ServiceErrorAlert from '../common/Alerts/ServiceErrorAlert';
import UpdateItemSkeleton from './UpdateItemSkeleton';
import CustomSnackBar from '../common/Snackbars/CustomSnackBar';
import { useUserContext } from '../../hooks/useUserContext';
import { useNavigate } from 'react-router-dom';
import MainAppBar from '../common/MainAppBar';
import { AddOrUpdateItemBreadcrumbs } from './AddOrUpdateItemBreadcrumbs';
import DeleteProductDialog from './DeleteProductDialog';
import Error404Alert from '../common/Alerts/Error404Alert';
import { compressImage } from '../../utils/CommonUtils';

interface ProductType {
  id: string;
  name: string;
  description: string;
  price?: string | undefined;
  enabled: boolean;
  categoryId?: string;
  categoryName: string;
  mainImage?: any; // Adjust type if needed
  previewMainImage?: string;
}

interface AddOrUpdateItemProps {
  productToEditId?: string; // Assuming it's an optional string
}

const AddOrUpdateItem: React.FC<AddOrUpdateItemProps> = ({
  productToEditId = '',
}) => {
  const navigate = useNavigate();
  const [createAssets] = useMutation(CREATE_ASSETS);
  const [createProduct] = useMutation(CREATE_PRODUCT);
  const [createProductVariant] = useMutation(CREATE_PRODUCT_VARIANTS);
  const [deleteAssets] = useMutation(DELETE_ASSETS);
  const [deleteProduct] = useMutation(DELETE_PRODUCT);
  const [updateProduct] = useMutation(UPDATE_PRODUCT);
  const [updateProductVariant] = useMutation(UPDATE_PRODUCT_VARIANTS);
  const [mainImageIndex, setMainImageIndex] = useState('');
  const [creatingOrUpdatingProduct, setCreatingOrUpdatingProduct] =
    useState(false);
  const [deletingProduct, setDeletingProduct] = useState(false);
  const [productUpdated, setProductUpdated] = useState(false);
  const [productToEdit, setProductToEdit] = useState<ProductType | null>(null);
  const [openDeleteDialog, setOpenDeleteDialog] = React.useState(false);
  const [invalidProductId, setInvalidProductId] = React.useState(false);

  const { adminUser } = useUserContext();

  const [existingImages, setExistingImages] = useState<any[]>([]);
  const [existingImageIdsToRemove, setExistingImageIdsToRemove] = useState<
    any[]
  >([]);
  const [newImages, setNewImages] = useState<any[]>([]);
  const [newImagePreviews, setNewImagePreviews] = useState<any[]>([]);

  //product image selection
  const [imageDrawerOpen, setImageDrawerOpen] = useState(false); // State for the Drawer

  // Function to handle the drawer open and close
  const toggleImageDrawer = (open: any) => () => {
    setImageDrawerOpen(open);
  };

  const theme = useTheme();

  const [product, setProduct] = useState<ProductType>({
    id: '',
    name: '',
    description: '',
    price: '',
    enabled: true,
    categoryId: 'choose_category_label',
    categoryName: '',
    mainImage: '',
    previewMainImage: '',
  });

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
    setValidationErrors({
      name: false,
      description: false,
      price: false,
      image: false,
      category: false,
      mainImage: false,
      images: false,
    });
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
        if (fetchedData.product === null) setInvalidProductId(true);
        else {
          const category = fetchedData.product.facetValues?.find(
            (obj: any) =>
              obj.facetId ===
              `${import.meta.env.VITE_VENDURE_CATEGORY_FACET_ID}`
          );
          //create images by adding cover image as well (it already includes feature asset)
          const allImages = [...fetchedData.product.assets];
          setExistingImages(allImages);

          setProductToEdit({
            id: fetchedData.product.id,
            name: fetchedData.product.name,
            description: fetchedData.product.description,
            price: (
              Number(fetchedData.product.variants[0]?.price) / 100
            ).toString(), //we need to convert it to rupees
            enabled: fetchedData.product.enabled,
            categoryId: category?.id,
            categoryName: category?.name ?? '',
            mainImage: fetchedData.product.featuredAsset,
            previewMainImage: fetchedData.product.featuredAsset?.preview,
          });
        }
      },
    }
  );

  const handleChange = (event: any) => {
    const { name, value } = event.target;
    setProduct((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  function setDescription(value: any) {
    setProduct((prev) => ({
      ...prev,
      description: value,
    }));
  }

  const handleCategoryChange = (event: any) => {
    const { value } = event.target;
    setProduct((prev) => ({
      ...prev,
      categoryId: value,
      categoryName:
        categories?.facetValues?.items?.find((obj: any) => obj.id === value)
          ?.name ?? '',
    }));
  };

  const handleNewImage = async (event: any) => {
    // Close the image drawer
    setImageDrawerOpen(false);
    if (event.target.files) {
      const files = Array.from(event.target.files);
      // Compress each image (if needed), one by one
      const compressedFilesPromises = files.map((file) => compressImage(file));
      const compressedFiles = await Promise.all(compressedFilesPromises);
      // Create preview URLs from the (possibly compressed) files
      const previewImages = compressedFiles.map((file) =>
        URL.createObjectURL(file)
      );
      // Add to state
      setNewImages((prev) => [...prev, ...compressedFiles]);
      setNewImagePreviews((prev) => [...prev, ...previewImages]);
      if (existingImages.length === 0 && newImages.length === 0) {
        // First image, set as featured
        setMainImageIndex(`new-0`);
      }
    }
  };

  const handleRemoveImage = (index: any, isNew: any, closeImageMenu: any) => {
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
      setExistingImageIdsToRemove([
        ...existingImageIdsToRemove,
        removedAsset.id,
      ]);
      setExistingImages(existingImages.filter((_, i) => i !== index));
    }
  };

  const handleSelectCoverImage = (
    index: any,
    existing: any,
    closeImageMenu: any
  ) => {
    closeImageMenu();
    setMainImageIndex(existing ? `existing-${index}` : `new-${index}`);
  };

  const handleSubmit = async (event: any) => {
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
    if (!product.categoryName) {
      setValidationErrors((prev) => ({
        ...prev,
        category: true,
      }));
    }
    if (product.name && product.price && product.categoryName) {
      if (productToEditId !== '' && productToEdit != null) {
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
    let featuredAssetId;
    let allAssets;
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
        allAssets = result?.data?.createAssets;
        if (allAssets.length === 1) {
          featuredAssetId = allAssets[0].id;
        } else {
          const mainIndex = parseInt(mainImageIndex.split('-')[1], 10);
          featuredAssetId = allAssets[mainIndex]?.id;
        }
      } catch (err) {
        console.error('Failed to add assets:', err);
        setServiceError(true);
        setCreatingOrUpdatingProduct(false);
        return;
      }
    }
    try {
      const result = await createProduct({
        variables: {
          input: {
            translations: [
              {
                name: product.name,
                description: product.description,
                slug: product.name?.trim()?.replace(/\W+/g, '-').toLowerCase(),
                languageCode: `${import.meta.env.VITE_VENDURE_LANGUAGE_CODE}`,
              },
            ],
            enabled: product.enabled,
            // facetValueIds: [sellerFacetValueId, product.categoryId],
            facetValueIds: [product.categoryId],
            featuredAssetId: featuredAssetId,
            assetIds: Array.from([
              ...(allAssets ?? []).map((asset: any) => asset.id),
            ]),
            customFields: {
              adminId: adminUser?.id,
              adminName: adminUser?.customFields?.businessName,
              itemType: 'product',
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
              price: Math.round(Number(product.price) * 100),
              translations: [
                {
                  name: product.name,
                  languageCode: 'en',
                },
              ],
            },
          },
        });
        newProd.variants = variantsResult.data.createProductVariants;
      }
      // callbackOnAdd(newProd);
      afterProductCreated();
    } catch (err) {
      console.error('Failed to add product:', err);
      setServiceError(true);
    } finally {
      setCreatingOrUpdatingProduct(false);
    }
  };

  const handleDelete = async () => {
    setOpenDeleteDialog(true);
  };

  // const handleDelete = async () => {
  //   setDeletingProduct(true);
  //   let deletedProduct = false;
  //   //delete product
  //   try {
  //     const result = await deleteProduct({
  //       variables: {
  //         id: productToEditId,
  //       },
  //     });
  //     deletedProduct = true;
  //   } catch (err) {
  //     setServiceError(true);
  //     console.error('Failed to delete product', err);
  //   }
  //   //deleting associated assets
  //   if (existingImages && existingImages?.length > 0) {
  //     try {
  //       const result = await deleteAssets({
  //         variables: {
  //           input: { assetIds: existingImages?.map((asset) => asset.id) },
  //         },
  //       });
  //     } catch (err) {
  //       setServiceError(true);
  //       console.error('Failed to delete assets:', err);
  //     }
  //   }
  //   setDeletingProduct(false);
  //   if (deletedProduct) afterProductDeleted();
  // };

  const updateExistingProduct = async () => {
    let featuredAssetId;
    if (existingImageIdsToRemove && existingImageIdsToRemove?.length > 0) {
      try {
        await deleteAssets({
          variables: {
            input: { assetIds: existingImageIdsToRemove },
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
        setCreatingOrUpdatingProduct(false);
        return;
      }
    }
    /**we need to remove featured asset id from existingImages & newlyAddedAssets arrays as updateProuct call expect us to pass featuredAsset id and rest of the assets in separate properties*/
    if (mainImageIndex && mainImageIndex.startsWith('existing-')) {
      const mainIndex = parseInt(mainImageIndex.split('-')[1], 10);
      featuredAssetId = existingImages[mainIndex]?.id;
    } else if (mainImageIndex && mainImageIndex.startsWith('new-')) {
      const mainIndex = parseInt(mainImageIndex.split('-')[1], 10);
      featuredAssetId = newlyAddedAssets[mainIndex]?.id;
    }
    try {
      const updateInput = {
        id: product.id,
        translations: [
          {
            name: product.name,
            description: product.description,
            slug: product.name?.trim()?.replace(/\W+/g, '-').toLowerCase(),
            languageCode: import.meta.env.VITE_VENDURE_LANGUAGE_CODE,
          },
        ],
        enabled: product.enabled,
        facetValueIds: [product.categoryId],
        featuredAssetId: featuredAssetId,
        assetIds: Array.from(
          new Set([
            ...(existingImages ?? []).map((img: any) => img.id),
            ...(newlyAddedAssets ?? [])?.map((img: any) => img.id),
          ])
        ),
      };

      const result = await updateProduct({
        variables: {
          input: updateInput,
        },
      });
      const updatedProd = result?.data?.updateProduct;
      if (!!result?.data) {
        const variantsResult = await updateProductVariant({
          variables: {
            input: {
              id: updatedProd?.variantList?.items[0].id,
              price: Math.round(Number(product.price) * 100),
              translations: [
                {
                  name: product.name,
                  languageCode: import.meta.env.VITE_VENDURE_LANGUAGE_CODE,
                },
              ],
            },
          },
        });
        updatedProd.variants = variantsResult.data.updateProductVariants;
      }
      setProductUpdated(true);
    } catch (err) {
      setServiceError(true);
      console.error('Failed to update product:', err);
    } finally {
      setCreatingOrUpdatingProduct(false);
    }
  };

  function afterProductCreated() {
    const productData = { action: 'created', name: product.name };
    // Store the data in sessionStorage
    sessionStorage.setItem('productData', JSON.stringify(productData));
    navigate('/seller/home');
  }

  function afterProductDeleted() {
    setOpenDeleteDialog(false);
    const productData = { action: 'deleted', name: product.name };
    // Store the data in sessionStorage
    sessionStorage.setItem('productData', JSON.stringify(productData));
    navigate('/seller/home');
  }

  useEffect(() => {
    if (productToEditId !== '') {
      fetchProduct();
    }
  }, [fetchProduct, productToEditId]);

  useEffect(() => {
    if (productToEditId !== '' && productToEdit != null) {
      setProduct(productToEdit);
      if (existingImages) {
        const index = existingImages.findIndex(
          (image) => image.id === productToEdit?.mainImage?.id
        );
        if (index !== -1) {
          setMainImageIndex(`existing-${index}`);
        }
      }
    }
  }, [productToEdit, existingImages, productToEditId]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      <MainAppBar />

      <Box sx={{ pb: 2, pt: 8, bgcolor: 'primary.surface' }}>
        {invalidProductId && (
          <Container sx={{ bgcolor: 'white', pt: 20 }}>
            <Error404Alert />
          </Container>
        )}
        {!invalidProductId && (
          <Container
            sx={{
              bgcolor: 'white',
              maxWidth: 'calc(100% - 24px)',
              borderRadius: '10px',
              minHeight: '100vh',
              p: 1,
            }}
          >
            <Stack gap={1}>
              <AddOrUpdateItemBreadcrumbs addItem={productToEditId === ''} />
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
                  {productToEditId !== '' ? 'Edit Product' : 'Add new product'}
                </Typography>
              </Stack>
            </Stack>
            {productToEditId !== '' && loading && <UpdateItemSkeleton />}
            {(productToEditId === '' ||
              (productToEditId !== '' && !loading)) && (
              <Container sx={{ px: 1 }}>
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
                        {categories?.facetValues?.items?.map(
                          (item: any) =>
                            item.code !== 'services' && (
                              <MenuItem key={item.id} value={item.id}>
                                {item.name}
                              </MenuItem>
                            )
                        )}
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
                      sx={{
                        borderRadius: '25px',
                        borderWidth: '1px',
                        height: '45px',
                        bgcolor: 'primary.surface',
                        '&:hover, &:focus, &:active': {
                          bgcolor: 'primary.surface',
                        },
                      }}
                      onClick={toggleImageDrawer(true)}
                    >
                      <AddPhotoAlternateIcon
                        sx={{ fontSize: '35px', color: 'grey.800' }}
                      />
                      <Typography variant="button1" sx={{ color: 'grey.800' }}>
                        Add Images
                      </Typography>
                    </Button>
                    <Grid container spacing={1}>
                      {existingImages.map((asset, index) => (
                        <Grid key={asset.id || index} item xs={6}>
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
                        <Grid key={`new-${index}`} item xs={6}>
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
                      onClick={() => {}}
                      loading={creatingOrUpdatingProduct}
                      variant="contained"
                      type="submit"
                      buttonStyles={{
                        backgroundColor: 'primary.dark',
                        borderRadius: '25px',
                      }}
                      buttonContainerStyles={{
                        width: '100%',
                        height: '50px',
                      }}
                      label={
                        productToEditId === ''
                          ? 'Create Product'
                          : 'Update Product'
                      }
                      loadingLabel={
                        productToEditId === '' ? 'Creating...' : 'Updating...'
                      }
                      labelStyles={{
                        color: 'white',
                      }}
                      loadingLabelStyles={{
                        color: 'white',
                      }}
                      labelVariant="button1"
                      progressSize={24}
                      progressThickness={5}
                      progressStyles={{
                        color: 'white',
                      }}
                    />
                    <Grid container spacing={2}>
                      {productToEditId !== '' && (
                        <Grid item xs={6}>
                          <LoadingButton
                            onClick={handleDelete}
                            loading={deletingProduct}
                            variant="contained"
                            type="button"
                            buttonStyles={{
                              backgroundColor: 'error.main',
                              borderRadius: '25px',
                              borderWidth: '1px',
                              width: '100%',
                              height: '50px',
                            }}
                            buttonContainerStyles={{
                              width: '100%',
                              height: '45px',
                            }}
                            label={'Delete Product'}
                            loadingLabel="Deleting..."
                            labelStyles={{
                              color: 'common.white',
                            }}
                            labelVariant="button1"
                            progressSize={24}
                            progressThickness={5}
                            progressStyles={{
                              color: 'white',
                            }}
                          />
                        </Grid>
                      )}
                      <Grid item xs={productToEditId === '' ? 12 : 6}>
                        <Button
                          variant="outlined"
                          onClick={() => {
                            navigate('/seller/home');
                          }}
                          fullWidth
                          sx={{
                            borderRadius: '25px',
                            borderWidth: '1px',
                            // borderColor: '#1565c0',
                            borderColor: 'grey.700',
                            width: '100%',
                            height: '45px',
                          }}
                        >
                          <Typography
                            variant="button1"
                            sx={{ color: 'grey.700' }}
                          >
                            Go Back
                          </Typography>
                        </Button>
                      </Grid>
                    </Grid>
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
              sx={{
                '& .MuiDrawer-paper': {
                  py: 2,
                  borderTopLeftRadius: '20px',
                  borderTopRightRadius: '20px',
                },
              }}
            >
              <Box
                sx={{
                  px: 3,
                  py: 1,
                }}
              >
                <Typography variant="h7" sx={{ color: 'grey.800' }}>
                  Add product images
                </Typography>
                <Container sx={{ px: 1 }}>
                  <Stack direction="column" gap={1.5} sx={{ mt: 2 }}>
                    <Button
                      component="label"
                      fullWidth
                      variant="contained"
                      color="primary"
                      sx={{
                        px: 1,
                        py: 1.5,
                        borderRadius: '25px',
                        bgcolor: 'primary.main',
                        '&:hover, &:focus, &:active': {
                          bgcolor: 'primary.main',
                        },
                      }}
                    >
                      <input
                        accept="image/*"
                        id="capture-image"
                        type="file"
                        capture="environment"
                        onChange={handleNewImage}
                        style={{ display: 'none' }}
                      />
                      <AddAPhotoIcon sx={{ mr: 1, color: 'common.white' }} />
                      <Typography
                        variant="button1"
                        sx={{ color: 'common.white' }}
                      >
                        Take a photo
                      </Typography>
                    </Button>
                    <Button
                      component="label"
                      fullWidth
                      variant="contained"
                      sx={{
                        px: 1,
                        py: 1.5,
                        // borderColor: 'primary.main',
                        borderRadius: '25px',
                        bgcolor: 'secondary.main',
                        '&:hover, &:focus, &:active': {
                          bgcolor: 'secondary.main',
                        },
                      }}
                    >
                      <UploadIcon sx={{ mr: 1, color: 'common.black' }} />
                      <Typography
                        variant="button1"
                        sx={{ color: 'common.black' }}
                      >
                        Upload from gallery
                      </Typography>
                      <input
                        accept="image/*"
                        type="file"
                        hidden
                        multiple
                        onChange={handleNewImage}
                      />
                    </Button>
                  </Stack>
                </Container>
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
          </Container>
        )}
      </Box>
      <DeleteProductDialog
        open={openDeleteDialog}
        name={product.name}
        productToEditId={productToEditId}
        existingImages={existingImages}
        fetchImages={false}
        afterProductDeleted={afterProductDeleted}
        closeDialog={() => {
          setOpenDeleteDialog(false);
        }}
      />
    </>
  );
};

export default AddOrUpdateItem;
