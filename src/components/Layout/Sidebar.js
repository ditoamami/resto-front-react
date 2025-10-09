import React, { useContext } from 'react';
import { Drawer, List, ListItemButton, ListItemText } from '@mui/material';
import { AuthContext } from '../../context/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';

export default function Sidebar() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation(); // untuk mengetahui path sekarang

  const menuItems = [
    { label: 'Dashboard', path: '/dashboard' },
    ...(user?.role === 'pelayan' ? [{ label: 'Menu', path: '/menus' }] : []),
    { label: 'Orders', path: '/orders' },
  ];

  return (
    <Drawer
      variant="permanent"
      anchor="left"
      sx={{
        '& .MuiDrawer-paper': {
          width: 220,
          boxSizing: 'border-box',
          top: 64,
          backgroundColor: 'background.paper',
          borderRight: '1px solid',
          borderColor: 'divider',
        },
      }}
    >
      <List>
        {menuItems.map((item) => {
          const selected = location.pathname === item.path;
          return (
            <ListItemButton
              key={item.path}
              selected={selected}
              onClick={() => navigate(item.path)}
              sx={{
                mb: 0.5,
                borderRadius: 1,
                '&.Mui-selected': {
                  backgroundColor: 'primary.main',
                  color: 'primary.contrastText',
                  '&:hover': {
                    backgroundColor: 'primary.dark',
                  },
                },
                '&:hover': {
                  backgroundColor: selected ? 'primary.dark' : 'grey.100',
                },
              }}
            >
              <ListItemText
                primary={item.label}
                primaryTypographyProps={{
                  fontWeight: selected ? 700 : 500,
                }}
              />
            </ListItemButton>
          );
        })}
      </List>
    </Drawer>
  );
}
