import React, { useEffect, useState } from "react";
import {
  Container,
  Typography,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TableContainer,
  Paper,
  CircularProgress,
  Button,
  Box,
} from "@mui/material";
import axiosPrivate from "../../api/axiosPrivate";

export default function OrderListPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Ambil data orders
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await axiosPrivate.get("/orders");
        setOrders(res.data);
      } catch (err) {
        console.error("Error fetching orders:", err);
        setError("Gagal mengambil data order");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  if (loading) {
    return (
      <Container sx={{ mt: 4, textAlign: "center" }}>
        <CircularProgress />
      </Container>
    );
  }

  if (error) {
    return (
      <Container sx={{ mt: 4 }}>
        <Typography color="error">{error}</Typography>
      </Container>
    );
  }

  return (
    <Container sx={{ mt: 4 }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 2,
        }}
      >
        <Typography variant="h6">Orders — List</Typography>
        <Button variant="contained" color="primary">
          Open New Order
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead sx={{ backgroundColor: "#f5f5f5" }}>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Table</TableCell>
              <TableCell>Total Items</TableCell>
              <TableCell>Total Price</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Created At</TableCell>
              <TableCell align="right">Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {orders.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} align="center">
                  Tidak ada data order.
                </TableCell>
              </TableRow>
            ) : (
              orders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell>{order.id}</TableCell>
                  <TableCell>{order.table_number || "-"}</TableCell>
                  <TableCell>{order.items_count || 0}</TableCell>
                  <TableCell>
                    Rp{" "}
                    {Number(order.total_price || 0).toLocaleString("id-ID")}
                  </TableCell>
                  <TableCell sx={{ textTransform: "capitalize" }}>
                    {order.status || "pending"}
                  </TableCell>
                  <TableCell>
                    {new Date(order.created_at).toLocaleString("id-ID")}
                  </TableCell>
                  <TableCell align="right">
                    <Button
                      size="small"
                      variant="outlined"
                      color="primary"
                      href={`/orders/${order.id}`}
                    >
                      Detail
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
}
