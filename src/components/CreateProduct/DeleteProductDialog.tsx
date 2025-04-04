import { useLazyQuery, useMutation } from '@apollo/client';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  Typography,
} from '@mui/material';
import React, { useEffect, useState } from 'react';
import {
  DELETE_ASSETS,
  DELETE_PRODUCT,
  GET_PRODUCT_ASSETS_TO_DELETE,
} from '../../libs/graphql/definitions/product-definitions';
import { useNavigate } from 'react-router-dom';
import LoadingCircle from '../common/LoadingCircle';

interface DeleteProductDialogProps {
  open: boolean;
  name: string;
  productToEditId: string;
  existingImages?: any[];
  fetchImages: boolean; //is true when calling delete from homescreen as we won't have pre-fetched asset data when calling delete directly from homescreen
  afterProductDeleted: () => void;
  closeDialog: () => void;
}

const DeleteProductDialog: React.FC<DeleteProductDialogProps> = ({
  open,
  name,
  productToEditId,
  existingImages = [],
  fetchImages = false,
  afterProductDeleted,
  closeDialog,
}) => {
  const [deletingProduct, setDeletingProduct] = useState(false);
  const [deleteProduct] = useMutation(DELETE_PRODUCT);
  const [deleteAssets] = useMutation(DELETE_ASSETS);
  const [fetchedImages, setFetchedImages] = useState<any[]>([]);

  const [fetchImagesFunc, { loading, error, data }] = useLazyQuery(
    GET_PRODUCT_ASSETS_TO_DELETE,
    {
      variables: {
        id: productToEditId,
      },
      fetchPolicy: 'cache-and-network',
      onCompleted: (fetchedData) => {
        console.log('fetched all images');
        console.log(fetchedData);
        //create images by adding cover image as well
        const allImages = [...fetchedData.product.assets];
        if (allImages && fetchedData.product.featuredAsset) {
          allImages.push(fetchedData.product.featuredAsset);
        }
        setFetchedImages(allImages);
      },
    }
  );

  useEffect(() => {
    //only fetch images if delete-product dialog is open to avoid unnecessary network calls (needed when calling delete from homescreen)
    if (open && fetchImages) {
      fetchImagesFunc();
    }
  }, [open]);

  const handleDelete = async () => {
    setDeletingProduct(true);
    let deletedProduct = false;
    //delete product
    try {
      const result = await deleteProduct({
        variables: {
          id: productToEditId,
        },
      });
      deletedProduct = true;
    } catch (err) {
      // setServiceError(true);
      console.error('Failed to delete product', err);
    }
    //deleting associated assets
    if (existingImages && existingImages?.length > 0) {
      try {
        const result = await deleteAssets({
          variables: {
            input: { assetIds: existingImages?.map((asset) => asset.id) },
          },
        });
      } catch (err) {
        // setServiceError(true);
        console.error('Failed to delete assets:', err);
      }
    } //deleting fetched assets
    else if (fetchedImages && fetchedImages?.length > 0) {
      try {
        const result = await deleteAssets({
          variables: {
            input: { assetIds: fetchedImages?.map((asset) => asset.id) },
          },
        });
      } catch (err) {
        // setServiceError(true);
        console.error('Failed to delete assets:', err);
      }
    }
    setDeletingProduct(false);
    if (deletedProduct) afterProductDeleted();
  };

  return (
    <>
      <Dialog
        open={open}
        sx={{
          '& .MuiDialog-container': {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          },
          '& .MuiPaper-root': {
            minWidth: '300px', // Ensure Dialog has the fixed width
            minHeight: '150px', // Set fixed height
          },
        }}
      >
        {!deletingProduct && (
          <>
            <DialogContent>
              <DialogContentText id="alert-dialog-description">
                <Typography variant="heavyb1" sx={{ color: 'grey.800' }}>
                  Delete {name} from store ?
                </Typography>
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button
                onClick={() => {
                  handleDelete();
                }}
              >
                <Typography variant="button1" sx={{ color: 'warning.dark' }}>
                  Yes, Delete
                </Typography>
              </Button>
              <Button onClick={closeDialog}>
                <Typography variant="button1" sx={{ color: 'grey.600' }}>
                  Cancel
                </Typography>
              </Button>
            </DialogActions>
          </>
        )}
        {/* {deletingProduct && <LoadingCircle message={`Deleting product`} />} */}
        {deletingProduct && (
          <DialogContent>
            <LoadingCircle
              message={`Deleting ${name} from store...`}
              color="secondary"
              size={45}
              thickness={5}
              textVariant="heavyb1"
              textColor="grey.900"
            />
          </DialogContent>
        )}
      </Dialog>
    </>
  );
};

export default DeleteProductDialog;
