import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Container,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";
import axiosPrivate from "../../api/axiosPrivate";
import { capitalizeFirst } from "../../utils/string";
import MenuFormDialog from './MenuFormDialog';

export default function MenuListPage() {
  const [menus, setMenus] = useState([]);
  const [open, setOpen] = useState(false);

  const fetchMenus = async () => {
    try {
      const res = await axiosPrivate.get("/menus");
      setMenus(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchMenus();
  }, []);

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 2,
        }}
      >
        <Typography variant="h5">Menu List</Typography>
        <Button
          variant="contained"
          onClick={() => setOpen(true)}
        >
          + Add Menu
        </Button>
      </Box>

      <Paper>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Category</TableCell>
              <TableCell>Price</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {menus.map((menu) => (
              <TableRow key={menu.id}>
                <TableCell>{menu.id}</TableCell>
                <TableCell>{menu.name}</TableCell>
                <TableCell>{capitalizeFirst(menu.category)}</TableCell>
                <TableCell>Rp {menu.price.toLocaleString()}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>

      <MenuFormDialog
        open={open}
        onClose={() => setOpen(false)}
        onSuccess={fetchMenus}
      />
    </Container>
  );
}
