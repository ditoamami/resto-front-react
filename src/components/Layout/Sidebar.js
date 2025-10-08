import React from 'react';
import { Drawer, List, ListItemButton, ListItemText } from '@mui/material';

export default function Sidebar(){
  return (
    <Drawer variant="permanent" anchor="left" sx={{
      '& .MuiDrawer-paper': { width: 220, boxSizing: 'border-box', top:64 }
    }}>
      <List>
        <ListItemButton component="a" href="/"><ListItemText primary="Dashboard" /></ListItemButton>
        <ListItemButton component="a" href="/menus"><ListItemText primary="Menu" /></ListItemButton>
        <ListItemButton component="a" href="/orders"><ListItemText primary="Orders" /></ListItemButton>
        <ListItemButton component="a" href="/payments"><ListItemText primary="Payments" /></ListItemButton>
      </List>
    </Drawer>
  );
}
