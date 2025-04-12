import { useEffect, useState } from 'react';
import ServicesMainAppBar from '../common/ServicesMainAppBar';
import { Box, Fab, Stack, Typography, useTheme } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { useUserContext } from '../../hooks/useUserContext';
import CustomSnackBar from '../common/Snackbars/CustomSnackBar';
import Notifications from '../Notifications';
import { useNavigate } from 'react-router-dom';
import Services from './ServicesList/Services';

// const Transition = React.forwardRef(function Transition(props, ref) {
//   return <Slide direction="up" ref={ref} {...props} />;
// });

function ServicesHome() {
  const navigate = useNavigate();
  const theme = useTheme();
  const { adminUser } = useUserContext();
  // const [sellerFacetValueId, setSellerFacetValueId] = useState('');
  // const [productToEditId, setProductToEditId] = useState(null);

  // const [dialogOpen, setDialogOpen] = useState(false); // State for dialog visibility
  // const [refetchProducts, setRefetchProducts] = useState(false); // State for dialog visibility

  const [productAction, setProductAction] = useState('');
  const [updatedProductName, setUpdatedProductName] = useState('');

  //product action alerts
  useEffect(() => {
    // Retrieve the data
    const storedData = sessionStorage.getItem('productData');
    if (storedData) {
      const parsedData = JSON.parse(storedData);
      setProductAction(parsedData.action);
      setUpdatedProductName(parsedData.name);
      // Remove from sessionStorage after reading
      sessionStorage.removeItem('productData');
    }
  }, []);

  // // Handle opening and closing the dialog
  // const handleDialogClose = () => {
  //   setDialogOpen(false);
  //   setRefetchProducts(true);
  //   if (productToEditId != null) setProductToEditId(null);
  // };

  // const handleEditProduct = (id: any) => {
  //   setProductToEditId(id);
  //   // handleDialogOpen();
  // };

  // const handleDialogOpen = () => {
  //   setDialogOpen(true);
  // };

  // const [fetchFacets, { data: fValueData }] = useLazyQuery(
  //   GET_FACET_VALUE_LIST,
  //   {
  //     fetchPolicy: 'cache-and-network',
  //     variables: {
  //       options: {
  //         filter: { name: { eq: adminUser?.customFields?.phone } },
  //       },
  //     },
  //   }
  // );

  //bug fix: reseting scroll position to the top when page is refreshed, otherwise page was loading from the middle due to Product container retaining scroll position history
  // useEffect(() => {
  //   window.history.scrollRestoration = 'manual';
  //   // window.scrollTo(0, 0);
  // }, []);

  // useEffect(() => {
  //   if (adminUser) {
  //     fetchFacets();
  //     console.log(fValueData);
  //     if (
  //       fValueData?.facetValues?.totalItems &&
  //       fValueData?.facetValues?.totalItems > 0
  //     ) {
  //       setSellerFacetValueId(fValueData?.facetValues.items[0].id);
  //     }
  //   }
  // }, [adminUser, fetchFacets, fValueData]);

  return (
    <>
      <ServicesMainAppBar />
      <Box
        sx={{
          pt: 8,
          pb: 2,
          height: '100%',
          minHeight: '100vh',
          bgcolor: 'primary.surface',
        }}
      >
        <Typography variant="h6" sx={{ color: 'grey.800', ml: 1 }}>
          Hello, {adminUser?.firstName}
        </Typography>

        <Notifications type="services" />

        <Box
          sx={{
            bgcolor: 'white',
            p: 1,
            mx: 1.5,
            mt: 1,
            minHeight: '100vh',
            // borderTopLeftRadius: '15px',
            // borderTopRightRadius: '15px',
            borderRadius: '10px',
          }}
        >
          <Stack gap={2}>
            <Typography variant="h7" color={theme.palette.grey[800]}>
              Your Services
            </Typography>
            <Services
              setProductAction={setProductAction}
              setUpdatedProductName={setUpdatedProductName}
              // refetchProducts={refetchProducts}
              // setRefetchProducts={setRefetchProducts}
              // handleEditProduct={handleEditProduct}
            />
          </Stack>
        </Box>
        <Fab
          variant="extended"
          aria-label="add new service"
          // onClick={handleDialogOpen} // Open the dialog on click
          onClick={() => {
            navigate('/services/add-new-service');
          }}
          sx={{
            position: 'fixed',
            bottom: '20px',
            right: '20px',
            height: '50px',
            bgcolor: 'secondary.light',
          }}
        >
          <AddIcon sx={{ fontSize: '28px' }} />
          <Typography
            variant="button1"
            sx={{
              textTransform: 'none',
            }}
          >
            Add Service
          </Typography>
        </Fab>
      </Box>
      {/* <Dialog
        open={dialogOpen}
        onClose={handleDialogClose}
        fullScreen
        TransitionComponent={Transition}
      >
        <AddOrUpdateItem
          // handleDialogClose={handleDialogClose}
          // adminId={adminUser?.id ?? ''}
          // adminName={adminUser?.firstName ?? ''}
          // sellerFacetValueId={sellerFacetValueId}
          // callbackOnAdd={() => {
          //   setNewProductCreated(true);
          // }}
          productToEditId={productToEditId}
        />
      </Dialog> */}
      <CustomSnackBar
        message={
          productAction === 'created'
            ? `Added ${updatedProductName} successfully`
            : `Deleted ${updatedProductName} successfully`
        }
        severity="success"
        color="success"
        duration={3000}
        vertical="top"
        horizontal="center"
        open={productAction !== ''}
        handleClose={() => {
          setProductAction('');
        }}
      />
    </>
  );
}

export default ServicesHome;
