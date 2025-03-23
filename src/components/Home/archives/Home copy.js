import React, { useEffect, useRef, useState } from 'react';
import MainAppBar from '../../common/MainAppBar';
import Products from '../../ProductsList';
import {
  Box,
  Container,
  Dialog,
  Fab,
  Grid,
  Paper,
  Slide,
  Stack,
  Tab,
  Tabs,
  Typography,
  useTheme,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import ListAltIcon from '@mui/icons-material/ListAlt';
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';
import CampaignIcon from '@mui/icons-material/Campaign';
import { useUserContext } from '../../../hooks/useUserContext';
import { GET_FACET_VALUE_LIST } from '../../../libs/graphql/definitions/facet-definitions';

import Orders from '../../Orders';
import { motion } from 'framer-motion'; // Import motion from framer-motion
import AddOrUpdateItem from '../../CreateProduct/AddOrUpdateItem';
import { useLazyQuery } from '@apollo/client';
import CustomSnackBar from '../../common/Snackbars/CustomSnackBar';

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <Box
      role="tabpanel"
      hidden={value !== index}
      id={`full-width-tabpanel-${index}`}
      aria-labelledby={`full-width-tab-${index}`}
      {...other}
    >
      {value === index && children}
    </Box>
  );
}

function Home() {
  const theme = useTheme();
  const { adminUser } = useUserContext();
  const [sellerFacetValueId, setSellerFacetValueId] = useState('');
  const [editProduct, setEditProduct] = useState(null);

  const [tabValue, setTabValue] = React.useState(0);
  // const [topValue, setTopValue] = useState(170); // Initial top value
  // Refs to scrollable container elements for each tab
  const productsTabRef = useRef(null);
  const ordersTabRef = useRef(null);
  const [initialLoad, setInitialLoad] = useState(true); // Track initial load state
  const [dialogOpen, setDialogOpen] = useState(false); // State for dialog visibility
  const [newProductCreated, setNewProductCreated] = useState(false);

  // Handle opening and closing the dialog
  const handleDialogClose = () => {
    setDialogOpen(false);
  };

  const handleDialogOpen = () => {
    setDialogOpen(true);
  };

  const handleChangeTab = (event, newValue) => {
    setTabValue(newValue);
  };

  const scrollTabToTop = () => {
    window.scrollTo({
      top: 160, // Vertical position after initial load
      behavior: 'smooth', // Smooth scrolling
    });
  };

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

  // Scroll to the top only on the initial load
  useEffect(() => {
    if (initialLoad) {
      window.scrollTo(0, 0); // Scroll to the top of the page
      setInitialLoad(false); // Set initial load to false after scrolling
    }
  }, [initialLoad]); // This effect will only run once on the initial load

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
          height: '100%',
          minHeight: '100vh',
        }}
      >
        <Container
          sx={{
            mt: 8,
            px: 1,
            // position: 'fixed',
          }}
        >
          <Grid container columnSpacing={1} rowSpacing={3}>
            <Grid item xs={4} className="flexCenter">
              <Paper
                as={motion.div} // Make Box a motion.div to enable animation
                initial={{ scale: 1 }} // Start with normal scale and rotation
                animate={{
                  scale: [1, 1.1, 0.9, 1], // Scale out, then scale back to normal size
                }}
                transition={{
                  duration: 0.8, // Total duration of the animation
                  ease: 'easeInOut', // Easing for smooth animation
                  delay: 2, // Add 2-second delay before animation starts
                }}
                className="flexCenter"
                sx={{
                  width: '100%',
                  aspectRatio: 1,
                  borderRadius: '15px',
                  display: 'flex',
                  alignItems: 'center',
                  borderWidth: '1px',
                  borderColor: theme.palette.grey[300],
                  borderStyle: 'solid',
                }}
              >
                <Stack className="flexCenter">
                  <Typography
                    variant="h5"
                    sx={{ color: theme.palette.warning.dark }}
                  >
                    1
                  </Typography>
                  <Typography
                    variant="label1"
                    sx={{ color: theme.palette.grey[700] }}
                  >
                    New Orders
                  </Typography>
                  <ListAltIcon
                    sx={{ color: theme.palette.primary.main, fontSize: '28px' }}
                  />
                </Stack>
              </Paper>
            </Grid>
            <Grid item xs={4} className="flexCenter">
              <Paper
                className="flexCenter"
                sx={{
                  width: '100%',
                  aspectRatio: 1,
                  borderRadius: '15px',
                  display: 'flex',
                  alignItems: 'center',
                  borderWidth: '1px',
                  borderColor: theme.palette.grey[300],
                  borderStyle: 'solid',
                }}
              >
                <Stack className="flexCenter">
                  <Typography
                    variant="h5"
                    sx={{ color: theme.palette.grey[900] }}
                  >
                    5
                  </Typography>
                  <Typography
                    variant="label1"
                    sx={{ color: theme.palette.grey[700] }}
                  >
                    Products
                  </Typography>
                  <Stack
                    direction="row"
                    gap={0.2}
                    sx={{ mt: 1, display: 'flex', alignItems: 'flex-start' }}
                  >
                    <Typography
                      variant="heavylabel1"
                      sx={{ color: theme.palette.primary.main }}
                    >
                      Live
                    </Typography>
                    <FiberManualRecordIcon
                      sx={{
                        color: theme.palette.error.dark,
                        fontSize: '12px',
                      }}
                    />
                  </Stack>
                </Stack>
              </Paper>
            </Grid>
            <Grid item xs={4} className="flexCenter">
              <Paper
                className="flexCenter"
                sx={{
                  width: '100%',
                  aspectRatio: 1,
                  borderRadius: '15px',
                  borderWidth: '1px',
                  borderColor: theme.palette.grey[300],
                  borderStyle: 'solid',
                }}
              >
                <Stack className="flexCenter">
                  <Typography
                    variant="h5"
                    sx={{ color: theme.palette.grey[900] }}
                  >
                    1
                  </Typography>
                  <Typography
                    variant="label1"
                    sx={{ color: theme.palette.grey[700] }}
                  >
                    Banners
                  </Typography>
                  <CampaignIcon
                    sx={{ color: theme.palette.primary.main, fontSize: '28px' }}
                  />
                </Stack>
              </Paper>
            </Grid>
          </Grid>
        </Container>
        <Container
          id="main"
          sx={{
            px: 1,
            // position: 'fixed',
            // top: topValue,
            // zIndex: 1000,
            // transition: 'top 1s ease', // Smooth transition for the top value
          }}
        >
          <Paper
            elevation={4}
            sx={{
              mt: 3,
              width: '100%',
              minHeight: '100vh',
              borderTopLeftRadius: '25px',
              borderTopRightRadius: '25px',
            }}
          >
            <Tabs
              variant="fullWidth"
              indicatorColor="secondary"
              value={tabValue}
              onChange={handleChangeTab}
              sx={{
                position: 'sticky',
                top: '45px', // Stick the tabs 50px below the top of the screen
                zIndex: 1000, // Ensure tabs are above other content
                backgroundColor: theme.palette.background.paper, // Optional: add background to prevent overlap
              }}
            >
              <Tab
                label={
                  <Typography variant="heavylabel1" onClick={scrollTabToTop}>
                    Products
                  </Typography>
                }
              />
              <Tab
                label={
                  <Typography variant="heavylabel1" onClick={scrollTabToTop}>
                    Orders
                  </Typography>
                }
              />
            </Tabs>
            <TabPanel value={tabValue} index={0} dir={theme.direction}>
              <Container
                ref={productsTabRef} // Attach ref for Products Tab
                sx={{
                  mt: 2,
                  // height: 'calc(100vh - 220px)',
                  // overflow: 'auto'
                }}
              >
                <Products />
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
              </Container>
            </TabPanel>
            <TabPanel value={tabValue} index={1} dir={theme.direction}>
              <Container
                ref={ordersTabRef} // Attach ref for Orders Tab
                sx={{
                  mt: 2,
                  // height: 'calc(100vh - 220px)',
                  // overflow: 'auto'
                }}
              >
                <Orders />
              </Container>
            </TabPanel>
          </Paper>
        </Container>
      </Box>
      <Dialog
        open={dialogOpen}
        onClose={handleDialogClose}
        fullScreen
        TransitionComponent={Transition}
      >
        <AddOrUpdateItem
          handleDialogClose={handleDialogClose}
          adminId={adminUser?.id ?? ''}
          adminName={adminUser?.firstName ?? ''}
          sellerFacetValueId={sellerFacetValueId}
          callbackOnAdd={modifyProductListOnAdd}
          callbackOnEdit={modifyProductListOnEdit}
          productToEditId={null}
        />
      </Dialog>
      <CustomSnackBar
        message="Product created successfully"
        severity="success"
        duration={3000}
        vertical="top"
        horizontal="center"
        open={newProductCreated}
        handleClose={() => {
          setNewProductCreated(false);
        }}
      />
    </>
  );
}

export default Home;
