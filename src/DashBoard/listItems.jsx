import * as React from 'react';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import ListSubheader from '@mui/material/ListSubheader';
import PeopleIcon from '@mui/icons-material/People';
import RoomTwoToneIcon from '@mui/icons-material/RoomTwoTone';
import HowToRegTwoToneIcon from '@mui/icons-material/HowToRegTwoTone';
import PinDropIcon from '@mui/icons-material/PinDrop';

export const mainListItems = (handleSidebarItemClick) => (
  <React.Fragment>
    <ListSubheader component="div" inset style={{  color: '#1565c0' }}>
      Employees
    </ListSubheader>
    <ListItemButton onClick={() => handleSidebarItemClick('table')}>
      <ListItemIcon>
        <PeopleIcon style={{  color: '#1565c0' }}/>
      </ListItemIcon>
      <ListItemText primary="Knockers" />
    </ListItemButton>
  </React.Fragment>
);

export const secondaryListItems = (handleSidebarItemClick) => (
  <React.Fragment>
    <ListSubheader component="div" inset style={{  color: '#1565c0' }}>
      Registration
    </ListSubheader>
    <ListItemButton onClick={() => handleSidebarItemClick('pre-registration')}>
      <ListItemIcon>
        <HowToRegTwoToneIcon style={{  color: '#1565c0' }}/>
      </ListItemIcon>
      <ListItemText primary="Pre Registration" />
    </ListItemButton>
  </React.Fragment>
);

export const thirdListItems = (handleSidebarItemClick) => (
  <React.Fragment>
    <ListSubheader component="div" inset style={{  color: '#1565c0' }}>
      Location
    </ListSubheader>
    <ListItemButton onClick={() => handleSidebarItemClick('area')}>
      <ListItemIcon>
        <RoomTwoToneIcon style={{  color: '#1565c0' }} />
      </ListItemIcon>
      <ListItemText primary="Area" />
    </ListItemButton>
  </React.Fragment>
);

export const fourthListItems = (handleSidebarItemClick) => (
  <React.Fragment>
    <ListSubheader component="div" inset style={{  color: '#1565c0' }}>
      Pins
    </ListSubheader>
    <ListItemButton onClick={() => handleSidebarItemClick('pins')}>
      <ListItemIcon>
        <PinDropIcon style={{  color: '#1565c0' }}/>
      </ListItemIcon>
      <ListItemText primary="Pins" />
    </ListItemButton>
  </React.Fragment>
);
