import {
  Button,
  IconButton,
  Menu,
  MenuItem,
  Tooltip,
  Typography,
} from '@mui/material';
import { useState } from 'react';
import StarIcon from '@mui/icons-material/Star';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import DeleteIcon from '@mui/icons-material/Delete';

function ImageMenu({
  existing,
  handleSelectCoverImage,
  handleRemoveImage,
  index,
  mainImageIndex,
}) {
  //Image Options
  const [anchorEl, setAnchorEl] = useState(null);
  const openImageMenu = Boolean(anchorEl);
  const handleImageMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const closeImageMenu = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <Tooltip
        title="Image Options"
        sx={{ position: 'absolute', top: 1, right: 1, zIndex: 1000, p: 0 }}
      >
        <IconButton onClick={handleImageMenuClick}>
          <MoreVertIcon fontSize="medium" sx={{ color: 'primary.light' }} />
        </IconButton>
      </Tooltip>
      <Menu
        id="image-menu"
        anchorEl={anchorEl}
        open={openImageMenu}
        onClose={closeImageMenu}
      >
        <MenuItem>
          <Button
            variant="text"
            onClick={() =>
              handleSelectCoverImage(index, existing, closeImageMenu)
            }
            sx={{ color: 'grey.700' }}
          >
            {mainImageIndex ===
            (existing ? `existing-${index}` : `new-${index}`) ? (
              <StarIcon sx={{ mr: 1 }} />
            ) : (
              <StarBorderIcon sx={{ mr: 1 }} />
            )}
            <Typography variant="button2">Set as Cover</Typography>
          </Button>
        </MenuItem>
        <MenuItem>
          <Button
            variant="text"
            onClick={() => handleRemoveImage(index, true, closeImageMenu)}
            sx={{ color: 'grey.700' }}
          >
            <DeleteIcon sx={{ mr: 1 }} />
            <Typography variant="button2">Delete Image</Typography>
          </Button>
        </MenuItem>
      </Menu>
    </>
  );
}

export default ImageMenu;
