import {
  Avatar,
  Box,
  Divider,
  Grid,
  Skeleton,
  Stack,
  Typography,
} from '@mui/material';
import Item from './Item';
import { GET_PRODUCT_PREVIEW_LIST } from '../../libs/graphql/definitions/product-definitions';
import { useLazyQuery, useQuery } from '@apollo/client';
import { useUserContext } from '../../hooks/useUserContext';
import { useEffect, useRef, useState } from 'react';
import ProductListSkeleton from './ProductListSkeleton';

function Products({ refetchProducts, setRefetchProducts, handleEditProduct }) {
  const ITEMS_PER_LOAD = 10;
  // const { adminUser } = useUserContext();
  const { adminUser } = useUserContext();
  const [serverProductList, setServerProductList] = useState([]);
  const [hasMore, setHasMore] = useState(true);
  const [initialLoadCompleted, setInitialLoadCompleted] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);

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
        setInitialLoadCompleted(true);
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
    if (adminUser) {
      fetchProducts();
    }
  }, [adminUser, fetchProducts]);

  useEffect(() => {
    if (adminUser && refetchProducts) {
      fetchProducts();
    }
    setRefetchProducts(false);
  }, [adminUser, fetchProducts, refetchProducts, setRefetchProducts]);

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
      {loading && <ProductListSkeleton />}
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
                <Item
                  item={item}
                  onItemUpdate={handleItemUpdate}
                  handleEditProduct={handleEditProduct}
                />
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
                <Item
                  item={item}
                  onItemUpdate={handleItemUpdate}
                  handleEditProduct={handleEditProduct}
                />
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
          {initialLoadCompleted &&
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
              <ProductListSkeleton />
            </Box>
          )}
        </Stack>
      )}
      <Box sx={{ height: '70px' }} />
    </>
  );
}

export default Products;
