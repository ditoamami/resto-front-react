import React, { useEffect, useState } from 'react';
import { Box, Grid, Container, TextField, Button, Typography, CircularProgress } from '@mui/material';
import TableCard from '../../components/TableCard';
import StatCard from '../../components/StatCard';
import axiosPrivate from '../../api/axiosPrivate';
import OrderDialog from '../../components/OrderDialog';

export default function DashboardPage() {
  const [tables, setTables] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedTable, setSelectedTable] = useState(null);

  const fetchTables = async () => {
    try {
      const res = await axiosPrivate.get('/tables');
      setTables(res.data);
    } catch (err) {
      console.error('Error fetching tables:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTables();
  }, []);

  const handleOpenOrder = (table) => {
    setSelectedTable(table);
  };

  const handleCloseOrder = async (refresh = false) => {
    setSelectedTable(null);
    if (refresh) await fetchTables();
  };

  const filteredTables = tables.filter(t =>
    t.name.toLowerCase().includes(search.toLowerCase())
  );

  const countBy = (status) => tables.filter(t => t.status === status).length;

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h5">Dashboard / Table List</Typography>
      </Box>

      <Grid container spacing={2}>
        <Grid item xs={12} md={9}>
          <Box sx={{ mb: 2 }}>
            <TextField
              placeholder="Search table..."
              size="small"
              fullWidth
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </Box>

          {loading ? (
            <Box sx={{ textAlign: 'center', mt: 4 }}>
              <CircularProgress />
            </Box>
          ) : (
            <Grid container spacing={2}>
              {filteredTables.map((t) => (
                <Grid item xs={6} sm={4} md={2.4} key={t.id}>
                  <TableCard
                    name={t.name}
                    status={t.status}
                    capacity={t.capacity}
                    onClick={() => handleOpenOrder(t)}
                  />
                </Grid>
              ))}
            </Grid>
          )}
        </Grid>

        <Grid item xs={12} md={3}>
          <StatCard label="Available Tables" value={countBy('available')} />
          <StatCard label="Occupied Tables" value={countBy('occupied')} />
          <StatCard label="Reserved Tables" value={countBy('reserved')} />
          <StatCard label="Inactive Tables" value={countBy('inactive')} />
        </Grid>
      </Grid>

      {selectedTable && (
        <OrderDialog
          open={!!selectedTable}
          table={selectedTable}
          onClose={handleCloseOrder}
        />
      )}
    </Container>
  );
}
