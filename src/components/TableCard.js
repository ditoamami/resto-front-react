import React from 'react';
import { Card, CardContent, Typography, Box } from '@mui/material';

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

  const getBackgroundColor = () => {
    switch (status) {
      case 'available': return 'success.light';
      case 'occupied': return 'error.light';
      case 'reserved': return 'warning.light';
      case 'inactive': return 'grey.200';
      default: return 'background.paper';
    }
  };

  return (
    <Card
      sx={{
        textAlign: 'center',
        p: 2,
        borderRadius: 3,
        boxShadow: 3,
        cursor: status === 'inactive' ? 'not-allowed' : 'pointer',
        opacity: status === 'inactive' ? 0.6 : 1,
        backgroundColor: getBackgroundColor(),
        border: `2px solid ${getStatusColor()}`,
        transition: 'all 0.2s ease-in-out',
        '&:hover': {
          boxShadow: 6,
          transform: status !== 'inactive' ? 'scale(1.03)' : 'none',
        },
      }}
      onClick={status !== 'inactive' ? onClick : undefined}
    >
      <CardContent>
        {/* Badge kecil di atas */}
        <Box
          sx={{
            width: 14,
            height: 14,
            borderRadius: '50%',
            backgroundColor: getStatusColor(),
            mx: 'auto',
            mb: 1.5,
          }}
        />
        <Typography
          variant="h6"
          sx={{ fontWeight: 700, color: 'text.primary', mb: 0.5 }}
        >
          {name}
        </Typography>
        <Typography
          variant="subtitle1"
          sx={{
            fontWeight: 600,
            color: 'text.primary',
            mb: 0.75,
            fontSize: '1rem',
          }}
        >
          {status ? status.charAt(0).toUpperCase() + status.slice(1) : 'Unknown'}
        </Typography>
        <Typography
          variant="body2"
          sx={{ color: 'text.secondary', fontSize: '0.95rem' }}
        >
          Capacity: {capacity}
        </Typography>
      </CardContent>
    </Card>
  );
}
