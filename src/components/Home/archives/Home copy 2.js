import React, { useEffect, useRef, useState } from 'react';
import MainAppBar from '../../common/MainAppBar';
import Products from '../../ProductsList';
import {
  Box,
  Container,
  Fab,
  Grid,
  Paper,
  Stack,
  Tab,
  Tabs,
  Typography,
  useTheme,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
  Slide,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import ListAltIcon from '@mui/icons-material/ListAlt';
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';
import CampaignIcon from '@mui/icons-material/Campaign';
import Orders from '../../Orders';
import { motion } from 'framer-motion';

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
  const [tabValue, setTabValue] = React.useState(0);
  const productsTabRef = useRef(null);
  const ordersTabRef = useRef(null);
  const [dialogOpen, setDialogOpen] = useState(false); // State for dialog visibility
  const [initialLoad, setInitialLoad] = useState(true); // Track initial load state

  const handleChangeTab = (event, newValue) => {
    setTabValue(newValue);
  };

  const scrollTabToTop = () => {
    window.scrollTo({
      top: 160, // Vertical position after initial load
      behavior: 'smooth', // Smooth scrolling
    });
  };

  // Scroll to the top only on the initial load
  useEffect(() => {
    if (initialLoad) {
      window.scrollTo(0, 0); // Scroll to the top of the page
      setInitialLoad(false); // Set initial load to false after scrolling
    }
  }, [initialLoad]);

  // Handle opening and closing the dialog
  const handleDialogClose = () => {
    setDialogOpen(false);
  };
  const handleDialogOpen = () => {
    setDialogOpen(true);
  };

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
          }}
        >
          <Grid container columnSpacing={1} rowSpacing={3}>
            <Grid item xs={4} className="flexCenter">
              <Paper
                as={motion.div}
                initial={{ scale: 1 }}
                animate={{
                  scale: [1, 1.1, 0.9, 1],
                }}
                transition={{
                  duration: 0.8,
                  ease: 'easeInOut',
                  delay: 2,
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
                top: '45px',
                zIndex: 1000,
                backgroundColor: theme.palette.background.paper,
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
                ref={productsTabRef}
                sx={{
                  mt: 2,
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
                  <Typography variant="button1" sx={{ textTransform: 'none' }}>
                    Add Product
                  </Typography>
                </Fab>
              </Container>
            </TabPanel>
            <TabPanel value={tabValue} index={1} dir={theme.direction}>
              <Container
                ref={ordersTabRef}
                sx={{
                  mt: 2,
                }}
              >
                <Orders />
              </Container>
            </TabPanel>
          </Paper>
        </Container>
      </Box>

      {/* Fullscreen Dialog for Add Product */}
      <Dialog
        open={dialogOpen}
        onClose={handleDialogClose}
        fullScreen
        TransitionComponent={(props) => <Slide direction="up" {...props} />}
      >
        <DialogTitle>Add New Product</DialogTitle>
        <DialogContent>
          {/* Your form or product input fields go here */}
          <Typography variant="body1">Form to add product</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleDialogClose} color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default Home;
