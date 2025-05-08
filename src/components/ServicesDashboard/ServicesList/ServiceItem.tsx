import {
  Avatar,
  Box,
  Button,
  Divider,
  Grid,
  IconButton,
  Menu,
  MenuItem,
  Stack,
  Typography,
} from '@mui/material';
import { useState } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import ProductStateInfoAlert from './ServiceStateInfoAlert';
import ShareIcon from '@mui/icons-material/Share';
import PhotoIcon from '@mui/icons-material/Photo';
import logo from '/logos/zottr_logo_small2_white_light_grey.svg';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { UPDATE_PRODUCT } from '../../../libs/graphql/definitions/product-definitions';
import { useMutation } from '@apollo/client';
import CustomSnackBar from '../../common/Snackbars/CustomSnackBar';
import DeleteProductDialog from '../../CreateProduct/DeleteProductDialog';
import ReplyIcon from '@mui/icons-material/Reply';
import ShareButton from '../../common/ShareButton';

interface ItemProps {
  item: any;
  onItemUpdate: any;
  setProductAction: any;
  setUpdatedProductName: any;
  setRefetchProducts: any;
}

const Item: React.FC<ItemProps> = ({
  item,
  onItemUpdate,
  setProductAction,
  setUpdatedProductName,
  setRefetchProducts,
}) => {
  const navigate = useNavigate();
  const [checked, setChecked] = useState(true);
  const [statusMessage, setStatusMessage] = useState('');
  const [sendAlert, setSendAlert] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [enableDisableProduct] = useMutation(UPDATE_PRODUCT);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);

  const handleMenuOpen = (event: any) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  function closeAlert() {
    setSendAlert(false);
  }

  const toggleProductVisibility = async (event: any) => {
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
    navigate(`/service/${item.id}`);
    // handleEditProduct(item.id);
  };

  function afterProductDeleted() {
    setOpenDeleteDialog(false);
    setUpdatedProductName(item.name);
    setProductAction('deleted');
    setRefetchProducts(true);
    // const productData = { action: 'deleted', name: item.name };
    // Store the data in sessionStorage
    // sessionStorage.setItem('productData', JSON.stringify(productData));
    // navigate('/services/home');
  }

  function deleteItem() {
    handleMenuClose();
    setOpenDeleteDialog(true);
  }

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
              to={`/service/${item.id}`}
              sx={{ textDecoration: 'none', width: '100%', height: '100%' }}
            >
              <Avatar
                alt={item.name}
                src={`${item?.featuredAsset?.preview}?preset=small`}
                variant="rounded"
                sx={{
                  width: '100%',
                  height: '100%',
                  aspectRatio: 1,
                  opacity: item.enabled ? 1 : 0.5,
                  bgcolor: 'grey.300',
                }}
              >
                <img src={logo} alt="Logo" style={{ height: '50px' }} />
              </Avatar>
            </Box>
          </Grid>
          <Grid item xs={6}>
            <Stack
              className="fcs"
              component={RouterLink}
              to={`/service/${item.id}`}
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
              <IconButton>
                <EditIcon sx={{ color: 'success.main', fontSize: '20px' }} />
              </IconButton>
            </Stack>
          </Grid>
          <Grid item xs={3} className={'fcc'}>
            <ShareButton
              preShareAction={() => {}}
              title={item.name}
              text={item.description}
              url={`https://urbanahaat.zottr.com/product/${item?.slug}/share`}
              showLabel={false}
            />
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
        <MenuItem>
          <Button>
            <Stack
              gap={1}
              direction="row"
              sx={{ display: 'flex', alignItems: 'center' }}
            >
              <Typography variant="button2" sx={{ color: 'grey.700' }}>
                Share
              </Typography>
              <ShareIcon fontSize="small" sx={{ color: 'primary.main' }} />
            </Stack>
          </Button>
        </MenuItem>
        <Divider />
        <MenuItem>
          <Button onClick={deleteItem}>
            <Stack
              gap={1}
              direction="row"
              sx={{ display: 'flex', alignItems: 'center' }}
            >
              <Typography variant="button2" sx={{ color: 'grey.700' }}>
                Delete
              </Typography>
              <DeleteIcon fontSize="small" sx={{ color: 'warning.main' }} />
            </Stack>
          </Button>
        </MenuItem>
        <Divider />
        <MenuItem>
          <Button onClick={handleClickEdit}>
            <Stack
              gap={1}
              direction="row"
              sx={{ display: 'flex', alignItems: 'center' }}
            >
              <Typography variant="button2" sx={{ color: 'grey.700' }}>
                Edit
              </Typography>
              <EditIcon fontSize="small" sx={{ color: 'success.main' }} />
            </Stack>
          </Button>
        </MenuItem>
      </Menu>
      <DeleteProductDialog
        open={openDeleteDialog}
        name={item.name}
        productToEditId={item.id}
        fetchImages={true}
        afterProductDeleted={afterProductDeleted}
        closeDialog={() => {
          setOpenDeleteDialog(false);
        }}
      />
    </>
  );
};

export default Item;
