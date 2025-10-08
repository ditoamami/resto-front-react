import React from 'react';
import { Container, Typography } from '@mui/material';

export default function NotFound(){
  return (
    <Container sx={{ mt:8, textAlign:'center' }}>
      <Typography variant="h2">404</Typography>
      <Typography>Page not found</Typography>
    </Container>
  );
}
