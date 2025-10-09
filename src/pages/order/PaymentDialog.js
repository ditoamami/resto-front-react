import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Button,
} from "@mui/material";
import axiosPrivate from "../../api/axiosPrivate";

export default function PaymentDialog({ open, onClose, order, onPaymentSuccess }) {
  const [paymentMethod, setPaymentMethod] = useState("cash");

  useEffect(() => {
    if (order) setPaymentMethod("cash"); // reset setiap order baru
  }, [order]);

  const handleSubmit = async () => {
    if (!order) return;

    try {
      await axiosPrivate.post("/payments", {
        order_id: order.id,
        method: paymentMethod,
        amount: order.total,
      });

      alert("Pembayaran berhasil!");
      onPaymentSuccess(order.id); // callback ke parent untuk update status
      onClose();
    } catch (err) {
      console.error("Error submitting payment:", err);
      alert("Gagal melakukan pembayaran. Coba lagi.");
    }
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Pembayaran Order #{order?.id}</DialogTitle>
      <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}>
        <TextField
          label="Total Harga"
          value={order?.total ?? 0}
          InputProps={{ readOnly: true }}
        />
        <TextField
          select
          label="Metode Pembayaran"
          value={paymentMethod}
          onChange={(e) => setPaymentMethod(e.target.value)}
        >
          <MenuItem value="cash">Cash</MenuItem>
          <MenuItem value="card">Card</MenuItem>
          <MenuItem value="qris">QRIS</MenuItem>
        </TextField>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button variant="contained" onClick={handleSubmit}>
          Bayar
        </Button>
      </DialogActions>
    </Dialog>
  );
}
