import React, { useContext } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Stack,
} from "@mui/material";
import { AuthContext } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function Header() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <AppBar
      position="static"
      color="default"
      elevation={1}
      sx={{
        mb: 3,
        backgroundColor: "#fff",
        color: "text.primary",
      }}
    >
      <Toolbar sx={{ justifyContent: "space-between" }}>
        {/* === App Title === */}
        <Typography
          variant="h6"
          sx={{ cursor: "pointer", fontWeight: 600 }}
          onClick={() => navigate("/dashboard")}
        >
          RestaurantPOS
        </Typography>

        {/* === Right-side User Section === */}
        {user ? (
          <Stack direction="row" alignItems="center" spacing={2}>
            <Box textAlign="right">
              <Typography variant="subtitle2">{user.name}</Typography>
              {user.role && (
                <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{ fontStyle: "italic" }}
                >
                  {user.role}
                </Typography>
              )}
            </Box>
            <Button
              variant="outlined"
              color="error"
              size="small"
              onClick={handleLogout}
            >
              Logout
            </Button>
          </Stack>
        ) : (
          <Button
            variant="contained"
            color="primary"
            size="small"
            onClick={() => navigate("/login")}
          >
            Login
          </Button>
        )}
      </Toolbar>
    </AppBar>
  );
}
