import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  MenuItem,
  Stack,
} from "@mui/material";
import axiosPrivate from "../../api/axiosPrivate";
import { formatRupiah } from "../../utils/string";

export default function MenuFormDialog({ open, onClose, onSuccess, menu }) {
  const [form, setForm] = useState({
    name: "",
    price: "",
    category: "",
  });
  const [loading, setLoading] = useState(false);

  // Jika ada menu (update), set form sesuai data menu
  useEffect(() => {
    if (menu) {
      setForm({
        name: menu.name || "",
        price: menu.price || "",
        category: menu.category || "",
      });
    } else {
      setForm({
        name: "",
        price: "",
        category: "",
      });
    }
  }, [menu, open]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (menu) {
        // 🔹 Update menu
        await axiosPrivate.put(`/menus/${menu.id}`, form);
      } else {
        // 🔹 Create menu
        await axiosPrivate.post("/menus", form);
      }
      onSuccess(); 
      onClose(); 
    } catch (err) {
      console.error("Error saving menu:", err);
      alert("Gagal menyimpan menu");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>{menu ? "Update Menu" : "Add New Menu"}</DialogTitle>
      <DialogContent>
        <Stack spacing={2} sx={{ mt: 1 }}>
          <TextField
            label="Menu Name"
            name="name"
            value={form.name}
            onChange={handleChange}
            fullWidth
            required
          />
          <TextField
            label="Price"
            name="price"
            value={form.price ? formatRupiah(form.price) : ""} // tampilkan format rupiah
            onChange={(e) => {
              // hapus semua karakter kecuali angka
              const onlyNumber = e.target.value.replace(/[^0-9]/g, "");
              setForm({ ...form, price: parseInt(onlyNumber || "0") });
            }}
            fullWidth
            required
          />
          <TextField
            select
            label="Category"
            name="category"
            value={form.category}
            onChange={handleChange}
            fullWidth
            required
          >
            <MenuItem value="makanan">Makanan</MenuItem>
            <MenuItem value="minuman">Minuman</MenuItem>
            <MenuItem value="snack">Snack</MenuItem>
          </TextField>
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="secondary">
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          disabled={loading}
        >
          {loading ? "Saving..." : menu ? "Update" : "Save"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
