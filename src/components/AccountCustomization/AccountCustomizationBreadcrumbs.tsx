import Typography from '@mui/material/Typography';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Link from '@mui/material/Link';
import HomeIcon from '@mui/icons-material/Home';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import { Link as RouterLink } from 'react-router-dom';

interface AccountCustomizationBreadcrumbsProps {
  type: any;
}

export const AccountCustomizationBreadcrumbs: React.FC<
  AccountCustomizationBreadcrumbsProps
> = ({ type }) => {
  return (
    <Breadcrumbs
      sx={{ ml: 1 }}
      separator={<NavigateNextIcon fontSize="small" />}
    >
      <Link
        component={RouterLink}
        to={type === 'seller' ? '/seller/home' : '/services/home'}
        underline="hover"
        sx={{ display: 'flex', alignItems: 'flex-start' }}
        color="inherit"
      >
        <HomeIcon sx={{ mr: 0.5, fontSize: '18px' }} />
        <Typography variant="label2">Home</Typography>
      </Link>
      <Typography variant="label2" sx={{ color: 'text.primary' }}>
        Customize Profile
      </Typography>
    </Breadcrumbs>
  );
};
