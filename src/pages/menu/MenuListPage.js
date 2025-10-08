import React from 'react';
import { Container, Typography } from '@mui/material';

export default function MenuListPage(){
  return (
    <Container sx={{ mt:4 }}>
      <Typography variant="h6">Menu — List (skeleton)</Typography>
      <Typography color="text.secondary">Implement CRUD with API endpoints /menus</Typography>
    </Container>
  );
}
