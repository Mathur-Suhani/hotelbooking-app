import { 
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell,
  PieChart, Pie, Legend, RadarChart, PolarGrid, PolarAngleAxis, 
  PolarRadiusAxis, Radar, LineChart, Line, CartesianGrid
} from "recharts";
import { 
  Box, Typography, Paper, Grid, Button, Chip, IconButton,
  Divider, Card, CardContent
} from "@mui/material";
import { Close, TrendingUp, Star, LocationOn } from "@mui/icons-material";
import { useDispatch } from "react-redux";
import { removeFromCompare, clearCompare } from "../redux/hotelSlice";

export default function Compare({ hotels }) {
  const dispatch = useDispatch();

  if (hotels.length === 0) {
    return (
      <Paper sx={{ p: 4, textAlign: 'center', borderRadius: 2 }}>
        <Typography variant="h6" color="text.secondary">
          No hotels selected for comparison
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          Click "COMPARE" on hotel cards to add them here
        </Typography>
      </Paper>
    );
  }

  if (hotels.length < 2) {
    return (
      <Paper sx={{ p: 4, textAlign: 'center', borderRadius: 2 }}>
        <Typography variant="h6" color="text.secondary">
          Add at least one more hotel to compare
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          Currently comparing: {hotels[0]?.name || 'Unknown'}
        </Typography>
      </Paper>
    );
  }

  const colors = ["#667eea", "#764ba2", "#9c6fb9", "#c894d1", "#f093fb", "#4facfe"];

  const priceData = hotels.map((h, index) => ({
    name: h.name?.substring(0, 15) + "..." || "Hotel " + (index + 1),
    price: Number(h.price) || 0,
    fullName: h.name || "Unknown Hotel"
  }));

  const ratingData = hotels.map((h, index) => ({
    name: h.name?.substring(0, 15) + "..." || "Hotel " + (index + 1),
    rating: Number(h.rating) || 0,
    fullName: h.name || "Unknown Hotel"
  }));

  const distanceData = hotels.map((h, index) => ({
    name: h.name?.substring(0, 15) + "..." || "Hotel " + (index + 1),
    distance: h.distance?.value || Math.random() * 5,
    fullName: h.name || "Unknown Hotel"
  }));

  const handleRemoveHotel = (hotelId) => {
    dispatch(removeFromCompare(hotelId));
  };

  const handleClearAll = () => {
    dispatch(clearCompare());
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography 
          variant="h4" 
          sx={{ 
            fontWeight: 700,
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          Hotel Comparison ({hotels.length} Hotels)
        </Typography>
        <Button 
          variant="outlined" 
          color="error"
          onClick={handleClearAll}
          size="small"
        >
          Clear All
        </Button>
      </Box>

      <Grid container spacing={2} sx={{ mb: 4 }}>
        {hotels.map((hotel, index) => (
          <Grid item xs={12} md={6} lg={3} key={hotel.hotelId || index}>
            <Card 
              sx={{ 
                position: 'relative',
                border: `2px solid ${colors[index % colors.length]}`,
                borderRadius: 2,
              }}
            >
              <IconButton
                size="small"
                onClick={() => handleRemoveHotel(hotel.hotelId)}
                sx={{
                  position: 'absolute',
                  top: 8,
                  right: 8,
                  bgcolor: 'white',
                  '&:hover': { bgcolor: '#f5f5f5' },
                  zIndex: 1,
                }}
              >
                <Close fontSize="small" />
              </IconButton>
              
              <CardContent>
                <Typography variant="subtitle1" fontWeight={600} noWrap>
                  {hotel.name || 'Unknown Hotel'}
                </Typography>
                
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1 }}>
                  <Star sx={{ fontSize: 16, color: '#ffa726' }} />
                  <Typography variant="body2">
                    {hotel.rating || 'N/A'} ({hotel.reviewCount || 0} reviews)
                  </Typography>
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
                  <LocationOn sx={{ fontSize: 16, color: '#666' }} />
                  <Typography variant="caption" color="text.secondary">
                    {hotel.distance?.value ? `${hotel.distance.value.toFixed(1)} km` : '0 km'} from center
                  </Typography>
                </Box>

                <Divider sx={{ my: 1.5 }} />

                <Typography 
                  variant="h5" 
                  fontWeight={700}
                  sx={{ color: colors[index % colors.length] }}
                >
                  ${hotel.price || 0}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  per night
                </Typography>

                <Box sx={{ mt: 1.5, display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                  {(hotel.amenities || []).slice(0, 3).map((amenity, i) => (
                    <Chip 
                      key={i}
                      label={amenity} 
                      size="small" 
                      variant="outlined"
                      sx={{ height: 20, fontSize: '0.7rem' }}
                    />
                  ))}
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Grid container spacing={3}>
        <Grid item xs={12} lg={6}>
          <Paper sx={{ p: 3, borderRadius: 2, height: '100%' }}>
            <Typography variant="h6" fontWeight={600} sx={{ mb: 2 }}>
              Price Comparison
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={priceData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="name" 
                  tick={{ fontSize: 11 }}
                  angle={-15}
                  textAnchor="end"
                  height={80}
                />
                <YAxis 
                  tick={{ fontSize: 11 }}
                  label={{ value: "Price ($)", angle: -90, position: "insideLeft" }}
                />
                <Tooltip 
                  formatter={(value) => `$${value}`}
                  contentStyle={{
                    background: "white",
                    border: "1px solid #667eea",
                    borderRadius: 8,
                  }}
                />
                <Bar dataKey="price" radius={[8, 8, 0, 0]}>
                  {priceData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        <Grid item xs={12} lg={6}>
          <Paper sx={{ p: 3, borderRadius: 2, height: '100%' }}>
            <Typography variant="h6" fontWeight={600} sx={{ mb: 2 }}>
              Rating Distribution
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={ratingData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="name" 
                  tick={{ fontSize: 11 }}
                  angle={-15}
                  textAnchor="end"
                  height={80}
                />
                <YAxis 
                  domain={[0, 5]}
                  tick={{ fontSize: 11 }}
                  label={{ value: "Rating", angle: -90, position: "insideLeft" }}
                />
                <Tooltip 
                  formatter={(value) => `${value} ⭐`}
                  contentStyle={{
                    background: "white",
                    border: "1px solid #667eea",
                    borderRadius: 8,
                  }}
                />
                <Bar dataKey="rating" radius={[8, 8, 0, 0]}>
                  {ratingData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        <Grid item xs={12} lg={6}>
          <Paper sx={{ p: 3, borderRadius: 2, height: '100%' }}>
            <Typography variant="h6" fontWeight={600} sx={{ mb: 2 }}>
              Distance from City Center
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={distanceData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="name" 
                  tick={{ fontSize: 11 }}
                  angle={-15}
                  textAnchor="end"
                  height={80}
                />
                <YAxis 
                  tick={{ fontSize: 11 }}
                  label={{ value: "Distance (km)", angle: -90, position: "insideLeft" }}
                />
                <Tooltip 
                  formatter={(value) => `${Number(value).toFixed(1)} km`}
                  contentStyle={{
                    background: "white",
                    border: "1px solid #667eea",
                    borderRadius: 8,
                  }}
                />
                <Line 
                  type="monotone" 
                  dataKey="distance" 
                  stroke="#667eea" 
                  strokeWidth={3}
                  dot={{ fill: '#667eea', r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>
      </Grid>

      <Paper sx={{ mt: 3, p: 3, borderRadius: 2 }}>
        <Typography variant="h6" fontWeight={600} sx={{ mb: 2 }}>
          Quick Comparison
        </Typography>
        <Box sx={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid #e0e0e0' }}>
                <th style={{ padding: '12px', textAlign: 'left' }}>Feature</th>
                {hotels.map((hotel, index) => (
                  <th 
                    key={index} 
                    style={{ 
                      padding: '12px', 
                      textAlign: 'center',
                      color: colors[index % colors.length],
                      fontWeight: 600
                    }}
                  >
                    {hotel.name?.substring(0, 20) || `Hotel ${index + 1}`}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr style={{ borderBottom: '1px solid #f0f0f0' }}>
                <td style={{ padding: '12px', fontWeight: 500 }}>Price</td>
                {hotels.map((hotel, index) => (
                  <td key={index} style={{ padding: '12px', textAlign: 'center' }}>
                    <strong>${hotel.price || 0}</strong>
                  </td>
                ))}
              </tr>
              <tr style={{ borderBottom: '1px solid #f0f0f0', background: '#fafafa' }}>
                <td style={{ padding: '12px', fontWeight: 500 }}>Rating</td>
                {hotels.map((hotel, index) => (
                  <td key={index} style={{ padding: '12px', textAlign: 'center' }}>
                    ⭐ {hotel.rating || 'N/A'}
                  </td>
                ))}
              </tr>
              <tr style={{ borderBottom: '1px solid #f0f0f0' }}>
                <td style={{ padding: '12px', fontWeight: 500 }}>Reviews</td>
                {hotels.map((hotel, index) => (
                  <td key={index} style={{ padding: '12px', textAlign: 'center' }}>
                    {hotel.reviewCount || 0}
                  </td>
                ))}
              </tr>
              <tr style={{ borderBottom: '1px solid #f0f0f0', background: '#fafafa' }}>
                <td style={{ padding: '12px', fontWeight: 500 }}>Distance</td>
                {hotels.map((hotel, index) => (
                  <td key={index} style={{ padding: '12px', textAlign: 'center' }}>
                    {hotel.distance?.value ? `${hotel.distance.value.toFixed(1)} km` : 'N/A'}
                  </td>
                ))}
              </tr>
              <tr>
                <td style={{ padding: '12px', fontWeight: 500 }}>Amenities</td>
                {hotels.map((hotel, index) => (
                  <td key={index} style={{ padding: '12px', textAlign: 'center' }}>
                    {(hotel.amenities || []).length} amenities
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </Box>
      </Paper>
    </Box>
  );
}