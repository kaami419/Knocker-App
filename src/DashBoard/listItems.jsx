import * as React from 'react';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import ListSubheader from '@mui/material/ListSubheader';
import PeopleIcon from '@mui/icons-material/People';
// import BarChartIcon from '@mui/icons-material/BarChart';
import RoomTwoToneIcon from '@mui/icons-material/RoomTwoTone';
import HowToRegTwoToneIcon from '@mui/icons-material/HowToRegTwoTone';


export const mainListItems = (
  
  <React.Fragment>
  <ListSubheader component="div" inset>
    Employees
  </ListSubheader>
    <ListItemButton>
      <ListItemIcon>
        <PeopleIcon />
      </ListItemIcon>
      <ListItemText primary="Knockers" />
    </ListItemButton>
   </React.Fragment>
);

export const secondaryListItems = (
  <React.Fragment>
    <ListSubheader component="div" inset>
      Registration
    </ListSubheader>
    <ListItemButton>
      <ListItemIcon>
        <HowToRegTwoToneIcon />
      </ListItemIcon>
      <ListItemText primary="Pre Registration" />
    </ListItemButton>

  </React.Fragment>
);

export const thirdListItems = (
    <React.Fragment>
      <ListSubheader component="div" inset>
        Location
      </ListSubheader>
      <ListItemButton>
      <ListItemIcon>
        <RoomTwoToneIcon />
      </ListItemIcon>
      <ListItemText primary="Area" />
    </ListItemButton>
  
    </React.Fragment>
  );