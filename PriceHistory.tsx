import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  Container,
  Typography,
  Card,
  CardContent,
  Grid,
  CircularProgress,
  Alert,
} from '@mui/material';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import axios from 'axios';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface PriceHistory {
  price: number;
  timestamp: string;
}

interface Product {
  id: number;
  name: string;
  url: string;
  current_price: number;
  target_price: number | null;
  last_updated: string;
  image_url?: string;
}

const PriceHistory: React.FC = () => {
  const { productId } = useParams<{ productId: string }>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [product, setProduct] = useState<Product | null>(null);
  const [priceHistory, setPriceHistory] = useState<PriceHistory[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productRes, historyRes] = await Promise.all([
          axios.get(`http://localhost:8000/products/${productId}`),
          axios.get(`http://localhost:8000/products/${productId}/history`),
        ]);

        setProduct(productRes.data);
        setPriceHistory(historyRes.data);
      } catch (err: any) {
        setError(err.response?.data?.detail || 'Error fetching product data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [productId]);

  const chartData = {
    labels: priceHistory.map((item) => new Date(item.timestamp).toLocaleDateString()),
    datasets: [
      {
        label: 'Price History',
        data: priceHistory.map((item) => item.price),
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Price History',
      },
    },
    scales: {
      y: {
        beginAtZero: false,
        title: {
          display: true,
          text: 'Price (₹)',
        },
      },
    },
  };

  if (loading) {
    return (
      <Container sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Container>
    );
  }

  if (error) {
    return (
      <Container sx={{ mt: 4 }}>
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg">
      <Typography variant="h4" component="h1" gutterBottom sx={{ mt: 4 }}>
        {product?.name}
      </Typography>

      <Grid container spacing={4}>
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Line data={chartData} options={chartOptions} />
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              {product?.image_url && (
                <img
                  src={product.image_url}
                  alt={product.name}
                  style={{ width: '100%', maxHeight: 200, objectFit: 'contain', marginBottom: 16 }}
                />
              )}
              <Typography variant="h6" gutterBottom>
                Current Price
              </Typography>
              <Typography variant="h4" color="primary" gutterBottom>
                ₹{product?.current_price}
              </Typography>

              {product?.target_price && (
                <>
                  <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
                    Target Price
                  </Typography>
                  <Typography variant="h4" color="secondary">
                    ₹{product.target_price}
                  </Typography>
                </>
              )}

              <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                Last updated: {new Date(product?.last_updated || '').toLocaleString()}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Bonus Features Placeholder */}
      <Card sx={{ mt: 4 }}>
        <CardContent>
          <Typography variant="h5" gutterBottom>
            Multi-Platform Price Comparison <span style={{ color: '#888' }}>(Coming Soon)</span>
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Soon you'll be able to compare prices for this product across Flipkart, Meesho, BigBasket, and more using AI-powered search!
          </Typography>
        </CardContent>
      </Card>
    </Container>
  );
};

export default PriceHistory; 