import React from 'react';
import { Container, Typography } from '@mui/material';

export default function PaymentPage(){
  return (
    <Container sx={{ mt:4 }}>
      <Typography variant="h6">Payment (skeleton)</Typography>
      <Typography color="text.secondary">Implement payment processing and receipt.</Typography>
    </Container>
  );
}
