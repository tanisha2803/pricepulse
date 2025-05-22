import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
} from '@mui/material';
import PriceCheckIcon from '@mui/icons-material/PriceCheck';

const Navbar: React.FC = () => {
  return (
    <AppBar position="static">
      <Toolbar>
        <PriceCheckIcon sx={{ mr: 2 }} />
        <Typography
          variant="h6"
          component={RouterLink}
          to="/"
          sx={{
            flexGrow: 1,
            textDecoration: 'none',
            color: 'inherit',
          }}
        >
          PricePulse
        </Typography>
        <Box>
          <Button
            color="inherit"
            component={RouterLink}
            to="/track"
          >
            Track Product
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar; 