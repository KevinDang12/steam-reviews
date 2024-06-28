import React, { useState } from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import Snackbar from '@mui/material/Snackbar';
import { textStyles } from '../styles/textStyles';

export default function CountrySelect({ country, setCountry, setOpen, open, countries }) {

  const [ currentCountry, setCurrentCountry ] = useState(findCountry(country));
  const [ toastOpen, setToastOpen ] = useState(false);

  function handleClose() {
    setOpen(false);
  }

  function closeToast() {
    setToastOpen(false);
  }

  function saveCountry() {
    if (currentCountry === null) {
      setToastOpen(true);
    } else {
      setCountry(currentCountry.code.toLowerCase());
      setOpen(false);
    }
  }

  function findCountry(code) {
    return countries.find(country => country.code.toLowerCase() === code);
  }

  function handleCountryChange(_, value) {
    setCurrentCountry(value);
  }

  return (
    <React.Fragment>
      <Dialog open={open}>
        <DialogTitle backgroundColor='#2f2f2f' color='white' sx={{ padding: '50px' }}>Select a Country</DialogTitle>
        <DialogContent
          sx={{
            backgroundColor: '#2f2f2f',
            padding: '50px',
            ...textStyles.text,
          }}>
          <Autocomplete
            sx={{
              width: 250,
              margin: '10px',
              ...textStyles.text,
              '& .MuiOutlinedInput-root': {
                '&:hover .MuiOutlinedInput-notchedOutline': {
                  borderColor: 'gray',
                },
                '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                  borderColor: 'white',
                }
              },
              '& .MuiOutlinedInput-input': {
                color: 'white',
              },
              '& .MuiOutlinedInput-notchedOutline': {
                borderColor: 'white',
                '&:hover': {
                  borderColor: 'blue',
                },
              },
              '& .MuiAutocomplete-clearIndicator, & .MuiAutocomplete-popupIndicator': {
                color: 'white',
              },
              '& .MuiAutocomplete-inputRoot': {
                backgroundColor: 'transparent',
              },
            }}
            value={currentCountry}
            onChange={handleCountryChange}
            options={countries}
            autoHighlight
            getOptionLabel={(option) => option.name}
            defaultValue={findCountry(country)}
            renderOption={(props, option) => (
              <Box component="li" sx={{ '& > img': { mr: 2, flexShrink: 0 }, fontFamily: 'Inter, sans-serif' }} {...props}>
                <img
                  loading="lazy"
                  width="20"
                  srcSet={`https://flagcdn.com/w40/${option.code.toLowerCase()}.png 2x`}
                  src={`https://flagcdn.com/w20/${option.code.toLowerCase()}.png`}
                  alt=""
                />
                {option.name} ({option.code})
              </Box>
            )}
            renderInput={(params) => (
              <TextField
              sx={{
                '&:hover': {
                  borderColor: 'blue',
                },
              }}
                {...params}
                label="Choose a country"
                InputLabelProps={{
                  style: { color: 'white' }
                }}
                inputProps={{
                  ...params.inputProps,
                  autoComplete: 'new-password',
                }}
              />
            )}
          />
        </DialogContent>
        <DialogActions
          sx={{
            backgroundColor: '#2f2f2f',
            padding: '20px',
          }}
        >
          <Button
            onClick={handleClose}
            sx={{
              ...textStyles.text,
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={saveCountry}
            sx={{
              ...textStyles.text,
            }}
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>
      <Snackbar
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        autoHideDuration={5000}
        open={toastOpen}
        onClose={closeToast}
        message="Please select a country before saving."
      />
    </React.Fragment>
  );
}
