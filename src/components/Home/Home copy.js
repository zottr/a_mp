import React, { useEffect, useState } from 'react';
import MainAppBar from '../common/MainAppBar';
import Products from '../ProductsList';
import { Box, Slide, Stack, Typography, useTheme } from '@mui/material';
import { useUserContext } from '../../hooks/useUserContext';
import { GET_FACET_VALUE_LIST } from '../../libs/graphql/definitions/facet-definitions';
import { useLazyQuery } from '@apollo/client';
import Notifications from './Notifications';
import HomeLinks from './HomeLinks';

function Home() {
  const theme = useTheme();
  const { adminUser } = useUserContext();
  const [sellerFacetValueId, setSellerFacetValueId] = useState('');

  const [fetchFacets, { data: fValueData }] = useLazyQuery(
    GET_FACET_VALUE_LIST,
    {
      fetchPolicy: 'cache-and-network',
      variables: {
        options: {
          filter: { name: { eq: adminUser?.customFields?.phone } },
        },
      },
    }
  );

  //bug fix: reseting scroll position to the top when page is refreshed, otherwise page was loading from the middle due to Product container retaining scroll position history
  useEffect(() => {
    window.history.scrollRestoration = 'manual';
  }, []);

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

  return (
    <>
      <MainAppBar />
      <Box
        sx={{
          pt: 7,
          height: '100%',
          minHeight: '100vh',
          bgcolor: 'primary.surface',
        }}
      >
        <Typography variant="h6" sx={{ color: 'grey.800', ml: 1 }}>
          Hello, {adminUser?.firstName}
        </Typography>

        <Box
          sx={{
            borderRadius: '10px',
            p: 1,
            mx: 1.5,
            mt: 1,
            bgcolor: 'white',
          }}
        >
          <Notifications />
        </Box>
        <Box
          sx={{
            borderRadius: '10px',
            p: 1,
            mt: 1,
            mx: 1.5,
            bgcolor: 'white',
          }}
        >
          <HomeLinks />
        </Box>
        <Box
          sx={{
            bgcolor: 'white',
            p: 1,
            mx: 1.5,
            mt: 1,
            minHeight: '100vh',
            borderTopLeftRadius: '10px',
            borderTopRightRadius: '10px',
          }}
        >
          <Stack gap={2}>
            <Typography variant="h7" color={theme.palette.grey[800]}>
              Your Products
            </Typography>
            <Products sellerFacetValueId={sellerFacetValueId} />
          </Stack>
        </Box>
      </Box>
    </>
  );
}

export default Home;
