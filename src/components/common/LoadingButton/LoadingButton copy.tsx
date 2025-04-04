import { Box, Button, CircularProgress, Typography } from '@mui/material';
import React from 'react';

interface LoadingButtonProps {
  loading: boolean;
  variant: any;
  type: any;
  buttonContainerStyles: any;
  buttonStyles: any;
  label: any;
  labelStyles: any;
  labelVariant: any;
  progressSize: any;
  progressThickness: any;
  progressStyles: any;
  onClick: any;
}

const LoadingButton: React.FC<LoadingButtonProps> = ({
  loading,
  variant,
  type,
  buttonContainerStyles,
  buttonStyles,
  label,
  labelStyles,
  labelVariant,
  progressSize,
  progressThickness,
  progressStyles,
  onClick,
}) => {
  const buttonSx = {
    '&.Mui-disabled': {
      backgroundColor: buttonStyles.backgroundColor,
      color: buttonStyles.backgroundColor,
    },
    '&:hover': {
      backgroundColor: buttonStyles.backgroundColor,
    },
    '&:focus': {
      backgroundColor: buttonStyles.backgroundColor,
    },
    '&:active': {
      backgroundColor: buttonStyles.backgroundColor,
    },
    ...buttonStyles,
  };
  if (loading) labelStyles.color = buttonStyles.backgroundColor;
  return (
    <Box sx={{ position: 'relative', ...buttonContainerStyles }}>
      <Button
        variant={variant}
        fullWidth
        type={type}
        disabled={loading}
        sx={{ ...buttonSx, width: '100%', height: '100%' }}
        onClick={onClick}
      >
        <Typography
          sx={{
            textTransform: 'none',
            ...labelStyles,
          }}
          variant={labelVariant}
        >
          {label}
        </Typography>
      </Button>
      {loading && (
        <CircularProgress
          size={progressSize}
          thickness={progressThickness}
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            marginTop: '-12px',
            marginLeft: '-12px',
            ...progressStyles,
          }}
          disableShrink
        />
      )}
    </Box>
  );
};

export default LoadingButton;
