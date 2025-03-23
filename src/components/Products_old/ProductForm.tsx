import React, { useState, ChangeEvent } from 'react';
import {
  TextField,
  Button,
  Checkbox,
  FormControlLabel,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  Box,
  Typography,
  Card,
  CardContent,
  CardMedia,
  Grid,
  IconButton,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  SelectChangeEvent,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  enabled: boolean;
  category: string;
  images: File[];
  previewImages: string[];
}

const ProductForm: React.FC = () => {
  const [product, setProduct] = useState<Product>({
    id: 0,
    name: '',
    description: '',
    price: 0,
    enabled: false,
    category: '',
    images: [],
    previewImages: [],
  });

  const [productList, setProductList] = useState<Product[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [productToDelete, setProductToDelete] = useState<number | null>(null);

  const handleChange = (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = event.target;
    setProduct((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSelectChange = (event: SelectChangeEvent<string>) => {
    const { name, value } = event.target;
    setProduct((prev) => ({
      ...prev,
      [name as string]: value,
    }));
  };

  const handleCheckboxChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = event.target;
    setProduct((prev) => ({
      ...prev,
      [name]: checked,
    }));
  };

  const handleImageChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const files = Array.from(event.target.files);
      const previewImages = files.map((file) => URL.createObjectURL(file));
      setProduct((prev) => ({
        ...prev,
        images: files,
        previewImages: [...prev.previewImages, ...previewImages],
      }));
    }
  };

  const handleRemoveImage = (index: number) => {
    setProduct((prev) => {
      const updatedImages = [...prev.images];
      const updatedPreviewImages = [...prev.previewImages];
      updatedImages.splice(index, 1);
      updatedPreviewImages.splice(index, 1);
      return {
        ...prev,
        images: updatedImages,
        previewImages: updatedPreviewImages,
      };
    });
  };

  const handleAddProduct = () => {
    if (isEditing) {
      setProductList((prev) =>
        prev.map((p) => (p.id === product.id ? product : p))
      );
      setIsEditing(false);
    } else {
      setProductList((prev) => [...prev, { ...product, id: Date.now() }]);
    }
    resetForm();
  };

  const handleEditProduct = (id: number) => {
    const productToEdit = productList.find((p) => p.id === id);
    if (productToEdit) {
      setProduct(productToEdit);
      setIsEditing(true);
    }
  };

  const handleDeleteProduct = () => {
    if (productToDelete !== null) {
      setProductList((prev) => prev.filter((p) => p.id !== productToDelete));
      setProductToDelete(null);
    }
    setOpenDialog(false);
  };

  const confirmDeleteProduct = (id: number) => {
    setProductToDelete(id);
    setOpenDialog(true);
  };

  const resetForm = () => {
    setProduct({
      id: 0,
      name: '',
      description: '',
      price: 0,
      enabled: false,
      category: '',
      images: [],
      previewImages: [],
    });
  };

  return (
    <Box sx={{ m: 4 }}>
      <Typography variant="h4" gutterBottom>
        {isEditing ? 'Edit Product' : 'Add Product'}
      </Typography>
      <Box component="form" noValidate autoComplete="off">
        <TextField
          name="name"
          label="Product Name"
          fullWidth
          margin="normal"
          value={product.name}
          onChange={handleChange}
        />
        <TextField
          name="description"
          label="Description"
          fullWidth
          margin="normal"
          multiline
          rows={4}
          value={product.description}
          onChange={handleChange}
        />
        <TextField
          name="price"
          label="Price"
          type="number"
          fullWidth
          margin="normal"
          value={product.price}
          onChange={handleChange}
        />
        <FormControlLabel
          control={
            <Checkbox
              name="enabled"
              checked={product.enabled}
              onChange={handleCheckboxChange}
            />
          }
          label="Enabled"
        />
        <FormControl fullWidth margin="normal">
          <InputLabel>Category</InputLabel>
          <Select
            name="category"
            value={product.category}
            onChange={handleSelectChange}
          >
            <MenuItem value="category1">Category 1</MenuItem>
            <MenuItem value="category2">Category 2</MenuItem>
            <MenuItem value="category3">Category 3</MenuItem>
            {/* Add more categories as needed */}
          </Select>
        </FormControl>
        <Button variant="contained" component="label">
          Upload Images
          <input type="file" hidden multiple onChange={handleImageChange} />
        </Button>
        <Box sx={{ mt: 2, display: 'flex', flexWrap: 'wrap' }}>
          {product.previewImages.map((image, index) => (
            <Box key={index} sx={{ mr: 2, mb: 2, position: 'relative' }}>
              <img
                src={image}
                alt={`preview-${index}`}
                style={{ width: 100, height: 100, objectFit: 'cover' }}
              />
              <IconButton
                size="small"
                sx={{ position: 'absolute', top: 0, right: 0 }}
                onClick={() => handleRemoveImage(index)}
              >
                <DeleteIcon />
              </IconButton>
            </Box>
          ))}
        </Box>
        <Button
          variant="contained"
          color="primary"
          sx={{ mt: 2 }}
          onClick={handleAddProduct}
        >
          {isEditing ? 'Update Product' : 'Add Product'}
        </Button>
      </Box>
    </Box>
  );
};

export default ProductForm;
