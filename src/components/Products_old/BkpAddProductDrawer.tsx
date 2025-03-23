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
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  TextField,
  Tooltip,
  Typography,
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
import { Product } from '../../models/Product';
import DeleteIcon from '@mui/icons-material/Delete';
import StarIcon from '@mui/icons-material/Star';
import StarBorderIcon from '@mui/icons-material/StarBorder';

interface AddProductDrawerProps {
  adminId: string;
  adminName: string;
  sellerFacetValueId: string;
  callbackOnAdd: (prod: gqlProduct) => void;
  callbackOnEdit: (prod: gqlProduct) => void;
  productToEdit?: Product | null;
  initialAssets?: Asset[] | null;
}

const AddProductDrawer: React.FC<AddProductDrawerProps> = ({
  adminId,
  adminName,
  sellerFacetValueId,
  callbackOnAdd,
  callbackOnEdit,
  productToEdit,
  initialAssets,
}) => {
  const [createAssets] = useMutation(CREATE_ASSETS);
  const [createProduct] = useMutation(CREATE_PRODUCT);
  const [createProductVariant] = useMutation(CREATE_PRODUCT_VARIANTS);
  const [deleteAssets] = useMutation(DELETE_ASSETS);
  const [updateProduct] = useMutation(UPDATE_PRODUCT);
  const [updateProductVariant] = useMutation(UPDATE_PRODUCT_VARIANTS);
  const [existingAssets, setExistingAssets] = useState<Asset[]>(
    initialAssets || []
  );
  const [removedImages, setRemovedImages] = useState<string[]>([]);
  const [mainImageIndex, setMainImageIndex] = useState<string>();

  const initialData = productToEdit || {
    id: '',
    name: '',
    description: '',
    price: 0,
    enabled: false,
    categoryId: '',
    category: '',
    images: [],
    previewImages: [],
    mainImage: '',
    previewMainImage: '',
  };

  const [product, setProduct] = useState<Product>(initialData);

  const [errors, setErrors] = useState({
    name: '',
    description: '',
    price: '',
    image: '',
    category: '',
    mainImage: '',
    images: '',
  });

  const { data: categories } = useQuery(GET_FACET_VALUE_LIST, {
    variables: {
      options: {
        filter: {
          facetId: { eq: `${process.env.REACT_APP_VENDURE_CATEGORY_FACET_ID}` },
        },
      },
    },
  });

  useEffect(() => {
    if (productToEdit) {
      setProduct(productToEdit);
      if (initialAssets) {
        const index = initialAssets?.length ? initialAssets.length - 1 : -1;
        setMainImageIndex(`existing-${index}`);
      }
    }
  }, [productToEdit, initialAssets]);

  const handleChange = (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = event.target;
    setProduct((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSelectChange = (event: SelectChangeEvent<string>) => {
    const { value } = event.target;
    setProduct((prev) => ({
      ...prev!,
      categoryId: value,
      category:
        categories?.facetValues?.items?.find(
          (obj: { id: string }) => obj.id === value
        )?.name ?? '',
    }));
  };

  const handleCheckboxChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = event.target;
    setProduct((prev) => ({
      ...prev,
      [name]: checked,
    }));
  };

  const handleImageChange = (event: ChangeEvent<HTMLInputElement>) => {
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

  const handleRemoveImage = (index: number, isNew: boolean) => {
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

  const handleSelectMainImage = (index: number, isNew: boolean) => {
    setMainImageIndex(isNew ? `new-${index}` : `existing-${index}`);
  };

  const resetForm = () => {
    setProduct({
      id: '',
      name: '',
      description: '',
      price: 0,
      enabled: false,
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
        callbackOnEdit(updatedProd);
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

  return (
    <Container sx={{ width: '500px', height: '500px' }}>
      <Typography variant="h4">
        {productToEdit ? 'Update Product' : 'Add Product'}
      </Typography>
      <Box component="form" noValidate autoComplete="off">
        <TextField
          name="name"
          label="Product Name"
          fullWidth
          margin="normal"
          value={product.name}
          onChange={handleChange}
          error={!!errors.name}
          helperText={errors.name}
          required
        />
        <TextField
          name="description"
          label="Description"
          fullWidth
          margin="normal"
          multiline
          rows={4}
          value={product.description}
          onChange={handleChange}
          error={!!errors.description}
          helperText={errors.description}
          required
        />
        <TextField
          name="price"
          label="Price"
          type="number"
          fullWidth
          margin="normal"
          value={product.price}
          onChange={handleChange}
          error={!!errors.price}
          helperText={errors.price}
          required
        />
        <FormControlLabel
          control={
            <Checkbox
              name="enabled"
              checked={product.enabled}
              onChange={handleCheckboxChange}
            />
          }
          label="Enabled"
        />
        {categories?.facetValues?.items && (
          <FormControl
            fullWidth
            margin="normal"
            required
            error={!!errors.category}
          >
            <InputLabel>Category</InputLabel>
            <Select
              name="category"
              value={product.categoryId}
              onChange={handleSelectChange}
            >
              {categories?.facetValues?.items.map(
                (item: { __typename: string; id: string; name: string }) => (
                  <MenuItem key={item.id} value={item.id}>
                    {item.name}
                  </MenuItem>
                )
              )}
              {/* Add more categories as needed */}
            </Select>
            {errors.category && (
              <FormHelperText error>{errors.category}</FormHelperText>
            )}
          </FormControl>
        )}
        <Button variant="contained" component="label">
          Upload Images
          <input type="file" hidden multiple onChange={handleImageChange} />
        </Button>
        {errors.images && (
          <FormHelperText error>{errors.images}</FormHelperText>
        )}
        <Box sx={{ mt: 2, display: 'flex', flexWrap: 'wrap' }}>
          {existingAssets.map((asset, index) => (
            <Card key={asset.id} sx={{ width: 120, m: 1 }}>
              <CardMedia
                component="img"
                height="120"
                image={asset.preview}
                alt={asset.name}
              />
              <CardActions>
                <IconButton onClick={() => handleRemoveImage(index, false)}>
                  <DeleteIcon />
                </IconButton>
                <IconButton
                  size="small"
                  color={
                    mainImageIndex === `existing-${index}`
                      ? 'primary'
                      : 'default'
                  }
                  onClick={() => handleSelectMainImage(index, false)}
                >
                  {mainImageIndex === `existing-${index}` ? (
                    <StarIcon />
                  ) : (
                    <StarBorderIcon />
                  )}
                </IconButton>
              </CardActions>
            </Card>
          ))}
          {product.previewImages.map((image, index) => (
            <Card
              key={index}
              sx={{ maxWidth: 150, m: 1, position: 'relative' }}
            >
              <CardMedia
                component="img"
                height="100"
                image={image}
                alt={`preview-${index}`}
                sx={{ objectFit: 'cover' }}
              />
              <CardActions sx={{ justifyContent: 'space-between' }}>
                <Tooltip title="Set As Main Image">
                  <IconButton
                    size="small"
                    color={
                      mainImageIndex === `new-${index}` ? 'primary' : 'default'
                    }
                    onClick={() => handleSelectMainImage(index, true)}
                  >
                    {mainImageIndex === `new-${index}` ? (
                      <StarIcon />
                    ) : (
                      <StarBorderIcon />
                    )}
                  </IconButton>
                </Tooltip>
                <IconButton
                  size="small"
                  onClick={() => handleRemoveImage(index, true)}
                >
                  <DeleteIcon />
                </IconButton>
              </CardActions>
            </Card>
          ))}
          {errors.mainImage && (
            <FormHelperText error>{errors.mainImage}</FormHelperText>
          )}
        </Box>
        <Button
          variant="contained"
          color="primary"
          sx={{ mt: 2 }}
          onClick={handleSubmit}
        >
          {productToEdit ? 'Update Product' : 'Create Product'}
        </Button>
      </Box>
    </Container>
  );
};

export default AddProductDrawer;
