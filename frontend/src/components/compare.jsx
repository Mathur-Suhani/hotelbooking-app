import { 
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell,
  LineChart, Line, CartesianGrid, RadarChart, PolarGrid, 
  PolarAngleAxis, PolarRadiusAxis, Radar
} from "recharts";
import { 
  Box, Typography, Paper, Grid, Button, Chip, IconButton,
  Divider, Card, CardContent, Avatar, LinearProgress, Fade
} from "@mui/material";
import { 
  Close, TrendingUp, Star, LocationOn, AttachMoney, 
  Grade, Delete, Visibility, CompareArrows
} from "@mui/icons-material";
import { useDispatch } from "react-redux";
import { removeFromCompare, clearCompare } from "../redux/hotelSlice";

export default function Compare({ hotels }) {
  const dispatch = useDispatch();

  if (hotels.length === 0) {
    return (
      <Fade in timeout={600}>
        <Paper 
          sx={{ 
            p: 6, 
            textAlign: 'center', 
            borderRadius: 3,
            background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.05) 0%, rgba(118, 75, 162, 0.05) 100%)',
            border: '2px dashed #e0e0e0',
          }}
        >
          <Box
            sx={{
              width: 80,
              height: 80,
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #667eea15 0%, #764ba215 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 16px',
            }}
          >
            <CompareArrows sx={{ fontSize: 40, color: '#667eea' }} />
          </Box>
          <Typography variant="h5" fontWeight={700} sx={{ mb: 1, color: '#333' }}>
            No Hotels Selected
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 400, mx: 'auto' }}>
            Click the "Compare" button on hotel cards to add them here and see side-by-side comparisons
          </Typography>
        </Paper>
      </Fade>
    );
  }

  if (hotels.length < 2) {
    return (
      <Fade in timeout={600}>
        <Paper 
          sx={{ 
            p: 5, 
            textAlign: 'center', 
            borderRadius: 3,
            background: 'white',
            border: '1px solid #e0e0e0',
          }}
        >
          <Box
            sx={{
              width: 64,
              height: 64,
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #667eea15 0%, #764ba215 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 16px',
            }}
          >
            <CompareArrows sx={{ fontSize: 32, color: '#667eea' }} />
          </Box>
          <Typography variant="h6" fontWeight={600} sx={{ mb: 1 }}>
            Add More Hotels to Compare
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Currently comparing: <strong>{hotels[0]?.name || 'Unknown Hotel'}</strong>
          </Typography>
          <Typography variant="caption" color="text.secondary">
            Select at least one more hotel from the search results
          </Typography>
        </Paper>
      </Fade>
    );
  }

  const colors = ["#667eea", "#764ba2", "#f093fb", "#4facfe", "#43e97b", "#fa709a"];

  const priceData = hotels.map((h, index) => ({
    name: h.name?.substring(0, 20) + (h.name?.length > 20 ? "..." : "") || "Hotel " + (index + 1),
    price: Number(h.price) || 0,
    fullName: h.name || "Unknown Hotel"
  }));

  const ratingData = hotels.map((h, index) => ({
    name: h.name?.substring(0, 20) + (h.name?.length > 20 ? "..." : "") || "Hotel " + (index + 1),
    rating: Number(h.rating) || 0,
    fullName: h.name || "Unknown Hotel"
  }));

  const distanceData = hotels.map((h, index) => ({
    name: h.name?.substring(0, 20) + (h.name?.length > 20 ? "..." : "") || "Hotel " + (index + 1),
    distance: h.distance?.value || Math.random() * 5,
    fullName: h.name || "Unknown Hotel"
  }));

  const valueData = hotels.map((h, index) => {
    const normalizedPrice = 100 - ((h.price / Math.max(...hotels.map(hotel => hotel.price))) * 100);
    const normalizedRating = (h.rating / 5) * 100;
    const valueScore = (normalizedPrice + normalizedRating) / 2;
    
    return {
      name: h.name?.substring(0, 20) + (h.name?.length > 20 ? "..." : "") || "Hotel " + (index + 1),
      value: Math.round(valueScore),
      fullName: h.name || "Unknown Hotel"
    };
  });

  const radarData = [
    {
      metric: 'Price',
      ...hotels.reduce((acc, h, i) => ({
        ...acc,
        [`Hotel${i + 1}`]: 100 - ((h.price / Math.max(...hotels.map(hotel => hotel.price))) * 100)
      }), {})
    },
    {
      metric: 'Rating',
      ...hotels.reduce((acc, h, i) => ({
        ...acc,
        [`Hotel${i + 1}`]: (h.rating / 5) * 100
      }), {})
    },
    {
      metric: 'Reviews',
      ...hotels.reduce((acc, h, i) => ({
        ...acc,
        [`Hotel${i + 1}`]: Math.min((h.reviewCount / 500) * 100, 100)
      }), {})
    },
    {
      metric: 'Location',
      ...hotels.reduce((acc, h, i) => ({
        ...acc,
        [`Hotel${i + 1}`]: Math.max(0, 100 - ((h.distance?.value || 5) * 10))
      }), {})
    },
    {
      metric: 'Amenities',
      ...hotels.reduce((acc, h, i) => ({
        ...acc,
        [`Hotel${i + 1}`]: Math.min(((h.amenities?.length || 5) / 15) * 100, 100)
      }), {})
    },
  ];

  const handleRemoveHotel = (hotelId) => {
    dispatch(removeFromCompare(hotelId));
  };

  const handleClearAll = () => {
    dispatch(clearCompare());
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <Paper 
          sx={{ 
            p: 1.5, 
            boxShadow: 3,
            border: '1px solid #e0e0e0',
            borderRadius: 1.5,
          }}
        >
          <Typography variant="body2" fontWeight={600} sx={{ mb: 0.5 }}>
            {payload[0].payload.fullName || label}
          </Typography>
          <Typography variant="body2" color="primary">
            {payload[0].name === 'price' && '$'}
            {payload[0].value}
            {payload[0].name === 'rating' && ' ⭐'}
            {payload[0].name === 'distance' && ' km'}
            {payload[0].name === 'value' && '%'}
          </Typography>
        </Paper>
      );
    }
    return null;
  };

  return (
    <Fade in timeout={800}>
      <Box>
        <Paper
          elevation={0}
          sx={{
            p: 3,
            mb: 3,
            borderRadius: 3,
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
          }}
        >
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
            <Box>
              <Typography variant="h4" fontWeight={800} sx={{ mb: 0.5 }}>
                Hotel Comparison
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.9 }}>
                Comparing {hotels.length} properties side-by-side
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', gap: 1.5 }}>
              <Chip 
                label={`${hotels.length} Hotels`}
                sx={{ 
                  background: 'rgba(255,255,255,0.2)',
                  color: 'white',
                  fontWeight: 600,
                  backdropFilter: 'blur(10px)',
                }}
              />
              <Button 
                variant="contained"
                color="error"
                onClick={handleClearAll}
                startIcon={<Delete />}
                sx={{
                  background: 'rgba(255,255,255,0.2)',
                  backdropFilter: 'blur(10px)',
                  '&:hover': {
                    background: 'rgba(255,255,255,0.3)',
                  }
                }}
              >
                Clear All
              </Button>
            </Box>
          </Box>
        </Paper>

        <Grid container spacing={2.5} sx={{ mb: 4 }}>
          {hotels.map((hotel, index) => (
            <Grid item xs={12} sm={6} md={hotels.length === 2 ? 6 : 4} lg={hotels.length <= 3 ? 4 : 3} key={hotel.hotelId || index}>
              <Card 
                sx={{ 
                  position: 'relative',
                  borderRadius: 3,
                  overflow: 'hidden',
                  height: '100%',
                  transition: 'all 0.3s ease',
                  border: `3px solid ${colors[index % colors.length]}`,
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: `0 12px 28px ${colors[index % colors.length]}40`,
                  }
                }}
              >
                <Box 
                  sx={{ 
                    height: 6, 
                    background: `linear-gradient(90deg, ${colors[index % colors.length]}, ${colors[(index + 1) % colors.length]})`,
                  }} 
                />

                <IconButton
                  size="small"
                  onClick={() => handleRemoveHotel(hotel.hotelId)}
                  sx={{
                    position: 'absolute',
                    top: 16,
                    right: 12,
                    bgcolor: 'white',
                    boxShadow: 2,
                    zIndex: 1,
                    '&:hover': { 
                      bgcolor: '#f5f5f5',
                      transform: 'scale(1.1)',
                    },
                    transition: 'all 0.2s',
                  }}
                >
                  <Close fontSize="small" />
                </IconButton>
                
                <CardContent sx={{ p: 3 }}>
                  <Box
                    sx={{
                      position: 'absolute',
                      top: 16,
                      left: 12,
                      width: 32,
                      height: 32,
                      borderRadius: '50%',
                      background: colors[index % colors.length],
                      color: 'white',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 700,
                      fontSize: '1rem',
                      boxShadow: 2,
                    }}
                  >
                    {index + 1}
                  </Box>

                  <Box sx={{ mt: 3 }}>
                    <Typography 
                      variant="h6" 
                      fontWeight={700} 
                      sx={{ 
                        mb: 1.5,
                        lineHeight: 1.3,
                        minHeight: 48,
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                      }}
                    >
                      {hotel.name || 'Unknown Hotel'}
                    </Typography>
   
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                      <Box
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 0.5,
                          px: 1.5,
                          py: 0.5,
                          borderRadius: 2,
                          background: '#fff3e0',
                        }}
                      >
                        <Star sx={{ fontSize: 18, color: '#ff9800' }} />
                        <Typography variant="body1" fontWeight={700} sx={{ color: '#f57c00' }}>
                          {hotel.rating || 'N/A'}
                        </Typography>
                      </Box>
                      <Typography variant="body2" color="text.secondary">
                        ({hotel.reviewCount || 0} reviews)
                      </Typography>
                    </Box>

                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 2 }}>
                      <LocationOn sx={{ fontSize: 16, color: '#999' }} />
                      <Typography variant="body2" color="text.secondary">
                        {hotel.distance?.value ? `${hotel.distance.value.toFixed(1)} km` : '0 km'} from city center
                      </Typography>
                    </Box>

                    <Divider sx={{ my: 2 }} />

                    <Box sx={{ mb: 2 }}>
                      <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.5 }}>
                        Price per night
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 0.5 }}>
                        <AttachMoney sx={{ fontSize: 28, color: colors[index % colors.length] }} />
                        <Typography 
                          variant="h4" 
                          fontWeight={800}
                          sx={{ color: colors[index % colors.length] }}
                        >
                          {hotel.price || 0}
                        </Typography>
                      </Box>
                    </Box>

                    <Box sx={{ mb: 2 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                        <Typography variant="caption" fontWeight={600} color="text.secondary">
                          Value Score
                        </Typography>
                        <Typography variant="caption" fontWeight={700} sx={{ color: colors[index % colors.length] }}>
                          {valueData[index].value}%
                        </Typography>
                      </Box>
                      <LinearProgress 
                        variant="determinate" 
                        value={valueData[index].value} 
                        sx={{
                          height: 8,
                          borderRadius: 1,
                          bgcolor: '#f5f5f5',
                          '& .MuiLinearProgress-bar': {
                            bgcolor: colors[index % colors.length],
                            borderRadius: 1,
                          }
                        }}
                      />
                    </Box>

                    {hotel.amenities && hotel.amenities.length > 0 && (
                      <Box>
                        <Typography variant="caption" fontWeight={600} color="text.secondary" sx={{ display: 'block', mb: 1 }}>
                          Top Amenities
                        </Typography>
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                          {hotel.amenities.slice(0, 4).map((amenity, i) => (
                            <Chip 
                              key={i}
                              label={amenity} 
                              size="small" 
                              sx={{ 
                                height: 24,
                                fontSize: '0.7rem',
                                fontWeight: 500,
                                borderColor: colors[index % colors.length],
                                color: colors[index % colors.length],
                              }}
                              variant="outlined"
                            />
                          ))}
                          {hotel.amenities.length > 4 && (
                            <Chip 
                              label={`+${hotel.amenities.length - 4}`}
                              size="small"
                              sx={{
                                height: 24,
                                fontSize: '0.7rem',
                                background: colors[index % colors.length],
                                color: 'white',
                                fontWeight: 600,
                              }}
                            />
                          )}
                        </Box>
                      </Box>
                    )}
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        <Grid container spacing={3} sx={{ mb: 3 }}>
          <Grid item xs={12} lg={6}>
            <Paper 
              sx={{ 
                p: 3, 
                borderRadius: 3, 
                height: '100%',
                border: '1px solid #f0f0f0',
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                <Box
                  sx={{
                    width: 40,
                    height: 40,
                    borderRadius: 2,
                    background: 'linear-gradient(135deg, #667eea15, #764ba215)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <AttachMoney sx={{ color: '#667eea' }} />
                </Box>
                <Box>
                  <Typography variant="h6" fontWeight={700}>
                    Price Comparison
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Lower is better
                  </Typography>
                </Box>
              </Box>
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={priceData} margin={{ top: 10, right: 10, left: 0, bottom: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis 
                    dataKey="name" 
                    tick={{ fontSize: 11, fill: '#666' }}
                    angle={-15}
                    textAnchor="end"
                    height={60}
                  />
                  <YAxis 
                    tick={{ fontSize: 11, fill: '#666' }}
                    label={{ value: "Price ($)", angle: -90, position: "insideLeft", style: { fontSize: 12, fill: '#666' } }}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="price" radius={[12, 12, 0, 0]}>
                    {priceData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </Paper>
          </Grid>

          <Grid item xs={12} lg={6}>
            <Paper 
              sx={{ 
                p: 3, 
                borderRadius: 3, 
                height: '100%',
                border: '1px solid #f0f0f0',
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                <Box
                  sx={{
                    width: 40,
                    height: 40,
                    borderRadius: 2,
                    background: 'linear-gradient(135deg, #ffa72615, #f5761215)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Star sx={{ color: '#ff9800' }} />
                </Box>
                <Box>
                  <Typography variant="h6" fontWeight={700}>
                    Guest Ratings
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Out of 5 stars
                  </Typography>
                </Box>
              </Box>
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={ratingData} margin={{ top: 10, right: 10, left: 0, bottom: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis 
                    dataKey="name" 
                    tick={{ fontSize: 11, fill: '#666' }}
                    angle={-15}
                    textAnchor="end"
                    height={60}
                  />
                  <YAxis 
                    domain={[0, 5]}
                    tick={{ fontSize: 11, fill: '#666' }}
                    label={{ value: "Rating", angle: -90, position: "insideLeft", style: { fontSize: 12, fill: '#666' } }}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="rating" radius={[12, 12, 0, 0]}>
                    {ratingData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </Paper>
          </Grid>

          <Grid item xs={12} lg={6}>
            <Paper 
              sx={{ 
                p: 3, 
                borderRadius: 3, 
                height: '100%',
                border: '1px solid #f0f0f0',
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                <Box
                  sx={{
                    width: 40,
                    height: 40,
                    borderRadius: 2,
                    background: 'linear-gradient(135deg, #4facfe15, #00f2fe15)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <LocationOn sx={{ color: '#4facfe' }} />
                </Box>
                <Box>
                  <Typography variant="h6" fontWeight={700}>
                    Distance from Center
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Closer is better
                  </Typography>
                </Box>
              </Box>
              <ResponsiveContainer width="100%" height={280}>
                <LineChart data={distanceData} margin={{ top: 10, right: 10, left: 0, bottom: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis 
                    dataKey="name" 
                    tick={{ fontSize: 11, fill: '#666' }}
                    angle={-15}
                    textAnchor="end"
                    height={60}
                  />
                  <YAxis 
                    tick={{ fontSize: 11, fill: '#666' }}
                    label={{ value: "Distance (km)", angle: -90, position: "insideLeft", style: { fontSize: 12, fill: '#666' } }}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Line 
                    type="monotone" 
                    dataKey="distance" 
                    stroke="#667eea" 
                    strokeWidth={3}
                    dot={{ fill: '#667eea', r: 7, strokeWidth: 2, stroke: 'white' }}
                    activeDot={{ r: 9 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </Paper>
          </Grid>
        </Grid>

        {hotels.length >= 2 && hotels.length <= 4 && (
          <Paper sx={{ p: 4, borderRadius: 3, mb: 3, border: '1px solid #f0f0f0' }}>
            <Box sx={{ textAlign: 'center', mb: 3 }}>
              <Typography variant="h5" fontWeight={700} sx={{ mb: 1 }}>
                Overall Performance
              </Typography>
              <Typography variant="body2" color="text.secondary">
                360° comparison across all key metrics
              </Typography>
            </Box>
            <ResponsiveContainer width="100%" height={400}>
              <RadarChart data={radarData}>
                <PolarGrid stroke="#e0e0e0" />
                <PolarAngleAxis dataKey="metric" tick={{ fontSize: 12, fill: '#666' }} />
                <PolarRadiusAxis angle={90} domain={[0, 100]} tick={{ fontSize: 10, fill: '#999' }} />
                <Tooltip />
                {hotels.map((hotel, index) => (
                  <Radar
                    key={index}
                    name={hotel.name?.substring(0, 25) || `Hotel ${index + 1}`}
                    dataKey={`Hotel${index + 1}`}
                    stroke={colors[index % colors.length]}
                    fill={colors[index % colors.length]}
                    fillOpacity={0.25}
                    strokeWidth={2}
                  />
                ))}
              </RadarChart>
            </ResponsiveContainer>
          </Paper>
        )}

        <Paper sx={{ p: 4, borderRadius: 3, border: '1px solid #f0f0f0' }}>
          <Typography variant="h5" fontWeight={700} sx={{ mb: 3 }}>
            Detailed Comparison
          </Typography>
          <Box sx={{ overflowX: 'auto' }}>
            <Box component="table" sx={{ width: '100%', borderCollapse: 'separate', borderSpacing: 0 }}>
              <Box component="thead">
                <Box component="tr" sx={{ borderBottom: '2px solid #e0e0e0' }}>
                  <Box 
                    component="th" 
                    sx={{ 
                      p: 2, 
                      textAlign: 'left',
                      fontWeight: 700,
                      fontSize: '0.9rem',
                      color: '#333',
                      position: 'sticky',
                      left: 0,
                      background: 'white',
                      zIndex: 1,
                    }}
                  >
                    Feature
                  </Box>
                  {hotels.map((hotel, index) => (
                    <Box 
                      component="th" 
                      key={index} 
                      sx={{ 
                        p: 2, 
                        textAlign: 'center',
                        fontWeight: 700,
                        fontSize: '0.85rem',
                        color: colors[index % colors.length],
                        minWidth: 140,
                      }}
                    >
                      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0.5 }}>
                        <Avatar 
                          sx={{ 
                            width: 32, 
                            height: 32, 
                            bgcolor: colors[index % colors.length],
                            fontSize: '0.9rem',
                            fontWeight: 700,
                          }}
                        >
                          {index + 1}
                        </Avatar>
                        <Box sx={{ maxWidth: 120 }}>
                          {hotel.name?.substring(0, 25) || `Hotel ${index + 1}`}
                          {hotel.name?.length > 25 && '...'}
                        </Box>
                      </Box>
                    </Box>
                  ))}
                </Box>
              </Box>
              <Box component="tbody">
                {[
                  { label: 'Price per Night', key: 'price', format: (v) => `$${v || 0}`, bgColor: '#fafafa' },
                  { label: 'Guest Rating', key: 'rating', format: (v) => `⭐ ${v || 'N/A'}`, bgColor: 'white' },
                  { label: 'Total Reviews', key: 'reviewCount', format: (v) => (v || 0).toLocaleString(), bgColor: '#fafafa' },
                  { label: 'Distance (km)', key: 'distance', format: (v) => v?.value ? `${v.value.toFixed(1)} km` : 'N/A', bgColor: 'white' },
                  { label: 'Amenities Count', key: 'amenities', format: (v) => `${v?.length || 0} available`, bgColor: '#fafafa' },
                ].map((row, rowIndex) => (
                  <Box component="tr" key={rowIndex} sx={{ borderBottom: '1px solid #f5f5f5' }}>
                    <Box 
                      component="td" 
                      sx={{ 
                        p: 2, 
                        fontWeight: 600,
                        fontSize: '0.85rem',
                        color: '#555',
                        background: row.bgColor,
                        position: 'sticky',
                        left: 0,
                        zIndex: 1,
                      }}
                    >
                      {row.label}
                    </Box>
                    {hotels.map((hotel, colIndex) => (
                      <Box 
                        component="td" 
                        key={colIndex} 
                        sx={{ 
                          p: 2, 
                          textAlign: 'center',
                          fontSize: '0.85rem',
                          fontWeight: 600,
                          background: row.bgColor,
                          color: '#333',
                        }}
                      >
                        {row.format(hotel[row.key])}
                      </Box>
                    ))}
                  </Box>
                ))}
              </Box>
            </Box>
          </Box>
        </Paper>
        <Paper 
          sx={{ 
            mt: 3,
            p: 4, 
            borderRadius: 3,
            background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.05) 0%, rgba(118, 75, 162, 0.05) 100%)',
            border: '2px solid #667eea30',
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
            <Grade sx={{ fontSize: 32, color: '#667eea' }} />
            <Box>
              <Typography variant="h6" fontWeight={700}>
                Our Recommendation
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Based on the comparison above
              </Typography>
            </Box>
          </Box>
          <Grid container spacing={2}>
            <Grid item xs={12} md={4}>
              <Box sx={{ p: 2, bgcolor: 'white', borderRadius: 2, border: '1px solid #e0e0e0' }}>
                <Typography variant="caption" fontWeight={600} color="text.secondary" sx={{ display: 'block', mb: 1 }}>
                  Best Value
                </Typography>
                <Typography variant="body1" fontWeight={700} sx={{ color: '#43e97b' }}>
                  {valueData.reduce((best, curr, idx) => curr.value > valueData[best].value ? idx : best, 0) + 1}. {hotels[valueData.reduce((best, curr, idx) => curr.value > valueData[best].value ? idx : best, 0)]?.name?.substring(0, 30) || 'Unknown'}
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} md={4}>
              <Box sx={{ p: 2, bgcolor: 'white', borderRadius: 2, border: '1px solid #e0e0e0' }}>
                <Typography variant="caption" fontWeight={600} color="text.secondary" sx={{ display: 'block', mb: 1 }}>
                  Highest Rated
                </Typography>
                <Typography variant="body1" fontWeight={700} sx={{ color: '#ff9800' }}>
                  {hotels.reduce((best, curr, idx) => (curr.rating > hotels[best].rating ? idx : best), 0) + 1}. {hotels[hotels.reduce((best, curr, idx) => (curr.rating > hotels[best].rating ? idx : best), 0)]?.name?.substring(0, 30) || 'Unknown'}
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} md={4}>
              <Box sx={{ p: 2, bgcolor: 'white', borderRadius: 2, border: '1px solid #e0e0e0' }}>
                <Typography variant="caption" fontWeight={600} color="text.secondary" sx={{ display: 'block', mb: 1 }}>
                  Most Central
                </Typography>
                <Typography variant="body1" fontWeight={700} sx={{ color: '#4facfe' }}>
                  {hotels.reduce((best, curr, idx) => ((curr.distance?.value || 999) < (hotels[best].distance?.value || 999) ? idx : best), 0) + 1}. {hotels[hotels.reduce((best, curr, idx) => ((curr.distance?.value || 999) < (hotels[best].distance?.value || 999) ? idx : best), 0)]?.name?.substring(0, 30) || 'Unknown'}
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Paper>
      </Box>
    </Fade>
  );
}