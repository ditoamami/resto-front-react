import React, { useContext } from 'react';
import { AppBar, Toolbar, Typography, Button } from '@mui/material';
import { AuthContext } from '../../context/AuthContext';

export default function Header(){
  const { user, logout } = useContext(AuthContext);

  return (
    <AppBar position="static" color="transparent" elevation={0} sx={{ mb:2 }}>
      <Toolbar sx={{ justifyContent: 'space-between' }}>
        <Typography variant="h6">RestaurantPOS</Typography>
        <div>
          {user ? (
            <>
              <Typography component="span" sx={{ mr:2 }}>{user.name || user.email}</Typography>
              <Button variant="outlined" onClick={logout}>Logout</Button>
            </>
          ) : (
            <Button variant="contained" href="/login">Login</Button>
          )}
        </div>
      </Toolbar>
    </AppBar>
  );
}
