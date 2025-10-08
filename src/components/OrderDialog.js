import React, { useEffect, useState } from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  Button, TextField, MenuItem, Typography, Box, IconButton
} from '@mui/material';
import { Add, Delete } from '@mui/icons-material';
import axiosPrivate from '../api/axiosPrivate';

export default function OrderDialog({ open, table, onClose }) {
  const [menus, setMenus] = useState([]);
  const [items, setItems] = useState([{ menu_id: '', quantity: 1 }]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchMenus = async () => {
      try {
        const res = await axiosPrivate.get('/menus');
        setMenus(res.data);
      } catch (err) {
        console.error('Error fetching menus:', err);
      }
    };
    if (open) fetchMenus();
  }, [open]);

  const handleAddItem = () => setItems([...items, { menu_id: '', quantity: 1 }]);
  const handleRemoveItem = (index) => setItems(items.filter((_, i) => i !== index));

  const handleChange = (index, field, value) => {
    const updated = [...items];
    updated[index][field] = value;
    setItems(updated);
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);

      // Step 1: buka order untuk meja
      const openRes = await axiosPrivate.post('/orders/open', {
        table_id: table.id,
      });
      const orderId = openRes.data?.id;

      // Step 2: tambahkan semua item ke order
      for (const item of items.filter(i => i.menu_id && i.quantity > 0)) {
        await axiosPrivate.post('/orders/add', {
          order_id: orderId,
          menu_id: item.menu_id,
          quantity: item.quantity,
        });
      }

      // Step 3: ubah status meja ke occupied
      await axiosPrivate.put(`/tables/${table.id}`, { status: 'occupied' });

      onClose(true);
    } catch (err) {
      console.error('Error creating order:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={() => onClose(false)} maxWidth="sm" fullWidth>
      <DialogTitle>Create Order — {table.name}</DialogTitle>
      <DialogContent>
        <Typography variant="body2" sx={{ mb: 2 }}>
          Select menu items for this table.
        </Typography>

        {items.map((item, i) => (
          <Box key={i} sx={{ display: 'flex', alignItems: 'center', mb: 1, gap: 1 }}>
            <TextField
              select
              label="Menu"
              value={item.menu_id}
              onChange={(e) => handleChange(i, 'menu_id', e.target.value)}
              fullWidth
              size="small"
            >
              {menus.map((m) => (
                <MenuItem key={m.id} value={m.id}>
                  {m.name}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              type="number"
              label="Qty"
              value={item.quantity}
              onChange={(e) => handleChange(i, 'quantity', Number(e.target.value))}
              sx={{ width: 100 }}
              size="small"
              inputProps={{ min: 1 }}
            />
            <IconButton onClick={() => handleRemoveItem(i)} color="error">
              <Delete />
            </IconButton>
          </Box>
        ))}

        <Button startIcon={<Add />} onClick={handleAddItem}>
          Add Item
        </Button>
      </DialogContent>

      <DialogActions>
        <Button onClick={() => onClose(false)}>Cancel</Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          disabled={loading || items.every(i => !i.menu_id)}
        >
          {loading ? 'Saving...' : 'OK'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
