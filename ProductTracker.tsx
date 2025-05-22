import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  TextField,
  Button,
  Card,
  CardContent,
  Grid,
  Alert,
  CircularProgress,
} from '@mui/material';
import axios from 'axios';

const ProductTracker: React.FC = () => {
  const navigate = useNavigate();
  const [url, setUrl] = useState('');
  const [targetPrice, setTargetPrice] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [productInfo, setProductInfo] = useState<any>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setProductInfo(null);

    try {
      const response = await axios.post('http://localhost:8000/products/', {
        url,
        target_price: targetPrice ? parseFloat(targetPrice) : null,
        email: email || null,
      });

      setProductInfo(response.data);
      navigate(`/history/${response.data.id}`);
    } catch (err: any) {
      setError(err.response?.data?.detail || 'An error occurred while tracking the product');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="md">
      <Typography variant="h4" component="h1" gutterBottom sx={{ mt: 4 }}>
        Track a Product
      </Typography>

      <Card sx={{ mt: 4 }}>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Amazon Product URL"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  required
                  placeholder="https://www.amazon.in/dp/..."
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Target Price (optional)"
                  type="number"
                  value={targetPrice}
                  onChange={(e) => setTargetPrice(e.target.value)}
                  placeholder="Enter target price"
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Email for Alerts (optional)"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                />
              </Grid>

              <Grid item xs={12}>
                <Button
                  type="submit"
                  variant="contained"
                  size="large"
                  fullWidth
                  disabled={loading}
                >
                  {loading ? <CircularProgress size={24} /> : 'Start Tracking'}
                </Button>
              </Grid>
            </Grid>
          </form>

          {error && (
            <Alert severity="error" sx={{ mt: 2 }}>
              {error}
            </Alert>
          )}

          {productInfo && (
            <Alert severity="success" sx={{ mt: 2 }}>
              Product tracking started successfully!
            </Alert>
          )}
        </CardContent>
      </Card>
    </Container>
  );
};

export default ProductTracker; 