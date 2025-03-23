// src/components/Welcome.tsx
import React, { useEffect, useState } from 'react';
import {
  Typography,
  Container,
  Fab,
  Drawer,
  Tooltip,
  Box,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import AddProductDrawer from './AddProductDrawer';
import TopAppBar from '../common/TopAppBar';
import { useLazyQuery } from '@apollo/client';
import ProductListGrid from './ProductListGrid';
import { GET_PRODUCT_LIST } from '../../libs/graphql/definitions/product-definitions';
import { GET_FACET_VALUE_LIST } from '../../libs/graphql/definitions/facet-definitions';
import { useUserContext } from '../../hooks/useUserContext';
import {
  Asset,
  Product as GqlProduct,
} from '../../libs/graphql/generated-types';
import { Product } from '../../models/Product';

const AdminWelcomePage = ({ logout }) => {
  const { adminUser } = useUserContext();
  const [open, setOpen] = useState(false);
  const [sellerFacetValueId, setSellerFacetValueId] = useState('');
  const [serverProductList, setServerProductList] = useState([]);
  const [editProduct, setEditProduct] = useState(null);
  const [initialAssets, setInitialAssets] = useState([]);

  const [fetchProducts, { data: products }] = useLazyQuery(GET_PRODUCT_LIST, {
    fetchPolicy: 'network-only',
    variables: {
      options: {
        filter: { adminId: { eq: adminUser?.id } },
      },
    },
  });

  const [fetchFacets, { data: fValueData }] = useLazyQuery(
    GET_FACET_VALUE_LIST,
    {
      fetchPolicy: 'network-only',
      variables: {
        options: {
          filter: { name: { eq: adminUser?.customFields?.phone } },
        },
      },
    }
  );

  useEffect(() => {
    if (adminUser) {
      fetchProducts();
      if (products?.products?.items) {
        setServerProductList(products?.products?.items);
      }
    }
  }, [adminUser, fetchProducts, products?.products?.items]);

  useEffect(() => {
    if (adminUser) {
      fetchFacets();
      if (
        fValueData?.facetValues?.totalItems &&
        fValueData?.facetValues?.totalItems > 0
      ) {
        setSellerFacetValueId(fValueData?.facetValues.items[0].id);
      }
    }
  }, [adminUser, fetchFacets, fValueData]);

  const handleCreate = () => {
    setEditProduct(null);
    setInitialAssets(null);
    setOpen(true);
  };

  const handleEdit = (productToEdit) => {
    const category = productToEdit.facetValues?.find(
      (obj) =>
        obj.facetId === `${process.env.REACT_APP_VENDURE_CATEGORY_FACET_ID}`
    );

    //create images by adding cover image as well
    const allImages = [...productToEdit?.assets];
    if (allImages && productToEdit.featuredAsset) {
      allImages.push(productToEdit.featuredAsset);
    }

    setInitialAssets(allImages);

    setEditProduct({
      id: productToEdit.id,
      name: productToEdit.name,
      description: productToEdit.description,
      price: productToEdit.variants[0]?.price,
      enabled: productToEdit.enabled,
      categoryId: category?.id,
      category: category?.name ?? '',
      images: '',
      previewImages: [],
      mainImage: productToEdit.featuredAsset,
      previewMainImage: productToEdit.featuredAsset?.preview,
    });

    setOpen(true);
  };

  const modifyProductListOnAdd = (prod) => {
    setServerProductList((prev) => [...prev, { ...prod }]);
    setOpen(false);
  };

  const modifyProductListOnDelete = (prodId) => {
    setServerProductList((prevProducts) =>
      prevProducts.filter((product) => product.id !== prodId)
    );
  };

  const modifyProductListOnEdit = (product) => {
    setServerProductList((prev) =>
      prev.map((p) => (p.id === product.id ? product : p))
    );
    setOpen(false);
  };

  return (
    <Container>
      <TopAppBar logout={logout} />
      <Typography variant="h4">Welcome, {adminUser?.firstName}!</Typography>
      <Box
        sx={{
          position: 'absolute',
          bottom: 16, // Distance from the bottom
          left: '90%',
        }}
      >
        <Tooltip title="Add Product">
          <Fab
            sx={{ position: 'absolute', bottom: 0, right: 0 }}
            color="primary"
            aria-label="add"
            onClick={handleCreate}
          >
            <AddIcon />
          </Fab>
        </Tooltip>
      </Box>

      <ProductListGrid
        products={serverProductList}
        onProductDelete={modifyProductListOnDelete}
        onProductEdit={handleEdit}
        sellerFacetValueId={sellerFacetValueId}
      />

      <Drawer anchor={'bottom'} open={open} onClose={() => setOpen(false)}>
        <AddProductDrawer
          adminId={adminUser?.id ?? ''}
          adminName={adminUser?.firstName ?? ''}
          sellerFacetValueId={sellerFacetValueId}
          callbackOnAdd={modifyProductListOnAdd}
          callbackOnEdit={modifyProductListOnEdit}
          productToEdit={editProduct}
          initialAssets={initialAssets}
        />
      </Drawer>
    </Container>
  );
};

export default AdminWelcomePage;
