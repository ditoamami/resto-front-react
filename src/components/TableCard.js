import React from 'react';
import { Card, CardContent, Typography } from '@mui/material';

export default function TableCard({ name, status, capacity, onClick }) {
  const getStatusColor = () => {
    switch (status) {
      case 'available': return 'success.main';
      case 'occupied': return 'error.main';
      case 'reserved': return 'warning.main';
      case 'inactive': return 'text.disabled';
      default: return 'text.primary';
    }
  };

  return (
    <Card
      sx={{
        textAlign: 'center',
        p: 1.5,
        borderRadius: 2,
        boxShadow: 2,
        cursor: status === 'inactive' ? 'not-allowed' : 'pointer',
        opacity: status === 'inactive' ? 0.6 : 1,
        '&:hover': { boxShadow: 4 },
      }}
      onClick={status !== 'inactive' ? onClick : undefined}
    >
      <CardContent>
        <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
          {name}
        </Typography>
        <Typography variant="body2" color={getStatusColor()} sx={{ mb: 0.5 }}>
          {status.charAt(0).toUpperCase() + status.slice(1)}
        </Typography>
        <Typography variant="caption" color="text.secondary">
          Capacity: {capacity}
        </Typography>
      </CardContent>
    </Card>
  );
}
