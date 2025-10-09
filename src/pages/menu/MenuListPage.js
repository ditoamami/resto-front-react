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
  IconButton,
} from "@mui/material";
import { Edit, Delete } from "@mui/icons-material";
import axiosPrivate from "../../api/axiosPrivate";
import { capitalizeFirst } from "../../utils/string";
import MenuFormDialog from './MenuFormDialog';

export default function MenuListPage() {
  const [menus, setMenus] = useState([]);
  const [open, setOpen] = useState(false);
  const [selectedMenu, setSelectedMenu] = useState(null); // untuk update

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

  /** 🔹 Delete Menu */
  const handleDelete = async (id) => {
    if (!window.confirm("Yakin ingin menghapus menu ini?")) return;
    try {
      await axiosPrivate.delete(`/menus/${id}`);
      fetchMenus(); // refresh list
    } catch (err) {
      console.error(err);
      alert("Gagal menghapus menu.");
    }
  };

  /** 🔹 Open update dialog */
  const handleEdit = (menu) => {
    setSelectedMenu(menu);
    setOpen(true);
  };

  /** 🔹 Close dialog */
  const handleCloseDialog = () => {
    setOpen(false);
    setSelectedMenu(null);
  };

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
              <TableCell>No.</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Category</TableCell>
              <TableCell>Price</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {menus.map((menu, index) => (
              <TableRow key={menu.id}>
                <TableCell>{index + 1}</TableCell>
                <TableCell>{menu.name}</TableCell>
                <TableCell>{capitalizeFirst(menu.category)}</TableCell>
                <TableCell>Rp {menu.price.toLocaleString()}</TableCell>
                <TableCell>
                  <IconButton
                    color="primary"
                    onClick={() => handleEdit(menu)}
                  >
                    <Edit />
                  </IconButton>
                  <IconButton
                    color="error"
                    onClick={() => handleDelete(menu.id)}
                  >
                    <Delete />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>

      <MenuFormDialog
        open={open}
        menu={selectedMenu} // pass selected menu untuk update
        onClose={handleCloseDialog}
        onSuccess={fetchMenus}
      />
    </Container>
  );
}
