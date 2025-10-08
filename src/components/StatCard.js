import React from 'react';
import { Paper, Typography } from '@mui/material';

export default function StatCard({ label, value }){
  return (
    <Paper sx={{ p:2, mb:1 }}>
      <Typography variant="h5" fontWeight={700}>{value}</Typography>
      <Typography variant="body2" color="text.secondary">{label}</Typography>
    </Paper>
  );
}
