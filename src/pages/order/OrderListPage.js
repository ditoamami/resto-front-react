import React from 'react';
import { Container, Typography } from '@mui/material';

export default function OrderListPage(){
  return (
    <Container sx={{ mt:4 }}>
      <Typography variant="h6">Orders — List (skeleton)</Typography>
      <Typography color="text.secondary">Implement orders listing, open order, and detail.</Typography>
    </Container>
  );
}
