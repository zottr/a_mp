import { styled } from '@mui/material/styles';
import TextField from '@mui/material/TextField';

const StyledTextField = styled(TextField)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    borderRadius: '8px', // Adjust the border radius as needed
    borderStyle: 'solid',
    borderWidth: '1px',
    borderColor: theme.palette.grey[600],
  },
  '& .MuiInputLabel-root.Mui-error': {
    color: theme.palette.error.main,
  },
  '& .MuiOutlinedInput-root.Mui-error .MuiOutlinedInput-notchedOutline': {
    borderWidth: '1.5px',
    borderStyle: 'solid',
  },
  '& .MuiFormHelperText-root.Mui-error': {
    color: theme.palette.error.main,
    fontSize: '0.875rem',
    fontWeight: 400,
    lineHeight: 1.43,
    letterSpacing: '0.01071em',
    fontStyle: 'normal',
  },
}));

export default StyledTextField;
