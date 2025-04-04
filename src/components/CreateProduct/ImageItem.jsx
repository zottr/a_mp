import { Box } from '@mui/material';
import React from 'react';
import ImageMenu from './ImageMenu';

function ImageItem({
  existing,
  index,
  mainImageIndex,
  imageSrc,
  handleSelectCoverImage,
  handleRemoveImage,
}) {
  return (
    <Box
      className="flexCenter"
      key={index}
      sx={{
        position: 'relative',
        width: '100%',
        aspectRatio: 1,
      }}
      border={
        mainImageIndex === (existing ? `existing-${index}` : `new-${index}`)
          ? // ? '1px solid #1976d2'
            '1px solid #FFA000'
          : '1px solid #e3f2fd'
        //'1px solid hsl(45, 100%, 85%)'
      }
    >
      <Box
        component="img"
        src={imageSrc}
        alt={`preview-${index}`}
        sx={{
          p: 3,
          objectFit: 'contain',
          width: '100%',
          aspectRatio: 1,
        }}
      />
      <ImageMenu
        existing={existing}
        handleSelectCoverImage={handleSelectCoverImage}
        handleRemoveImage={handleRemoveImage}
        index={index}
        mainImageIndex={mainImageIndex}
      />
    </Box>
  );
}

export default ImageItem;
