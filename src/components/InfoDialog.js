import React from 'react';
import { styled } from '@mui/material/styles';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import InfoIcon from '@mui/icons-material/Info';
import Typography from '@mui/material/Typography';
import Snackbar from '@mui/material/Snackbar';
import '../styles/InfoDialog.css'
import { textStyles } from '../styles/textStyles';

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
    '& .MuiDialogContent-root': {
      padding: '16px 48px 48px 48px',
    },
    '& .MuiDialogActions-root': {
      padding: theme.spacing(1),
    },
  }));

export default function InfoDialog({ setOpen, open }) {

  const [ toastOpen, setToastOpen ] = React.useState(false);

  function handleClose() {
    setOpen(false);
  }

  function closeToast() {
    setToastOpen(false);
  }

  function copyEmail() {
    navigator.clipboard.writeText("kevindouglasdang@gmail.com");
    setToastOpen(true);
  }

  function openInNewTab(url) {
    const newWindow = window.open(url, '_blank', 'noopener,noreferrer')
    if (newWindow) newWindow.opener = null
}

  return (
    <React.Fragment>
      <BootstrapDialog
        onClose={handleClose}
        aria-labelledby="customized-dialog-title"
        open={open}
      >
        <DialogTitle
          sx={{ 
            m: 0,
            p: 2,
            backgroundColor: '#2f2f2f',
            ...textStyles.text,
            padding: '48px 48px 16px 48px'
          }}
        >
          <div className='title-container'>
            <InfoIcon fontSize="large" />
            <h1 className='title'>About</h1>
          </div>
        </DialogTitle>
        <IconButton
          aria-label="close"
          onClick={handleClose}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: 'white',
            '&:hover': {
                backgroundColor: 'gray',
            },
          }}
        >
          <CloseIcon />
        </IconButton>
        <DialogContent dividers sx={{ backgroundColor: '#2f2f2f', ...textStyles.text, }}>
          <Typography gutterBottom>
            It uses the Steam API to search for the list of games, and fetch the
            description and recent reviews. The recent reviews are fed to OpenAI
            using the GPT-3.5-turbo model to process and generate a summary of the reviews.
          </Typography>
          <Typography gutterBottom>
            Please note that AI is not perfect at summarizing reviews, for example there are risks of AI <u className='link' onClick={() => openInNewTab("https://www.ibm.com/topics/ai-hallucinations")}>hallucinations</u>.
          </Typography>
          <Typography gutterBottom>
            If you have any comments or suggestions, please email me at <u className='link' onClick={copyEmail}>kevindouglasdang@gmail.com</u>
          </Typography>
        </DialogContent>
      </BootstrapDialog>
      <Snackbar
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        autoHideDuration={2000}
        open={toastOpen}
        onClose={closeToast}
        message="Email copied to clipboard"
      />
    </React.Fragment>
  );
}
