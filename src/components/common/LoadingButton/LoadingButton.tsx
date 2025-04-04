import {
  Box,
  Button,
  CircularProgress,
  Stack,
  Typography,
} from '@mui/material';
import React from 'react';

interface LoadingButtonProps {
  loading: boolean;
  variant: any;
  type: any;
  buttonContainerStyles: any;
  buttonStyles: any;
  label: any;
  loadingLabel?: any;
  labelStyles: any;
  loadingLabelStyles?: any;
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
  loadingLabel,
  labelStyles,
  loadingLabelStyles,
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
    <Box sx={{ ...buttonContainerStyles }}>
      <Button
        variant={variant}
        fullWidth
        type={type}
        disabled={loading}
        sx={{ ...buttonSx, width: '100%', height: '100%' }}
        onClick={onClick}
      >
        {!loading && (
          <Typography
            sx={{
              textTransform: 'none',
              ...labelStyles,
            }}
            variant={labelVariant}
          >
            {label}
          </Typography>
        )}
        {loading && (
          <Stack
            direction="row"
            gap={1}
            sx={{ display: 'flex', alignItems: 'center' }}
          >
            <CircularProgress
              size={progressSize}
              thickness={progressThickness}
              sx={{
                ...progressStyles,
              }}
              disableShrink
            />
            <Typography
              sx={{
                textTransform: 'none',
                ...loadingLabelStyles,
              }}
              variant={labelVariant}
            >
              {loadingLabel}
            </Typography>
          </Stack>
        )}
      </Button>
    </Box>
  );
};

export default LoadingButton;
