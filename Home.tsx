import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  CardActions,
  Box,
} from '@mui/material';
import {
  Timeline,
  NotificationsActive,
  CompareArrows,
} from '@mui/icons-material';

const Home: React.FC = () => {
  const navigate = useNavigate();

  const features = [
    {
      title: 'Price Tracking',
      description: 'Automatically track product prices from Amazon every 30 minutes',
      icon: <Timeline fontSize="large" />,
    },
    {
      title: 'Price Alerts',
      description: 'Get notified when prices drop below your target',
      icon: <NotificationsActive fontSize="large" />,
    },
    {
      title: 'Price Comparison',
      description: 'Compare prices across multiple e-commerce platforms',
      icon: <CompareArrows fontSize="large" />,
    },
  ];

  return (
    <Container maxWidth="lg">
      <Typography
        variant="h2"
        component="h1"
        gutterBottom
        sx={{ textAlign: 'center', mt: 4 }}
      >
        Welcome to PricePulse
      </Typography>
      <Typography
        variant="h5"
        component="h2"
        gutterBottom
        sx={{ textAlign: 'center', mb: 6 }}
      >
        Track prices, save money, shop smarter
      </Typography>

      <Grid container spacing={4} sx={{ mb: 6 }}>
        {features.map((feature, index) => (
          <Grid item xs={12} md={4} key={index}>
            <Card sx={{ height: '100%' }}>
              <CardContent sx={{ textAlign: 'center' }}>
                {feature.icon}
                <Typography variant="h5" component="h3" gutterBottom>
                  {feature.title}
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  {feature.description}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Box sx={{ textAlign: 'center' }}>
        <Button
          variant="contained"
          size="large"
          onClick={() => navigate('/track')}
          sx={{ px: 4, py: 1.5 }}
        >
          Start Tracking Prices
        </Button>
      </Box>
    </Container>
  );
};

export default Home; 