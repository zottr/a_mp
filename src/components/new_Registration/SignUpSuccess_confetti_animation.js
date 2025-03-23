import { Button, Container, Stack, Typography, useTheme } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import Confetti from 'react-confetti';
import { useEffect, useState } from 'react';
import { CheckCircle } from '@mui/icons-material'; // CheckCircleIcon from MUI
import { motion } from 'framer-motion'; // Import framer-motion

function SignUpSuccess() {
  const theme = useTheme();
  const [confettiTrigger, setConfettiTrigger] = useState(false);

  useEffect(() => {
    // Trigger confetti animation after component is mounted
    setConfettiTrigger(true);
  }, []);

  return (
    <Container
      sx={{
        px: 5,
        mt: '100px',
        animation: 'slideInFromRight 0.2s ease-out', // Applying the animation
      }}
    >
      {/* Conditionally render confetti */}
      {confettiTrigger && (
        <Confetti
          width={window.innerWidth}
          height={window.innerHeight}
          gravity={0.1}
          numberOfPieces={100}
          recycle={false}
          opacity={0.8}
        />
      )}

      <Stack className="flexCenter" gap={5}>
        <Stack gap={1} className="flexCenter">
          {/* Animated CheckCircle Icon */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
          >
            <CheckCircle
              sx={{ fontSize: '120px', color: theme.palette.success.main }}
            />
          </motion.div>
          <Typography
            variant="h5"
            color="success.light"
            sx={{ fontWeight: '500' }}
          >
            Congratulations
          </Typography>
        </Stack>
        <Typography
          variant="heavyb1"
          sx={{
            textAlign: 'center',
            color: theme.palette.grey[600],
          }}
        >
          Your seller account has been created successfully!
        </Typography>
        <Button
          component={RouterLink}
          to={'/home'}
          variant="contained"
          sx={{ width: '90%', height: '50px' }}
        >
          <Typography variant="button1">Go To Dashboard</Typography>
        </Button>
      </Stack>
    </Container>
  );
}

export default SignUpSuccess;
