import * as React from 'react';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import StoreIcon from '@mui/icons-material/Store';
import EditIcon from '@mui/icons-material/Edit';
import {
  Grid,
  AppBar,
  Toolbar,
  Drawer,
  Box,
  List,
  ListItem,
  ListItemButton,
  styled,
  ListItemText,
  Divider,
  useTheme,
  Stack,
  Link,
  Button,
  Typography,
  ListItemIcon,
  Avatar,
} from '@mui/material';
import logo from './logo_small-removebg-preview.png';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import SettingsIcon from '@mui/icons-material/Settings';
import HomeIcon from '@mui/icons-material/Home';
import LaunchIcon from '@mui/icons-material/Launch';
import CurrencyRupeeIcon from '@mui/icons-material/CurrencyRupee';
import ListAltIcon from '@mui/icons-material/ListAlt';
import PWAInstallButton from './PWAInstallButton';
import { useUserContext } from '../../../hooks/useUserContext';
import Logout from '../../Logout';

export default function MainAppBar() {
  const theme = useTheme();
  const { adminUser } = useUserContext();
  const navigate = useNavigate();
  const [openLeftDrawer, setOpenLeftDrawer] = React.useState(false);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [expanded, setExpanded] = React.useState(false);
  let storeLogo = adminUser?.customFields?.businessLogo?.preview;

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLinkClick = (link) => {
    setOpenLeftDrawer(false);
    handleMenuClose();
    setExpanded(false);
    navigate(link);
  };

  const leftDrawerList = (
    <Box role="presentation" sx={{ width: '270px' }}>
      <List>
        <Stack
          gap={1}
          direction="row"
          sx={{ display: 'flex', alignItems: 'center', ml: 1, mb: 2, mt: 1 }}
        >
          <Avatar
            variant="circular"
            src={storeLogo}
            sx={{
              width: '60px',
              height: '60px',
              padding: 1.5,
              bgcolor:
                storeLogo != null && storeLogo !== ''
                  ? 'transparent'
                  : 'primary.light',
              // border: '1px solid #42a5f5',
              '& img': {
                objectFit: 'contain', // Ensures image covers the Avatar
                objectPosition: 'center', // Centers the image focus
              },
            }}
          >
            <StoreIcon sx={{ fontSize: '40px' }} />
          </Avatar>
          <Stack>
            <Typography variant="heavyb2" sx={{ color: 'grey.900' }}>
              {adminUser?.customFields.businessName}
            </Typography>
            <Typography variant="heavyb3" sx={{ color: 'grey.700' }}>
              {adminUser?.customFields.whatsapp}
            </Typography>
          </Stack>
        </Stack>
        <Divider />
        <ListItemButton
          // sx={{ mt: 1 }}
          onClick={() => {
            handleLinkClick(`/home`);
          }}
        >
          <ListItemIcon>
            <HomeIcon
              fontSize="medium"
              sx={{ color: theme.palette.grey[800] }}
            />
          </ListItemIcon>
          <ListItemText
            primary={
              <Typography
                variant="label1"
                sx={{ color: theme.palette.grey[800] }}
              >
                Home
              </Typography>
            }
          />
        </ListItemButton>
        <ListItemButton
          // sx={{ mt: 1 }}
          onClick={() => {
            handleLinkClick(`/orders`);
          }}
        >
          <ListItemIcon>
            <ListAltIcon
              fontSize="medium"
              sx={{ color: theme.palette.grey[800] }}
            />
          </ListItemIcon>
          <ListItemText
            primary={
              <Typography
                variant="label1"
                sx={{ color: theme.palette.grey[800] }}
              >
                Orders
              </Typography>
            }
          />
        </ListItemButton>
        <ListItemButton
          // sx={{ mt: 1 }}
          onClick={() => {
            handleLinkClick(`/banners`);
          }}
        >
          <ListItemIcon>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <StoreIcon
                fontSize="medium"
                sx={{ color: theme.palette.grey[800] }}
              />
              <EditIcon
                sx={{ color: theme.palette.grey[800], fontSize: '14px' }}
              />
            </Box>
          </ListItemIcon>
          <ListItemText
            primary={
              <Typography
                variant="label1"
                sx={{ color: theme.palette.grey[800] }}
              >
                Customize Store
              </Typography>
            }
          />
        </ListItemButton>
        <ListItemButton
          // sx={{ mt: 1 }}
          onClick={() => {
            handleLinkClick(`/store-settings`);
          }}
        >
          <ListItemIcon>
            <SettingsIcon
              fontSize="medium"
              sx={{ color: theme.palette.grey[800] }}
            />
          </ListItemIcon>
          <ListItemText
            primary={
              <Typography
                variant="label1"
                sx={{ color: theme.palette.grey[800] }}
              >
                Store Settings
              </Typography>
            }
          />
        </ListItemButton>
        <ListItemButton
          // sx={{ mt: 1 }}
          onClick={() => {
            handleLinkClick(`/payment-settings`);
          }}
        >
          <ListItemIcon>
            <CurrencyRupeeIcon
              fontSize="medium"
              sx={{ color: theme.palette.grey[800] }}
            />
          </ListItemIcon>
          <ListItemText
            primary={
              <Typography
                variant="label1"
                sx={{ color: theme.palette.grey[800] }}
              >
                UPI Settings
              </Typography>
            }
          />
        </ListItemButton>
        <ListItem>
          <PWAInstallButton />
        </ListItem>
      </List>
      <Grid
        container
        rowSpacing={1}
        sx={{
          width: '100%',
          mt: '80px',
          mb: '20px',
        }}
      >
        <Grid
          item
          xs={12}
          sx={{
            display: 'flex',
            justifyContent: 'center',
          }}
        >
          <Logout />
        </Grid>
        <Grid
          item
          xs={12}
          sx={{
            display: 'flex',
            justifyContent: 'center',
          }}
        >
          <Typography variant="heavyb2" sx={{ color: theme.palette.grey[600] }}>
            About Zottr
          </Typography>
        </Grid>
        <Grid
          item
          xs={12}
          sx={{
            display: 'flex',
            justifyContent: 'center',
          }}
        >
          <Typography variant="b2" sx={{ color: theme.palette.grey[600] }}>
            Terms & Conditions
          </Typography>
        </Grid>
        <Grid
          item
          xs={12}
          sx={{
            display: 'flex',
            justifyContent: 'center',
          }}
        >
          <Typography variant="b2" sx={{ color: theme.palette.grey[600] }}>
            Privacy Policy
          </Typography>
        </Grid>
      </Grid>
    </Box>
  );

  return (
    <>
      <Drawer
        anchor="left"
        open={openLeftDrawer}
        onClose={() => {
          setOpenLeftDrawer(false);
        }}
        sx={{
          zIndex: (theme) => theme.zIndex.drawer,
        }}
      >
        {leftDrawerList}
      </Drawer>
      <AppBar
        elevation={0}
        sx={{
          height: '50px',
          bgcolor: 'primary.surface',
        }}
        position="fixed"
      >
        <Toolbar variant="regular">
          <Stack
            direction="row"
            sx={{
              width: '100%',
              display: 'flex',
              justifyContent: 'space-between',
            }}
          >
            <Stack
              direction="row"
              gap={1.5}
              sx={{ display: 'flex', alignItems: 'center' }}
            >
              <IconButton
                aria-label="menu"
                onClick={() => {
                  setOpenLeftDrawer(true);
                }}
                sx={{ p: 0 }}
              >
                <MenuIcon
                  sx={{ fontSize: '30px', color: theme.palette.primary.main }}
                />
              </IconButton>
              <Link to="/home" sx={{ pt: 1 }}>
                <img src={logo} alt="Logo" style={{ height: '28px' }} />
              </Link>
            </Stack>
            <Stack
              direction="row"
              gap={1}
              sx={{ display: 'flex', alignItems: 'center' }}
            >
              <Button
                variant="text"
                aria-label="menu"
                onClick={() => {
                  setOpenLeftDrawer(true);
                }}
                sx={{ px: 1, borderRadius: '25px' }}
              >
                <Typography variant="button3">Visit Store</Typography>
                <LaunchIcon
                  sx={{
                    fontSize: '16px',
                    ml: 0.5,
                  }}
                />
              </Button>
              <IconButton
                aria-label="menu"
                onClick={() => {
                  setOpenLeftDrawer(true);
                }}
                sx={{ p: 0 }}
              >
                <SettingsIcon
                  sx={{ fontSize: '30px', color: theme.palette.primary.main }}
                />
              </IconButton>
            </Stack>
          </Stack>
        </Toolbar>
      </AppBar>
    </>
  );
}
