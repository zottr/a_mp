import { useMutation } from '@apollo/client';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import {
  Box,
  Card,
  CardContent,
  CardMedia,
  Drawer,
  Grid,
  IconButton,
  Typography,
} from '@mui/material';
import React, { useEffect, useState } from 'react';
import {
  DELETE_ASSETS,
  DELETE_PRODUCT,
  DELETE_PRODUCT_VARIANT,
} from '../../libs/graphql/definitions/product-definitions';
import { Product as gqlProduct } from '../../libs/graphql/generated-types';
import ConfirmationDialog from '../common/ConfirmationDialog/ConfirmationDialog';
import { Product } from '../../models/Product';

const ProductListGrid = ({ products, onProductDelete, onProductEdit }) => {
  const [productList, setProductList] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);
  const [deleteProduct] = useMutation(DELETE_PRODUCT);
  const [deleteProductVariant] = useMutation(DELETE_PRODUCT_VARIANT);
  const [deleteAssets] = useMutation(DELETE_ASSETS);

  useEffect(() => {
    async function createProductList() {
      let pList: Product[] = [];
      if (products && products.length > 0) {
        pList = products.map(function (prod) {
          return {
            id: prod.id,
            name: prod.name,
            description: prod.description,
            price: prod.variants[0]?.price,
            enabled: prod.enabled,
            category:
              prod.facetValues?.find(
                (obj) =>
                  obj.facetId ===
                  `${process.env.REACT_APP_VENDURE_CATEGORY_FACET_ID}`
              )?.name ?? '',
            images: prod.assets,
            previewImages: prod.assets?.map((asset) => {
              return asset.preview;
            }),
            mainImage: prod.featuredAsset,
            previewMainImage: prod.featuredAsset?.preview,
          };
        });
      }
      setProductList(pList);
    }
    createProductList();
  }, [products]);

  const handleDelete = async (productId) => {
    const prodToDel = products.find((p) => {
      return p.id === productId;
    });
    let assetIds = prodToDel?.assets?.map((as) => as.id) ?? [];
    if (prodToDel?.featuredAsset?.id) {
      assetIds.push(prodToDel?.featuredAsset?.id);
    }
    try {
      if (assetIds) {
        await deleteAssets({
          variables: { input: { assetIds: assetIds } },
        });
      }
      await deleteProductVariant({
        variables: { id: prodToDel?.variants[0].id },
      });
      await deleteProduct({
        variables: { id: productId },
      });
      onProductDelete(productId);
    } catch (err) {
      console.log('Error while deleting product' + err);
    }
  };

  const handleDialogClose = () => {
    setOpenDialog(false);
  };

  const handleClickEdit = (product) => {
    const prodToEdit = products.find((prod) => product.id === prod.id);
    if (prodToEdit) {
      onProductEdit(prodToEdit);
    }
  };

  const handleDeleteProduct = () => {
    if (productToDelete !== null) {
      handleDelete(productToDelete);
      setProductList((prev) => prev.filter((p) => p.id !== productToDelete));
      setProductToDelete(null);
    }
    setOpenDialog(false);
  };

  const confirmDeleteProduct = (id) => {
    setProductToDelete(id);
    setOpenDialog(true);
  };

  return (
    <Box sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Product List
      </Typography>
      <Grid container spacing={2}>
        {productList.map((product, index) => (
          <Grid item key={index} xs={12} sm={6} md={4}>
            <Card>
              {product.previewMainImage && (
                <CardMedia
                  component="img"
                  height="140"
                  image={product.previewMainImage}
                  alt={`product-${index}`}
                />
              )}
              <CardContent>
                <Typography gutterBottom variant="h5" component="div">
                  {product.name}
                </Typography>
                <Typography variant="b2" color="text.secondary">
                  {product.description}
                </Typography>
                <Typography variant="b2" color="text.secondary">
                  ₹{product.price}
                </Typography>
                <Typography variant="b2" color="text.secondary">
                  Category: {product.category}
                </Typography>
                {/* <Typography variant="b2" color="text.secondary">
                  {product.enabled ? 'Enabled' : 'Disabled'}
                </Typography> */}
                <Box sx={{ mt: 2, display: 'flex', flexWrap: 'wrap' }}>
                  {product.previewImages.map((image, imgIndex) => (
                    <Box key={imgIndex} sx={{ mr: 1, mb: 1 }}>
                      <img
                        src={image}
                        alt={`product-${index}-image-${imgIndex}`}
                        style={{ width: 50, height: 50, objectFit: 'cover' }}
                      />
                    </Box>
                  ))}
                </Box>
                <Box
                  sx={{
                    mt: 2,
                    display: 'flex',
                    justifyContent: 'space-between',
                  }}
                >
                  <IconButton
                    size="small"
                    onClick={() => handleClickEdit(product)}
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    size="small"
                    onClick={() => confirmDeleteProduct(product.id)}
                  >
                    <DeleteIcon />
                  </IconButton>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
      <ConfirmationDialog
        message={`Are you sure, you want to delete this product?`}
        openDialog={openDialog}
        onClose={handleDialogClose}
        onConfirm={() => handleDeleteProduct()}
      />
    </Box>
  );
};

export default ProductListGrid;
