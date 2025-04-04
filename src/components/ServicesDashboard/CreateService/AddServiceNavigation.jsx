import { Breadcrumbs, Link, Typography } from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import AddIcon from '@mui/icons-material/Add';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import React from 'react';

function AddItemNavigation() {
  return (
    <>
      <Breadcrumbs aria-label="breadcrumb">
        <Link
          underline="hover"
          sx={{ display: 'flex', alignItems: 'center' }}
          color="GrayText"
          href="/services/home"
        >
          <ArrowBackIosIcon /> <HomeIcon sx={{ ml: 1 }} fontSize="medium" />
          Home
        </Link>
      </Breadcrumbs>
    </>
  );
}

export default AddItemNavigation;
