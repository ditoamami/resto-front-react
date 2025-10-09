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
  Box,
  Button,
} from "@mui/material";
import { useParams, useNavigate } from "react-router-dom";
import axiosPrivate from "../../api/axiosPrivate";
import { capitalizeFirst } from "../../utils/string";

export default function OrderDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrderDetail = async () => {
      try {
        const res = await axiosPrivate.get(`/orders/${id}`);
        setOrder(res.data);
      } catch (err) {
        console.error("Error fetching order detail:", err);
        setError("Gagal mengambil data order");
      } finally {
        setLoading(false);
      }
    };
    fetchOrderDetail();
  }, [id]);

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

  if (!order) {
    return (
      <Container sx={{ mt: 4 }}>
        <Typography>Tidak ada data order.</Typography>
      </Container>
    );
  }

  const totalItems = order.items?.reduce((sum, item) => sum + item.quantity, 0) || 0;

  return (
    <Container sx={{ mt: 4 }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
        <Typography variant="h6">Order Detail — ID: {order.id}</Typography>
        <Button variant="outlined" onClick={() => navigate(-1)}>
          Back
        </Button>
      </Box>

      <Typography variant="subtitle1" sx={{ mb: 1 }}>
        Table: {order.table?.name || "-"}
      </Typography>
      <Typography variant="subtitle1" sx={{ mb: 2 }}>
        Status: {capitalizeFirst(order.status) || "pending"}
      </Typography>

      <TableContainer component={Paper}>
        <Table>
          <TableHead sx={{ backgroundColor: "#f5f5f5" }}>
            <TableRow>
              <TableCell>Menu Name</TableCell>
              <TableCell>Quantity</TableCell>
              <TableCell>Price</TableCell>
              <TableCell>Sub Total</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {order.items.map((item) => (
              <TableRow key={item.id}>
                <TableCell>{item.menu?.name || `Menu ID: ${item.menu_id}`}</TableCell>
                <TableCell>{item.quantity}</TableCell>
                <TableCell>Rp {Number(item.price).toLocaleString("id-ID")}</TableCell>
                <TableCell>
                  Rp {(item.quantity * Number(item.price)).toLocaleString("id-ID")}
                </TableCell>
              </TableRow>
            ))}

            <TableRow>
              <TableCell sx={{ fontWeight: "bold" }}>Total</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>{totalItems}</TableCell>
              <TableCell></TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>
                Rp {Number(order.total).toLocaleString("id-ID")}
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
}
