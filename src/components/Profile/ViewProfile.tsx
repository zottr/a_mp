import React, { useState } from 'react';
import { Button, Typography, Box, Container } from '@mui/material';
import { Administrator } from '../../libs/graphql/generated-types';
import EditProfile from './EditProfile';
import { useUserContext } from '../../hooks/useUserContext';
import { useNavigate } from 'react-router-dom';

const ViewProfile: React.FC = () => {
  const navigate = useNavigate();
  const { adminUser, setAdminUser } = useUserContext();
  const [showEdit, setShowEdit] = useState(false);

  const updateUser = (user: Administrator) => {
    setAdminUser(user);
    setShowEdit(false);
  };

  if (adminUser) console.log(adminUser);

  if (!adminUser) {
    return <Typography variant="h6">No user data available</Typography>;
  }

  return (
    <Container>
      <Box p={2}>
        {!showEdit ? (
          <Box mt={2} sx={{ marginTop: '60px' }}>
            <Typography>Name: {adminUser.firstName}</Typography>
            <Typography>Phone: {adminUser.customFields.phoneNumber}</Typography>
            <Typography>
              Business Name: {adminUser.customFields.businessName}
            </Typography>
            <Typography>
              Business Link: {adminUser.customFields.businessUrl}
            </Typography>
            {adminUser.customFields.businessLogo && (
              <Box mt={2}>
                <Typography>Business Logo:</Typography>
                <img
                  src={adminUser.customFields?.businessLogo?.preview}
                  alt="Business Logo"
                  width="100"
                />
              </Box>
            )}
            {adminUser.customFields.banner && (
              <Box mt={2}>
                <Typography>Business Banner:</Typography>
                <img
                  src={adminUser.customFields?.banner?.preview}
                  alt="Business Logo"
                  width="100"
                />
              </Box>
            )}
            {adminUser.customFields.upiScan && (
              <Box mt={2}>
                <Typography>UPI Scanner Image:</Typography>
                <img
                  src={adminUser.customFields?.upiScan?.preview}
                  alt="UPI Scanner"
                  width="100"
                />
              </Box>
            )}
            <Typography>
              UPI Phone: {adminUser.customFields.upiPhone}
            </Typography>
            <Typography>
              UPI Banking Name: {adminUser.customFields.upiName}
            </Typography>
            <Box mt={2} display="flex" justifyContent="space-around">
              <Button variant="contained" onClick={() => setShowEdit(true)}>
                Edit Profile
              </Button>
            </Box>
          </Box>
        ) : (
          <EditProfile
            onUpdateCallback={updateUser}
            onCancelCallback={() => setShowEdit(false)}
          />
        )}
      </Box>
    </Container>
  );
};

export default ViewProfile;
