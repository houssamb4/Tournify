import React, { useEffect, useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import Sidebar from './Sidebar';
import Topbar from './Topbar';
import { Box, CircularProgress } from '@mui/material';

const AdminLayout = () => {
  const { currentUser, loading } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [isPageReady, setIsPageReady] = useState(false);

  // Check if user is authenticated
  useEffect(() => {
    if (!loading && !currentUser) {
      navigate('/login');
    } else if (!loading && currentUser) {
      setIsPageReady(true);
    }
  }, [currentUser, navigate, loading]);

  // Set document title based on current route
  useEffect(() => {
    const path = location.pathname.split('/').filter(Boolean)[0];
    if (path) {
      const formattedPath = path.charAt(0).toUpperCase() + path.slice(1);
      document.title = `Admin - ${formattedPath}`;
    } else {
      document.title = 'Admin Dashboard';
    }
  }, [location]);

  // If loading or not authenticated, show loading spinner
  if (loading || !isPageReady) {
    return (
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100vh',
          bgcolor: '#f5f5f5'
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ display: 'flex', height: '100vh' }}>
      <Topbar />
      <Sidebar />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          mt: 8,
          overflow: 'auto',
          backgroundColor: '#f5f5f5'
        }}
      >
        <Outlet />
      </Box>
    </Box>
  );
};

export default AdminLayout;
