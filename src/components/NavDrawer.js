import * as React from 'react';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import InfoIcon from '@mui/icons-material/Info';

export default function NavDrawer({ country, setInfoOpen, handleCountryDialog }) {
  const [open, setOpen] = React.useState(false);

  const toggleDrawer = (newOpen) => () => {
    setOpen(newOpen);
  };

  function openCountryDialog() {
    handleCountryDialog(true);
    setOpen(false);
  }

  function openInfoDialog() {
    setInfoOpen(true);
    setOpen(false);
  }

  const DrawerList = (
    <Box sx={{ width: 250 }} role="presentation">
      <List>
        <ListItem disablePadding onClick={openInfoDialog}>
            <ListItemButton>
              <ListItemIcon>
                <InfoIcon 
                    fontSize="small"
                    sx={{
                        color: 'white',
                        '&:hover': {
                          backgroundColor: 'darkgray',
                        },
                        height: '30px',
                        width: '30px',
                    }}
                    />
              </ListItemIcon>
              <ListItemText primary={'About'} />
            </ListItemButton>
          </ListItem>
        <ListItem disablePadding onClick={openCountryDialog}>
            <ListItemButton>
              <ListItemIcon>
                <img
                    loading="lazy"
                    width="30"
                    srcSet={`https://flagcdn.com/w40/${country}.png 2x`}
                    src={`https://flagcdn.com/w20/${country}.png`}
                    alt=""
                    />
              </ListItemIcon>
              <ListItemText primary={'Select a Country'} />
            </ListItemButton>
          </ListItem>
      </List>
    </Box>
  );

  return (
    <div>
      <button
        className="mobile-button"
        onClick={toggleDrawer(true)}
      >
        ☰
      </button>
      <Drawer
        open={open}
        onClose={toggleDrawer(false)}
        sx={{ 
            '& .MuiDrawer-paper': {
            backgroundColor: '#2f2f2f',
            color: 'white'
            }
        }}
      >
        {DrawerList}
      </Drawer>
    </div>
  );
}
