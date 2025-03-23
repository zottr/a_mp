import * as React from 'react';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import { red } from '@mui/material/colors';
import DeleteIcon from '@mui/icons-material/Delete';
import ModeEditIcon from '@mui/icons-material/ModeEdit';
import { Product } from '../../libs/graphql/generated-types';
import {
  DELETE_ASSETS,
  DELETE_PRODUCT,
  DELETE_PRODUCT_VARIANT,
} from '../../libs/graphql/definitions/product-definitions';
import { useMutation } from '@apollo/client';
import ConfirmationDialog from '../common/ConfirmationDialog/ConfirmationDialog';

const ViewProductCard= ({
  item,
  onProductModify,
}) => {
  const [openDialog, setOpenDialog] = React.useState(false);
  const [deleteProduct] = useMutation(DELETE_PRODUCT);
  const [deleteProductVariant] = useMutation(DELETE_PRODUCT_VARIANT);
  const [deleteAssets] = useMutation(DELETE_ASSETS);

  const handleDelete = async () => {
    console.log('In delete');
    let assetIds = item.assets?.map((as) => as.id);
    if (item?.featuredAsset?.id) {
      assetIds.push(item?.featuredAsset?.id);
    }
    try {
      if (assetIds) {
        await deleteAssets({
          variables: { assetIds: assetIds },
        });
      }
      await deleteProductVariant({
        variables: { id: item.variants[0].id },
      });
      await deleteProduct({
        variables: { id: item.id },
      });
      onProductModify();
      setOpenDialog(false);
    } catch (err: any) {
      console.log('Error while deleting product' + err);
    }
  };

  const handleDialogClose = () => {
    setOpenDialog(false);
  };

  const handleEdit = () => {
    console.log('Edit');
  };

  return (
    <>
      <Card sx={{ maxWidth: 345 }}>
        <CardHeader
          avatar={
            <Avatar sx={{ bgcolor: red[500] }} aria-label="product">
              P
            </Avatar>
          }
          title={item.name}
          subheader={item?.variants[0]?.price}
        />
        <CardMedia
          component="img"
          height="194"
          image={item.featuredAsset?.preview?.replace(/\\/g, '/')}
          alt={item.name}
        />
        <CardContent>
          <Typography variant="b2" color="text.secondary">
            {item.description}
          </Typography>
        </CardContent>
        <CardActions sx={{ justifyContent: 'center' }}>
          <IconButton aria-label="Edit" onClick={handleEdit}>
            <ModeEditIcon />
          </IconButton>
          <IconButton
            aria-label="Delete"
            onClick={() => {
              setOpenDialog(true);
            }}
          >
            <DeleteIcon />
          </IconButton>
        </CardActions>
      </Card>
      <ConfirmationDialog
        key={item.id}
        message={`Are you sure, you want to delete ${item.name}`}
        openDialog={openDialog}
        onClose={handleDialogClose}
        onConfirm={handleDelete}
      />
    </>
  );
};

export default ViewProductCard;
