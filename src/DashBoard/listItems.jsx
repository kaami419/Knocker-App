import * as React from 'react';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import ListSubheader from '@mui/material/ListSubheader';
import PeopleIcon from '@mui/icons-material/People';
import RoomTwoToneIcon from '@mui/icons-material/RoomTwoTone';
import HowToRegTwoToneIcon from '@mui/icons-material/HowToRegTwoTone';
import PinDropIcon from '@mui/icons-material/PinDrop';
import PersonPinCircleOutlinedIcon from '@mui/icons-material/PersonPinCircleOutlined';
import GpsFixedIcon from '@mui/icons-material/GpsFixed';

export const MainListItems = ({handleSidebarItemClick}) => (
  <React.Fragment>
    <ListSubheader component="div" inset style={{  color: '#1565c0' }}>
      Employees
    </ListSubheader>
    <ListItemButton onClick={() => handleSidebarItemClick('knockerTable')}>
      <ListItemIcon>
        <PeopleIcon style={{  color: '#1565c0' }}/>
      </ListItemIcon>
      <ListItemText primary="Knockers" />
    </ListItemButton>
  </React.Fragment>
);

export const SecondaryListItems = ({handleSidebarItemClick}) => (
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

export const ThirdListItems = ({handleSidebarItemClick}) => (
  <React.Fragment>
    <ListSubheader component="div" inset style={{  color: '#1565c0' }}>
      Location
    </ListSubheader>
    <ListItemButton onClick={() => handleSidebarItemClick('area')}>
      <ListItemIcon>
        <GpsFixedIcon style={{  color: '#1565c0' }} />
      </ListItemIcon>
      <ListItemText primary="Area" />
    </ListItemButton>
  </React.Fragment>
);

export const FourthListItems = ({handleSidebarItemClick}) => (
  <React.Fragment>
    <ListSubheader component="div" inset style={{  color: '#1565c0' }}>
      Pins
    </ListSubheader>
    <ListItemButton onClick={() => handleSidebarItemClick('pins')}>
      <ListItemIcon>
        <RoomTwoToneIcon style={{  color: '#1565c0' }}/>
      </ListItemIcon>
      <ListItemText primary="Pins" />
    </ListItemButton>
  </React.Fragment>
);

export const FifthListItems = ({handleSidebarItemClick}) => (
  <React.Fragment>
    <ListSubheader component="div" inset style={{  color: '#1565c0' }}>
      Area Assigning
    </ListSubheader>
    <ListItemButton onClick={() => handleSidebarItemClick('assignArea')}>
      <ListItemIcon>
        <PersonPinCircleOutlinedIcon style={{  color: '#1565c0' }}/>
      </ListItemIcon>
      <ListItemText primary="Assign" />
    </ListItemButton>
  </React.Fragment>
);

export const SixthListItems = ({handleSidebarItemClick}) => (
  <React.Fragment>
    <ListSubheader component="div" inset style={{  color: '#1565c0' }}>
      Pins By Knockers
    </ListSubheader>
    <ListItemButton onClick={() => handleSidebarItemClick('DroppedPins')}>
      <ListItemIcon>
        <PinDropIcon   style={{  color: '#1565c0' }}/>
      </ListItemIcon>
      <ListItemText primary="Dropped Pins" />
    </ListItemButton>
  </React.Fragment>
);
