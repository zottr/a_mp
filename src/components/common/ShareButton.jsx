import { Button, Snackbar, IconButton, Typography, Stack } from '@mui/material';
import ShareIcon from '@mui/icons-material/Share';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import CloseIcon from '@mui/icons-material/Close';
import { useState } from 'react';
import { stripHtml } from '../../utils/CommonUtils';
import ReplyIcon from '@mui/icons-material/Reply';

const ShareButton = ({
  title,
  text,
  url,
  preShareAction,
  showLabel = true,
}) => {
  const [toastOpen, setToastOpen] = useState(false);

  const handleShare = async () => {
    preShareAction();
    const message = `${stripHtml(text)}\n\n${url}`;
    if (navigator.share) {
      try {
        await navigator.share({ text: message });
      } catch (error) {
        console.error('Error sharing:', error);
      }
    } else {
      try {
        await navigator.clipboard.writeText(url);
        setToastOpen(true); // Show toast notification
      } catch (error) {
        console.error('Failed to copy:', error);
      }
    }
  };

  return (
    <>
      <Button size="large" onClick={handleShare} sx={{ color: '#1976d2' }}>
        <Stack
          gap={1}
          direction="row"
          sx={{ display: 'flex', alignItems: 'center' }}
        >
          {showLabel && (
            <Typography variant="button1" sx={{ color: 'primary.main' }}>
              Share
            </Typography>
          )}
          {/* <ShareIcon fontSize="small" sx={{ color: 'primary.main' }} /> */}
          <ReplyIcon
            sx={{
              transform: 'scaleX(-1)',
              ml: 1,
              color: 'primary.main',
              fontSize: '28px',
            }}
          />
        </Stack>
      </Button>
      {/* Snackbar for toast message */}
      <Snackbar
        open={toastOpen}
        autoHideDuration={3000} // Closes after 3 seconds
        onClose={() => setToastOpen(false)}
        message="Link copied to clipboard!"
        action={
          <IconButton
            size="small"
            color="inherit"
            onClick={() => setToastOpen(false)}
          >
            <CloseIcon fontSize="small" />
          </IconButton>
        }
      />
    </>
  );
};

export default ShareButton;
