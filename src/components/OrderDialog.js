import React, { useEffect, useState, useCallback } from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  Button, TextField, MenuItem, Typography, Box, IconButton,
  Divider, CircularProgress, List, ListItem, ListItemText
} from '@mui/material';
import { Add, Delete } from '@mui/icons-material';
import axiosPrivate from '../api/axiosPrivate';

export default function OrderDialog({ open, table, onClose }) {
  const [menus, setMenus] = useState([]);
  const [items, setItems] = useState([{ menu_id: '', quantity: 1 }]);
  const [loading, setLoading] = useState(false);
  const [existingOrder, setExistingOrder] = useState(null);
  const [mode, setMode] = useState('create'); // "create" | "manage"

  /** 🔹 Fetch menu hanya saat dialog dibuka */
  useEffect(() => {
    const fetchMenus = async () => {
      try {
        const res = await axiosPrivate.get('/menus');
        setMenus(res.data);
      } catch (err) {
        console.error('Error fetching menus:', err);
      }
    };

    if (open) {
      fetchMenus();
      setMode(table.status === 'occupied' ? 'manage' : 'create');
    }
  }, [open, table]);

  /** 🔹 Jika meja occupied, fetch pesanan aktif */
  useEffect(() => {
    const fetchExistingOrder = async () => {
      if (mode === 'manage' && table.current_order?.id) {
        try {
          const res = await axiosPrivate.get(`/orders/${table.current_order?.id}`);
          setExistingOrder(res.data);
        } catch (err) {
          console.error('Error fetching existing order:', err);
        }
      } else {
        setExistingOrder(null);
      }
    };
    fetchExistingOrder();
  }, [mode, table]);

  /** 🔹 Utility handlers */
  const handleAddItem = () => setItems([...items, { menu_id: '', quantity: 1 }]);
  const handleRemoveItem = (index) => setItems(items.filter((_, i) => i !== index));
  const handleChange = (index, field, value) => {
    setItems((prev) =>
      prev.map((item, i) => (i === index ? { ...item, [field]: value } : item))
    );
  };

  /** 🔹 Tambahkan item ke order */
  const addItemsToOrder = useCallback(async (orderId) => {
    const validItems = items.filter(i => i.menu_id && i.quantity > 0);
    for (const item of validItems) {
      await axiosPrivate.post('/orders/add', {
        order_id: orderId,
        menu_id: item.menu_id,
        quantity: item.quantity,
      });
    }
  }, [items]);

  /** 🔹 Buat order baru */
  const handleCreateOrder = async () => {
    try {
      setLoading(true);
      const openRes = await axiosPrivate.post('/orders/open', { table_id: table.id });
      const orderId = openRes.data?.id;
      await addItemsToOrder(orderId);
      await axiosPrivate.put(`/tables/${table.id}`, { status: 'occupied' });
      onClose(true);
    } catch (err) {
      console.error('Error creating order:', err);
      alert('Gagal membuat pesanan.');
    } finally {
      setLoading(false);
    }
  };

  /** 🔹 Tambah item ke order yang sudah ada */
  const handleAddToExistingOrder = async () => {
    try {
      setLoading(true);
      const orderId = table.current_order?.id;
      if (!orderId) {
        alert('Order aktif tidak ditemukan untuk meja ini.');
        return;
      }
      await addItemsToOrder(orderId);
      alert('Item berhasil ditambahkan.');
      onClose(true);
    } catch (err) {
      console.error('Error adding to order:', err);
      alert('Gagal menambah pesanan.');
    } finally {
      setLoading(false);
    }
  };

  /** 🔹 Tutup pesanan */
  const handleCloseOrder = async () => {
    try {
      setLoading(true);
      await axiosPrivate.post('/orders/close', { order_id: table.current_order?.id });
      await axiosPrivate.put(`/tables/${table.id}`, { status: 'available' });
      alert('Pesanan ditutup.');
      onClose(true);
    } catch (err) {
      console.error('Error closing order:', err);
      alert('Gagal menutup pesanan.');
    } finally {
      setLoading(false);
    }
  };

  const disabledOk = items.every(i => !i.menu_id);

  /** 🔹 Render UI */
  return (
    <Dialog open={open} onClose={() => onClose(false)} maxWidth="sm" fullWidth>
      <DialogTitle>
        {mode === 'create' ? `Buka Pesanan — ${table.name}` : `Kelola Pesanan — ${table.name}`}
      </DialogTitle>

      <DialogContent>
        {loading && !existingOrder ? (
          <Box sx={{ textAlign: 'center', my: 4 }}>
            <CircularProgress />
          </Box>
        ) : (
          <>
            {/* === Pesanan Aktif (Mode Manage) === */}
            {mode === 'manage' && existingOrder && (
              <>
                <Typography variant="h6" sx={{ mb: 1.5 }}>
                  Pesanan Aktif
                </Typography>

                <List
                  dense
                  sx={{
                    mb: 2,
                    bgcolor: '#fafafa',
                    borderRadius: 2,
                    border: '1px solid #eee',
                    maxHeight: 220,
                    overflowY: 'auto',
                  }}
                >
                  {existingOrder.items.length === 0 ? (
                    <ListItem>
                      <ListItemText primary="(Belum ada item)" />
                    </ListItem>
                  ) : (
                    existingOrder.items.map((it) => {
                      const menuName = it.menu?.name ?? '(Menu tidak ditemukan)';
                      const category = it.menu?.category
                        ? it.menu.category.charAt(0).toUpperCase() + it.menu.category.slice(1)
                        : '-';
                      const price = Number(it.price) || 0;
                      const subtotal = Number(it.sub_total) || price * (it.quantity || 1);

                      return (
                        <ListItem
                          key={it.id}
                          sx={{
                            borderBottom: '1px solid #eee',
                            py: 0.5,
                          }}
                        >
                          <ListItemText
                            primary={
                              <Typography sx={{ fontWeight: 500 }}>
                                {menuName}{' '}
                                <Typography
                                  component="span"
                                  color="text.secondary"
                                  sx={{ fontSize: 12 }}
                                >
                                  ({category})
                                </Typography>
                              </Typography>
                            }
                            secondary={`Qty: ${it.quantity} × Rp ${price.toLocaleString()} = Rp ${subtotal.toLocaleString()}`}
                          />
                        </ListItem>
                      );
                    })
                  )}
                </List>

                <Typography
                  variant="body1"
                  sx={{
                    fontWeight: 700,
                    textAlign: 'right',
                    mb: 2,
                    mr: 1,
                  }}
                >
                  Total: Rp {Number(existingOrder.total || 0).toLocaleString()}
                </Typography>

                <Divider sx={{ mb: 2 }} />
              </>
            )}

            {/* === Tambah Item Baru === */}
            <Typography variant="body2" sx={{ mb: 2 }}>
              {mode === 'create'
                ? 'Pilih menu untuk membuka pesanan baru.'
                : 'Tambah menu baru ke pesanan yang sudah berjalan.'}
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
                  onChange={(e) =>
                    handleChange(i, 'quantity', Math.max(1, Number(e.target.value)))
                  }
                  sx={{ width: 100 }}
                  size="small"
                  inputProps={{ min: 1 }}
                />

                <IconButton onClick={() => handleRemoveItem(i)} color="error">
                  <Delete />
                </IconButton>
              </Box>
            ))}

            <Button startIcon={<Add />} onClick={handleAddItem} sx={{ mt: 1 }}>
              Tambah Item
            </Button>
          </>
        )}
      </DialogContent>

      <DialogActions>
        <Button onClick={() => onClose(false)}>Batal</Button>
        {mode === 'manage' && (
          <Button color="error" onClick={handleCloseOrder} disabled={loading}>
            Tutup Pesanan
          </Button>
        )}
        <Button
          variant="contained"
          disabled={loading || disabledOk}
          onClick={mode === 'create' ? handleCreateOrder : handleAddToExistingOrder}
        >
          {loading
            ? 'Menyimpan...'
            : mode === 'create'
            ? 'Buka Pesanan'
            : 'Tambah Pesanan'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
