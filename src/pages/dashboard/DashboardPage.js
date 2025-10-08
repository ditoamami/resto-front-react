import React, { useEffect, useState } from 'react';
import { Box, Grid, Container, TextField, Button, Typography } from '@mui/material';
import TableCard from '../../components/TableCard';
import StatCard from '../../components/StatCard';
import axiosClient from '../../api/axiosClient';

export default function DashboardPage(){
  const [tables, setTables] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(()=>{
    const fetch = async ()=>{
      try {
        const res = await axiosClient.get('/tables');
        // expect res.data to be array of {id, status}
        setTables(res.data);
      } catch (err) {
        // fallback sample
        setTables(Array.from({length:24}, (_,i)=>({id:i+1, status:['available','occupied','reserved','inactive'][Math.floor(Math.random()*4)]})));
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  const countBy = (status) => tables.filter(t=>t.status===status).length;

  return (
    <Container maxWidth="lg" sx={{ mt:4 }}>
      <Box sx={{ display:'flex', justifyContent:'space-between', alignItems:'center', mb:2 }}>
        <Typography variant="h5">Dashboard / Table List</Typography>
        <Box sx={{ display:'flex', gap:1 }}>
          <Button variant="outlined">Floor Plan</Button>
          <Button variant="outlined">List View</Button>
        </Box>
      </Box>

      <Grid container spacing={2}>
        <Grid item xs={12} md={9}>
          <Box sx={{ mb:2 }}>
            <TextField placeholder="Search table..." size="small" fullWidth />
          </Box>
          <Grid container spacing={2}>
            {tables.map(t => (
              <Grid item xs={6} sm={4} md={2} key={t.id}>
                <TableCard id={t.id} status={t.status} />
              </Grid>
            ))}
          </Grid>
        </Grid>

        <Grid item xs={12} md={3}>
          <StatCard label="Available Tables" value={countBy('available')} />
          <StatCard label="Occupied Tables" value={countBy('occupied')} />
          <StatCard label="Reserved Tables" value={countBy('reserved')} />
          <StatCard label="Inactive Tables" value={countBy('inactive')} />
        </Grid>
      </Grid>
    </Container>
  );
}
