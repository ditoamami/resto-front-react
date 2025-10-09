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
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import axiosPrivate from "../../api/axiosPrivate";
import PaymentDialog from "./PaymentDialog";


export default function OrderListPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { user } = useContext(AuthContext);

  const [paymentDialogOpen, setPaymentDialogOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

  const navigate = useNavigate();

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

  const handleCloseOrPay = async (order) => {
    try {
      if (order.status === "closed") {
        // open payment dialog
        setSelectedOrder(order);
        setPaymentDialogOpen(true);
      } else {
        // close order
        await axiosPrivate.post("/orders/close", { order_id: order.id });
        setOrders((prev) =>
          prev.map((o) =>
            o.id === order.id ? { ...o, status: "closed" } : o
          )
        );
      }
    } catch (err) {
      console.error(err);
      alert("Gagal memproses order. Coba lagi.");
    }
  };

  const handlePaymentSuccess = (orderId) => {
    setOrders((prevOrders) =>
      prevOrders.map((o) =>
        o.id === orderId ? { ...o, status: "paid" } : o
      )
    );
  };

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
              orders.map((order, index) => {
                const totalItems = order.items?.reduce(
                  (sum, item) => sum + (item.quantity || 0),
                  0
                );

                return (
                  <TableRow key={order.id}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>{order.table?.name || "-"}</TableCell>
                    <TableCell>{totalItems}</TableCell>
                    <TableCell>
                      Rp {Number(order.total || 0).toLocaleString("id-ID")}
                    </TableCell>
                    <TableCell sx={{ textTransform: "capitalize" }}>
                      {order.status || "pending"}
                    </TableCell>
                    <TableCell>
                      {order.created_at
                        ? new Date(order.created_at).toLocaleString("id-ID")
                        : "-"}
                    </TableCell>
                    <TableCell align="right" sx={{ display: "flex", gap: 1 }}>
                        <Button
                          size="small"
                          variant="outlined"
                          color="primary"
                          onClick={() => navigate(`/orders/${order.id}`)}
                        >
                          Detail
                        </Button>                     

                        {order.status === "open" && (
                          <Button
                            size="small"
                            variant="outlined"
                            color="secondary"
                            onClick={() => handleCloseOrPay(order)}
                          >
                            Close Order
                          </Button>
                        )}                      

                        {order.status === "closed"  && user?.role === "kasir" && (
                          <Button
                            size="small"
                            variant="contained"
                            color="success"
                            onClick={() => handleCloseOrPay(order)}
                          >
                            Pay
                          </Button>
                        )}                      

                        {order.status === "paid"  && user?.role === "kasir" && (
                          <Button
                            size="small"
                            variant="contained"
                            color="primary"
                            onClick={async () => {
                              try {
                                const res = await axiosPrivate.get(
                                  `/payments/${order.id}/receipt`,
                                  { responseType: "blob" } // untuk file PDF
                                );
                                const url = window.URL.createObjectURL(new Blob([res.data]));
                                const link = document.createElement("a");
                                link.href = url;
                                link.setAttribute(
                                  "download",
                                  `receipt_order_${order.id}.pdf`
                                );
                                document.body.appendChild(link);
                                link.click();
                                link.remove();
                              } catch (err) {
                                console.error(err);
                                alert("Gagal mengunduh receipt");
                              }
                            }}
                          >
                            Generate Receipt
                          </Button>
                        )}
                      </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <PaymentDialog
        open={paymentDialogOpen}
        onClose={() => setPaymentDialogOpen(false)}
        order={selectedOrder}
        onPaymentSuccess={handlePaymentSuccess}
      />
    </Container>
  );
}
