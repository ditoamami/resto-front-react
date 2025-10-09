import React, { useContext } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Stack,
  Avatar,
  Tooltip,
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
      elevation={3}
      sx={{
        backgroundColor: "#fff",
        color: "text.primary",
        zIndex: (theme) => theme.zIndex.drawer + 1,
        borderBottom: "1px solid",
        borderColor: "divider",
      }}
    >
      <Toolbar sx={{ justifyContent: "space-between" }}>
        {/* === App Title === */}
        <Typography
          variant="h6"
          sx={{
            cursor: "pointer",
            fontWeight: 700,
            "&:hover": { color: "primary.main", transform: "scale(1.03)", transition: "0.2s" },
          }}
          onClick={() => navigate("/dashboard")}
        >
          Restaurant Sismedika POS
        </Typography>

        {/* === Right-side User Section === */}
        {user ? (
          <Stack direction="row" alignItems="center" spacing={2}>
            <Tooltip title={user.name}>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  px: 1.5,
                  py: 0.5,
                  borderRadius: 2,
                  backgroundColor: "grey.100",
                  cursor: "default",
                  "&:hover": { backgroundColor: "grey.200" },
                }}
              >
                <Avatar sx={{ width: 32, height: 32, mr: 1 }}>
                  {user.name.charAt(0).toUpperCase()}
                </Avatar>
                <Box textAlign="left">
                  <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                    {user.name}
                  </Typography>
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
              </Box>
            </Tooltip>

            <Button
              variant="contained"
              color="error"
              size="small"
              sx={{
                textTransform: "none",
                "&:hover": { backgroundColor: "#d32f2f" },
              }}
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
            sx={{ textTransform: "none" }}
            onClick={() => navigate("/login")}
          >
            Login
          </Button>
        )}
      </Toolbar>
    </AppBar>
  );
}
