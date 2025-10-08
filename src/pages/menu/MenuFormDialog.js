import React, { useState } from "react";
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

export default function MenuFormDialog({ open, onClose, onSuccess }) {
  const [form, setForm] = useState({
    name: "",
    price: "",
    category: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axiosPrivate.post("/menus", form);
      onSuccess(); // Refresh list
      onClose(); // Close modal
    } catch (err) {
      console.error("Error adding menu:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Add New Menu</DialogTitle>
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
            value={form.price}
            onChange={handleChange}
            fullWidth
            required
            type="number"
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
          {loading ? "Saving..." : "Save"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
