import {
  Box,
  Dialog,
  Divider,
  Fab,
  Slide,
  Stack,
  Typography,
} from '@mui/material';
import Item from '../Item';
import { GET_PRODUCT_PREVIEW_LIST } from '../../../libs/graphql/definitions/product-definitions';
import { useLazyQuery, useQuery } from '@apollo/client';
import { useUserContext } from '../../../hooks/useUserContext';
import { forwardRef, useEffect, useRef, useState } from 'react';
import LoadingCircle from '../../common/LoadingCircle';
import AddIcon from '@mui/icons-material/Add';
import CustomSnackBar from '../../common/Snackbars/CustomSnackBar';
import AddOrUpdateItem from '../../CreateProduct/AddOrUpdateItem';

function Products({ sellerFacetValueId }) {
  const ITEMS_PER_LOAD = 10;
  // const { adminUser } = useUserContext();
  const { adminUser } = useUserContext();
  const [serverProductList, setServerProductList] = useState([]);
  const [hasMore, setHasMore] = useState(true);
  const [initialLoad, setInitialLoad] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [newProductCreated, setNewProductCreated] = useState(false);
  const [editProduct, setEditProduct] = useState(null);

  const Transition = forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
  });

  const [dialogOpen, setDialogOpen] = useState(false); // State for dialog visibility
  // Handle opening and closing the dialog
  const handleDialogClose = () => {
    // fetchProducts(); //fetch product list with newly added product
    setDialogOpen(false);
  };
  const handleDialogOpen = () => {
    setDialogOpen(true);
  };

  const modifyProductListOnAdd = (prod) => {
    setNewProductCreated(true);
    return;
  };
  const modifyProductListOnDelete = (prodId) => {
    return;
  };
  const modifyProductListOnEdit = (product) => {
    return;
  };

  const [fetchProducts, { loading, error, data, fetchMore }] = useLazyQuery(
    // const { loading, error, data, fetchMore } = useQuery(
    GET_PRODUCT_PREVIEW_LIST,
    {
      variables: {
        options: {
          skip: 0,
          take: ITEMS_PER_LOAD,
          filter: { adminId: { eq: adminUser?.id } },
          sort: { updatedAt: 'DESC' },
        },
      },
      fetchPolicy: 'cache-and-network',
      onCompleted: (fetchedData) => {
        setServerProductList(fetchedData.products.items);
        setInitialLoad(true);
        setHasMore(
          fetchedData.products.items.length < fetchedData.products.totalItems
        );
      },
    }
  );

  const handleItemUpdate = (updatedItem) => {
    setServerProductList((prevItems) =>
      prevItems.map((item) => (item.id === updatedItem.id ? updatedItem : item))
    );
  };

  const lastProductRef = useRef();

  useEffect(() => {
    if (adminUser && !initialLoad) {
      fetchProducts();
    }
  }, [adminUser, fetchProducts, initialLoad]);

  useEffect(() => {
    const loadMore = () => {
      if (loadingMore || !hasMore) return;
      setLoadingMore(true);
      fetchMore({
        variables: {
          options: {
            skip: serverProductList.length,
            take: ITEMS_PER_LOAD,
            filter: { adminId: { eq: adminUser?.id } },
            sort: { updatedAt: 'DESC' },
          },
        },
      })
        .then(({ data: fetchedData }) => {
          const newProducts = fetchedData.products.items;
          setServerProductList((prevProducts) => [
            ...prevProducts,
            ...newProducts,
          ]);
          setHasMore(
            fetchedData.products.items.length + serverProductList.length <
              fetchedData.products.totalItems
          );
        })
        .catch((error) => {
          console.error('Error fetching more products:', error);
        })
        .finally(() => {
          setLoadingMore(false);
        });
    };

    if (loading || !hasMore) return;

    const handleIntersect = (entries) => {
      const [entry] = entries;
      if (entry.isIntersecting) {
        loadMore();
      }
    };

    const currentObserver = new IntersectionObserver(handleIntersect, {
      root: null,
      rootMargin: '200px',
      threshold: 1.0,
    });

    if (lastProductRef.current) {
      currentObserver.observe(lastProductRef.current);
    }

    return () => {
      if (lastProductRef.current) {
        currentObserver.unobserve(lastProductRef.current);
      }
    };
  }, [
    serverProductList,
    hasMore,
    loadingMore,
    loading,
    fetchMore,
    adminUser?.id,
  ]);

  if (error) return <p>Error loading products: {error.message}</p>;

  return (
    <>
      {loading && (
        <Box sx={{ mt: 5 }}>
          <LoadingCircle message="Fetching products..." />
        </Box>
      )}
      {!loading && (
        <Stack
          direction="column"
          gap={1}
          sx={{
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
          }}
        >
          {/*directly display products using data variable while serverProductList state is being updated in apollo request's onCompleted function, this ensures there won't be any lags displaying data after loading is completed*/}
          {serverProductList.length === 0 &&
            data?.products?.items?.map((item, index) => (
              <Box
                ref={
                  index === serverProductList.length - 1 ? lastProductRef : null
                }
                key={item.id}
              >
                <Item item={item} onItemUpdate={handleItemUpdate} />
                {index !== serverProductList?.length - 1 && (
                  <Divider flexItem variant="fullWidth" sx={{ mt: 2, mb: 1 }} />
                )}
              </Box>
            ))}
          {serverProductList.length !== 0 &&
            serverProductList?.map((item, index) => (
              <Box
                ref={
                  index === serverProductList.length - 1 ? lastProductRef : null
                }
                key={item.id}
              >
                <Item item={item} onItemUpdate={handleItemUpdate} />
                {index !== serverProductList?.length - 1 && (
                  <Divider flexItem variant="fullWidth" sx={{ mt: 2, mb: 1 }} />
                )}
              </Box>
            ))}
          {!hasMore && (
            <Stack
              direction="row"
              sx={{
                mt: 2,
                display: 'flex',
                alignItems: 'baseline',
                justifyContent: 'center',
              }}
            >
              <Typography variant="heavyb2" color="brown">
                That's all!
              </Typography>
              <Typography variant="b1" sx={{ fontSize: '20px' }}>
                &#x1F44B;
              </Typography>
            </Stack>
          )}
          {initialLoad &&
            serverProductList.length === 0 &&
            (data?.products == null || data?.products?.items?.length === 0) && (
              <Stack
                display="flex"
                justifyContent="center"
                alignItems="center"
                sx={{ mt: 8 }}
                gap={1}
              >
                <Typography variant="h7" sx={{ color: 'grey.700' }}>
                  You haven't added any products
                </Typography>
                <Typography variant="heavyb1" sx={{ color: 'grey.600' }}>
                  Add items and start selling.
                </Typography>
              </Stack>
            )}
          {loadingMore && (
            <Box sx={{ mt: 2 }}>
              <LoadingCircle message="Loading more..." />
            </Box>
          )}
        </Stack>
      )}
      <Fab
        variant="extended"
        color="secondary"
        aria-label="add new product"
        onClick={handleDialogOpen} // Open the dialog on click
        sx={{
          position: 'fixed',
          bottom: '20px',
          right: '20px',
          height: '50px',
        }}
      >
        <AddIcon sx={{ fontSize: '28px' }} />
        <Typography
          variant="button1"
          sx={{
            textTransform: 'none',
          }}
        >
          Add Product
        </Typography>
      </Fab>
      <Dialog
        open={dialogOpen}
        onClose={handleDialogClose}
        fullScreen
        TransitionComponent={Transition}
        keepMounted
      >
        <AddOrUpdateItem
          handleDialogClose={handleDialogClose}
          adminId={adminUser?.id ?? ''}
          adminName={adminUser?.firstName ?? ''}
          sellerFacetValueId={sellerFacetValueId}
          callbackOnAdd={modifyProductListOnAdd}
          callbackOnEdit={modifyProductListOnEdit}
          productToEdit={null}
          initialAssets={null}
        />
      </Dialog>
      <CustomSnackBar
        message="Product created successfully"
        severity="success"
        color="success"
        duration={3000}
        vertical="top"
        horizontal="center"
        open={newProductCreated}
        handleClose={() => {
          setNewProductCreated(false);
        }}
      />
      <Box sx={{ height: '70px' }} />
    </>
  );
}

export default Products;
