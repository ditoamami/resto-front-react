import React from 'react';
import { Card, CardContent, Typography } from '@mui/material';

export default function TableCard({ id, status, onClick }){
  const colorMap = {
    available: '#16a34a',
    occupied: '#dc2626',
    reserved: '#f59e0b',
    inactive: '#6b7280'
  };
  const bg = colorMap[status] || '#94a3b8';

  return (
    <Card onClick={()=>onClick && onClick(id)} sx={{ bgcolor: bg, color:'#fff', cursor:'pointer' }}>
      <CardContent sx={{ textAlign:'center', py:4 }}>
        <Typography variant="h5" component="div" fontWeight={700}>Table {id}</Typography>
        <Typography variant="body2" sx={{ opacity:0.9 }}>{status}</Typography>
      </CardContent>
    </Card>
  );
}
