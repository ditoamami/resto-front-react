import React, { useEffect, useState, useMemo, useCallback } from 'react';
import {
  Box,
  Grid,
  Container,
  TextField,
  Typography,
  CircularProgress,
} from '@mui/material';
import TableCard from '../../components/TableCard';
import StatCard from '../../components/StatCard';
import axiosPrivate from '../../api/axiosPrivate';
import OrderDialog from '../../components/OrderDialog';

import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";

export default function DashboardPage() {
  const [tables, setTables] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedTable, setSelectedTable] = useState(null);
  const [error, setError] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const { user } = useContext(AuthContext);

  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsLoggedIn(!!token);
  }, []);

  const fetchTables = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const res = await axiosPrivate.get('/tables');
      setTables(res.data);
    } catch (err) {
      console.error('Error fetching tables:', err);
      setError('Failed to load tables. Please try again.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTables();
  }, [fetchTables]);

  const handleOpenTable = (table) => {
    if (!isLoggedIn) {
      return;
    }

    if(user?.role !== "pelayan"){
      return;
    }

    setSelectedTable(table);
  };

  const handleCloseDialog = async (refresh = false) => {
    setSelectedTable(null);
    if (refresh) await fetchTables();
  };

  const filteredTables = useMemo(() => {
    return tables.filter((t) =>
      t.name.toLowerCase().includes(search.toLowerCase())
    );
  }, [tables, search]);

  const stats = useMemo(() => ({
    available: tables.filter((t) => t.status === 'available').length,
    occupied: tables.filter((t) => t.status === 'occupied').length,
    reserved: tables.filter((t) => t.status === 'reserved').length,
    inactive: tables.filter((t) => t.status === 'inactive').length,
  }), [tables]);

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
        <Typography variant="h5" fontWeight="bold">
          Dashboard / Table List
        </Typography>
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
          ) : error ? (
            <Typography color="error" sx={{ mt: 4, textAlign: 'center' }}>
              {error}
            </Typography>
          ) : filteredTables.length === 0 ? (
            <Typography sx={{ mt: 4, textAlign: 'center' }}>
              No tables found.
            </Typography>
          ) : (
            <Grid container spacing={2}>
              {filteredTables.map((t) => (
                <Grid item xs={6} sm={4} md={2.4} key={t.id}>
                  <TableCard
                    name={t.name}
                    status={t.status}
                    capacity={t.capacity}
                    onClick={() => handleOpenTable(t)}
                    disabled={!isLoggedIn || t.status === 'inactive'}
                  />
                </Grid>
              ))}
            </Grid>
          )}
        </Grid>

        <Grid item xs={12} md={3}>
          <StatCard label="Available Tables" value={stats.available} />
          <StatCard label="Occupied Tables" value={stats.occupied} />
          <StatCard label="Reserved Tables" value={stats.reserved} />
          <StatCard label="Inactive Tables" value={stats.inactive} />
        </Grid>
      </Grid>

      {selectedTable && (
        <OrderDialog
          open={!!selectedTable}
          table={selectedTable}
          onClose={handleCloseDialog}
        />
      )}
    </Container>
  );
}
