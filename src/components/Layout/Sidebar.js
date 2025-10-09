import React, { useContext } from 'react';
import { Drawer, List, ListItemButton, ListItemText } from '@mui/material';
import { AuthContext } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function Sidebar(){
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  return (
    <Drawer variant="permanent" anchor="left" sx={{
      '& .MuiDrawer-paper': { width: 220, boxSizing: 'border-box', top:64 }
    }}>
      <List>
        <ListItemButton onClick={() => navigate('/')}>
          <ListItemText primary="Dashboard" />
        </ListItemButton>

        {user?.role === 'pelayan' && (
          <>
            <ListItemButton onClick={() => navigate('/menus')}>
              <ListItemText primary="Menu" />
            </ListItemButton>
          </>
        )}

        
        <ListItemButton onClick={() => navigate('/orders')}>
          <ListItemText primary="Orders" />
        </ListItemButton>

      </List>
    </Drawer>
  );
}
