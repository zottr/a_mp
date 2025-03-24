import {
  Avatar,
  Box,
  Divider,
  Grid,
  IconButton,
  Menu,
  MenuItem,
  Stack,
  Switch,
  Typography,
} from '@mui/material';
import { useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import ProductStateInfoAlert from './ProductStateInfoAlert';
import ShareIcon from '@mui/icons-material/Share';
import PhotoIcon from '@mui/icons-material/Photo';
import EditIcon from '@mui/icons-material/Edit';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { UPDATE_PRODUCT } from '../../libs/graphql/definitions/product-definitions';
import { useMutation } from '@apollo/client';
import CustomSnackBar from '../common/Snackbars/CustomSnackBar';

function Item({ item, onItemUpdate, handleEditProduct }) {
  const [checked, setChecked] = useState(true);
  const [statusMessage, setStatusMessage] = useState('');
  const [sendAlert, setSendAlert] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [enableDisableProduct] = useMutation(UPDATE_PRODUCT);

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  function closeAlert() {
    setSendAlert(false);
  }

  const toggleProductVisibility = async (event) => {
    const response = await enableDisableProduct({
      variables: {
        input: {
          id: item.id,
          enabled: event.target.checked,
        },
      },
    });
    if (response.data) {
      const updatedItem = response.data.updateProduct;
      setChecked(updatedItem.enabled);
      if (updatedItem.enabled)
        setStatusMessage(`${item.name} will be visible in store`);
      else setStatusMessage(`${item.name} won't be visible in store`);
      setSendAlert(true);
      onItemUpdate(updatedItem);
    }
  };

  const handleClickEdit = () => {
    handleEditProduct(item.id);
  };

  return (
    <>
      <Box>
        <Grid container spacing={1} alignItems={'center'}>
          <Grid
            item
            xs={3}
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '100%',
              aspectRatio: 1,
            }}
          >
            <Box
              component={RouterLink}
              to={`/item`}
              sx={{ textDecoration: 'none', width: '100%', height: '100%' }}
            >
              <Avatar
                alt={item.name}
                src={item?.featuredAsset?.preview}
                variant="rounded"
                sx={{
                  width: '100%',
                  height: '100%',
                  aspectRatio: 1,
                  opacity: item.enabled ? 1 : 0.5,
                }}
              >
                <PhotoIcon sx={{ fontSize: '64px' }} />
              </Avatar>
            </Box>
          </Grid>
          <Grid item xs={6}>
            <Box
              component={RouterLink}
              to={`/item`}
              sx={{ textDecoration: 'none' }}
            >
              <Typography
                variant="heavyb2"
                sx={{
                  width: '100%',
                  color: 'black',
                  textWrap: 'wrap',
                  wordWrap: 'break-word',
                  opacity: item.enabled ? 1 : 0.5,
                }}
              >
                {item.name}
              </Typography>
            </Box>
          </Grid>
          <Grid container item xs={3} className={'flexCenter'}>
            <Grid item xs={4} className={'flexRight'}>
              <IconButton
                onClick={handleClickEdit}
                sx={{
                  pointerEvents: checked ? 'auto' : 'none',
                  // opacity: checked ? 1 : 0.5,
                }}
              >
                <EditIcon fontSize="small" color="primary" />
              </IconButton>
            </Grid>
            <Grid item xs={4} className={'flexCenter'}>
              <Switch
                color="primary"
                defaultChecked
                onChange={toggleProductVisibility}
                checked={item.enabled}
                size="small"
              />
            </Grid>
            <Grid item xs={4}>
              <IconButton
                onClick={handleMenuOpen}
                sx={{
                  pointerEvents: checked ? 'auto' : 'none',
                  // opacity: checked ? 1 : 0.5,
                }}
              >
                <MoreVertIcon fontSize="medium" color="primary" />
              </IconButton>
            </Grid>
          </Grid>
        </Grid>
      </Box>
      <CustomSnackBar
        message={statusMessage}
        severity="info"
        color="info"
        duration={3000}
        vertical="top"
        horizontal="center"
        open={sendAlert}
        handleClose={closeAlert}
      />

      {/* User Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        MenuListProps={{
          sx: {
            bgcolor: 'white', // Background color for the entire menu
            color: 'black', // Text color for all menu items
          },
        }}
      >
        <MenuItem
          component={RouterLink}
          to="/order-history"
          onClick={handleMenuClose}
        >
          Orders
        </MenuItem>
        <MenuItem
          component={RouterLink}
          to="/favourites"
          onClick={handleMenuClose}
        >
          Favorites
        </MenuItem>
      </Menu>
    </>
  );
}

export default Item;
