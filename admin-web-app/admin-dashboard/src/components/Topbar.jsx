import { useState, useContext } from "react";
import { AppBar, Toolbar, Typography, IconButton, Box, Menu, MenuItem, Avatar, Tooltip } from "@mui/material";
import { Menu as MenuIcon, AccountCircle, Logout, Settings } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const Topbar = () => {
  const navigate = useNavigate();
  const { currentUser, logout } = useContext(AuthContext);
  const [anchorEl, setAnchorEl] = useState(null);
  
  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = async () => {
    handleClose();
    await logout();
    navigate("/login");
  };

  const handleSettings = () => {
    handleClose();
    navigate("/settings");
  };

  return (
    <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
      <Toolbar>
        <IconButton 
          color="inherit" 
          edge="start"
          sx={{ mr: 2 }}
        >
          <MenuIcon />
        </IconButton>
        
        <Typography variant="h6" noWrap sx={{ flexGrow: 1 }}>
          Admin Dashboard
        </Typography>
        
        {currentUser && (
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Typography variant="subtitle1" sx={{ mr: 2 }}>
              {currentUser.username || currentUser.email}
            </Typography>
            
            <Tooltip title="Account settings">
              <IconButton 
                onClick={handleMenu} 
                color="inherit"
                size="large"
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
              >
                <Avatar 
                  sx={{ width: 32, height: 32, bgcolor: 'primary.dark' }}
                  alt={currentUser.username || 'User'}
                >
                  {(currentUser.username?.[0] || currentUser.email?.[0] || 'U').toUpperCase()}
                </Avatar>
              </IconButton>
            </Tooltip>
            
            <Menu
              id="menu-appbar"
              anchorEl={anchorEl}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'right',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              open={Boolean(anchorEl)}
              onClose={handleClose}
            >
              <MenuItem onClick={handleSettings}>
                <Settings fontSize="small" sx={{ mr: 1 }} />
                Settings
              </MenuItem>
              <MenuItem onClick={handleLogout}>
                <Logout fontSize="small" sx={{ mr: 1 }} />
                Logout
              </MenuItem>
            </Menu>
          </Box>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Topbar;