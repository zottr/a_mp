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
import logo from '/logos/zottr_logo_small1.svg';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import SettingsIcon from '@mui/icons-material/Settings';
import HomeIcon from '@mui/icons-material/Home';
import LaunchIcon from '@mui/icons-material/Launch';
import CurrencyRupeeIcon from '@mui/icons-material/CurrencyRupee';
import ListAltIcon from '@mui/icons-material/ListAlt';
import PWAInstallButton from '../PWAInstallButton';
import { useUserContext } from '../../../hooks/useUserContext';
import Logout from '../../Logout';
import PersonIcon from '@mui/icons-material/Person';

export default function ServicesMainAppBar() {
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
            <PersonIcon sx={{ fontSize: '40px' }} />
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
            handleLinkClick(`/services/home`);
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
            handleLinkClick(`/services/customize`);
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
                Customize Profile
              </Typography>
            }
          />
        </ListItemButton>
        <ListItemButton
          // sx={{ mt: 1 }}
          onClick={() => {
            handleLinkClick(`/services/settings`);
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
                Account Settings
              </Typography>
            }
          />
        </ListItemButton>
        <ListItem
          sx={{
            mt: 3,
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Button
            variant="contained"
            sx={{ px: 2, py: 1 }}
            onClick={() => {
              handleLinkClick(`/seller/home`);
            }}
          >
            <Stack direction="row" gap={1}>
              <Typography variant="label1">Sell Products</Typography>
              <LaunchIcon />
            </Stack>
          </Button>
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
            my: 1,
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <PWAInstallButton />
        </Grid>
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
          height: '55px',
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
              <Link
                component={RouterLink}
                to="/services/home"
                sx={{ pt: 2, ml: -1 }}
              >
                <img src={logo} alt="Logo" style={{ height: '70px' }} />
              </Link>
            </Stack>
            <Stack
              direction="row"
              gap={1}
              sx={{ display: 'flex', alignItems: 'center' }}
            >
              <Link
                href={`https://urbanahaat.zottr.com/seller/${adminUser?.id}`}
                target="_blank" //Opens the link in a new tab.
                rel="noopener noreferrer" //Prevents potential security vulnerabilities (e.g., window.opener access by the new tab).
              >
                <Button
                  variant="contained"
                  aria-label="menu"
                  sx={{
                    px: 1,
                    borderRadius: '25px',
                    bgcolor: 'primary.light',
                    '&:hover, &:focus, &:active': {
                      backgroundColor: 'primary.light',
                    },
                  }}
                >
                  <Typography variant="button2" sx={{ color: 'common.white' }}>
                    View Profile
                  </Typography>
                  <LaunchIcon
                    sx={{
                      fontSize: '16px',
                      ml: 0.5,
                      color: 'common.white',
                    }}
                  />
                </Button>
              </Link>
              {/* <IconButton
                aria-label="menu"
                onClick={() => {
                  setOpenLeftDrawer(true);
                }}
                sx={{ p: 0 }}
              >
                <SettingsIcon
                  sx={{ fontSize: '30px', color: theme.palette.primary.main }}
                />
              </IconButton> */}
            </Stack>
          </Stack>
        </Toolbar>
      </AppBar>
    </>
  );
}
