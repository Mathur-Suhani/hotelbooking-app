import { useState, useEffect, useRef, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { setResults } from "../redux/hotelSlice";
import HotelCard from "./hotelCard";
import Compare from "./compare";
import {
  Box,
  Container,
  Typography,
  Grid,
  CircularProgress,
  Alert,
  Paper,
  TextField,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Chip,
  InputAdornment,
  Button,
  Collapse,
  Slider,
  Fade,
  Slide,
  IconButton,
  Divider,
} from "@mui/material";
import { 
  Search, 
  ExpandMore, 
  ExpandLess,
  CompareArrows,
  KeyboardArrowUp,
  Hotel,
  TuneRounded,
  LocationOn,
  CalendarToday,
  People,
  Close,
  ArrowBack,
  Refresh,
} from "@mui/icons-material";

export default function HotelSearch() {
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();
  const comparisonRef = useRef(null);
  const observerRef = useRef(null);
  const loadMoreRef = useRef(null);

  const hotels = useSelector((state) => state.hotels.results);
  const compareHotels = useSelector((state) => state.hotels.compare);

  const { city, checkIn, checkOut, adults } = location.state || {
    city: "LON",
    checkIn: "2026-02-25",
    checkOut: "2026-02-28",
    adults: 2,
  };

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [allHotels, setAllHotels] = useState([]);
  
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("popularity");
  const [priceRange, setPriceRange] = useState("all");
  const [minRating, setMinRating] = useState(0);
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);

  const [page, setPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [displayedHotels, setDisplayedHotels] = useState([]);
  const [hasMore, setHasMore] = useState(true);

  const [showComparison, setShowComparison] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  useEffect(() => {
    if (compareHotels.length > 0) {
      setShowComparison(true);
      setTimeout(() => {
        comparisonRef.current?.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'start' 
        });
      }, 100);
    } else {
      setShowComparison(false);
    }
  }, [compareHotels.length]);

  useEffect(() => {
    const fetchHotels = async () => {
      setLoading(true);
      setError(null);
      
      try {
        console.log('Fetching hotels for:', city);
        
        const res = await fetch(
          `https://hotelbooking-app-hvg8.onrender.com/api/hotel-list-with-prices?cityCode=${city}&checkIn=${checkIn}&checkOut=${checkOut}&adults=${adults}`
        );

        if (!res.ok) {
          throw new Error('Failed to fetch hotels');
        }

        const data = await res.json();
        
        console.log('API Response:', data);

        let hotelsArray = Array.isArray(data) ? data : (data.data || []);
        
        console.log(`Loaded ${hotelsArray.length} hotels`);
        
        setAllHotels(hotelsArray);
        
      } catch (err) {
        console.error("Error fetching hotels:", err);
        setError(err.message);
        setAllHotels([]);
      } finally {
        setLoading(false);
      }
    };

    fetchHotels();
  }, [city, checkIn, checkOut, adults, dispatch]);

  useEffect(() => {
    let filtered = [...allHotels];

    if (searchTerm) {
      filtered = filtered.filter(hotel => 
        hotel.name?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (priceRange !== "all") {
      const [min, max] = priceRange.split('-').map(Number);
      filtered = filtered.filter(hotel => 
        hotel.price >= min && hotel.price <= max
      );
    }

    if (minRating > 0) {
      filtered = filtered.filter(hotel => 
        Number(hotel.rating) >= minRating
      );
    }

    switch (sortBy) {
      case 'price-low':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        filtered.sort((a, b) => b.rating - a.rating);
        break;
      case 'distance':
        filtered.sort((a, b) => (a.distance?.value || 999) - (b.distance?.value || 999));
        break;
      default: 
        break;
    }

    dispatch(setResults(filtered));
 
    setPage(1);
  }, [searchTerm, sortBy, priceRange, minRating, allHotels, dispatch]);

  useEffect(() => {
    const startIndex = 0;
    const endIndex = page * itemsPerPage;
    const paginatedHotels = hotels.slice(startIndex, endIndex);
    
    setDisplayedHotels(paginatedHotels);
    setHasMore(endIndex < hotels.length);
  }, [hotels, page, itemsPerPage]);

  const handleLoadMore = useCallback(() => {
    if (hasMore) {
      setPage(prev => prev + 1);
    }
  }, [hasMore]);

  useEffect(() => {
    const options = {
      root: null,
      rootMargin: '100px',
      threshold: 0.1,
    };

    observerRef.current = new IntersectionObserver((entries) => {
      const [entry] = entries;
      if (entry.isIntersecting && hasMore && !loading) {
        handleLoadMore();
      }
    }, options);

    const currentLoadMoreRef = loadMoreRef.current;
    if (currentLoadMoreRef) {
      observerRef.current.observe(currentLoadMoreRef);
    }

    return () => {
      if (currentLoadMoreRef && observerRef.current) {
        observerRef.current.unobserve(currentLoadMoreRef);
      }
    };
  }, [hasMore, loading, handleLoadMore]);

  const scrollToComparison = () => {
    comparisonRef.current?.scrollIntoView({ 
      behavior: 'smooth', 
      block: 'start' 
    });
  };

  const handleRefresh = () => {
    window.location.reload();
  };

  const getActiveFiltersCount = () => {
    let count = 0;
    if (searchTerm) count++;
    if (priceRange !== "all") count++;
    if (minRating > 0) count++;
    if (sortBy !== "popularity") count++;
    return count;
  };

  const clearFilters = () => {
    setSearchTerm("");
    setPriceRange("all");
    setMinRating(0);
    setSortBy("popularity");
  };

  return (
    <Box 
      sx={{ 
        bgcolor: '#f5f7fa', 
        minHeight: '100vh',
        position: 'relative',
      }}
    >
      <Box
        sx={{
          background: "rgba(255, 255, 255, 0.95)",
          backdropFilter: "blur(20px)",
          boxShadow: "0 2px 20px rgba(0,0,0,0.08)",
          py: 2,
          px: 3,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          position: "sticky",
          top: 0,
          zIndex: 1100,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <IconButton 
            onClick={() => navigate(-1)}
            sx={{
              color: '#666',
              '&:hover': { 
                bgcolor: '#f5f5f5',
                color: '#667eea',
              }
            }}
          >
            <ArrowBack />
          </IconButton>
          
          <Box>
            <Typography
              variant="h6"
              sx={{
                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                backgroundClip: "text",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                fontWeight: 800,
                fontFamily: "'Poppins', sans-serif",
                letterSpacing: "-0.5px",
              }}
            >
              StayFinder
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
              <LocationOn sx={{ fontSize: 14, color: '#999' }} />
              <Typography variant="caption" sx={{ color: '#666', fontWeight: 500 }}>
                {city} • {checkIn} to {checkOut}
              </Typography>
            </Box>
          </Box>
        </Box>

        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Chip
            icon={<CalendarToday sx={{ fontSize: 16 }} />}
            label={`${Math.ceil((new Date(checkOut) - new Date(checkIn)) / (1000 * 60 * 60 * 24))} nights`}
            size="small"
            sx={{
              background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.1), rgba(118, 75, 162, 0.1))',
              fontWeight: 600,
              display: { xs: "none", sm: "flex" },
            }}
          />
          <Chip
            icon={<People sx={{ fontSize: 16 }} />}
            label={`${adults} guest${adults > 1 ? 's' : ''}`}
            size="small"
            sx={{
              background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.1), rgba(118, 75, 162, 0.1))',
              fontWeight: 600,
              display: { xs: "none", sm: "flex" },
            }}
          />
          <IconButton 
            onClick={handleRefresh}
            sx={{
              color: '#666',
              '&:hover': { 
                bgcolor: '#f5f5f5',
                color: '#667eea',
              }
            }}
          >
            <Refresh />
          </IconButton>
        </Box>
      </Box>

      <Container maxWidth="lg" sx={{ pt: 3, pb: 6 }}>
        <Slide direction="down" in={compareHotels.length > 0} mountOnEnter unmountOnExit>
          <Paper
            elevation={4}
            sx={{
              position: 'sticky',
              top: 80,
              zIndex: 1000,
              mb: 3,
              p: 2.5,
              borderRadius: 3,
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              boxShadow: '0 8px 32px rgba(102, 126, 234, 0.4)',
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Box
                sx={{
                  width: 48,
                  height: 48,
                  borderRadius: 2,
                  background: 'rgba(255,255,255,0.2)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backdropFilter: 'blur(10px)',
                }}
              >
                <CompareArrows sx={{ fontSize: 28 }} />
              </Box>
              <Box>
                <Typography variant="h6" fontWeight={700}>
                  {compareHotels.length} Hotel{compareHotels.length > 1 ? 's' : ''} Selected
                </Typography>
                <Typography variant="body2" sx={{ opacity: 0.9 }}>
                  Ready to compare side-by-side
                </Typography>
              </Box>
            </Box>
            <Button
              variant="contained"
              onClick={scrollToComparison}
              sx={{
                bgcolor: 'white',
                color: '#667eea',
                fontWeight: 700,
                px: 3,
                py: 1.2,
                borderRadius: 2,
                boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                '&:hover': {
                  bgcolor: '#f5f5f5',
                  transform: 'translateY(-2px)',
                  boxShadow: '0 6px 16px rgba(0,0,0,0.2)',
                },
                transition: 'all 0.3s ease',
              }}
            >
              View Comparison
            </Button>
          </Paper>
        </Slide>

        <Box sx={{ mb: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Box>
              <Typography variant="h4" fontWeight={800} sx={{ mb: 0.5 }}>
                {loading ? 'Searching...' : `${hotels.length} Properties Found`}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Best deals for your stay in {city}
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', gap: 1 }}>
              {getActiveFiltersCount() > 0 && (
                <Chip
                  label={`${getActiveFiltersCount()} filter${getActiveFiltersCount() > 1 ? 's' : ''} active`}
                  onDelete={clearFilters}
                  deleteIcon={<Close sx={{ fontSize: 18 }} />}
                  sx={{ 
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    color: 'white',
                    fontWeight: 600,
                    '& .MuiChip-deleteIcon': {
                      color: 'rgba(255,255,255,0.8)',
                      '&:hover': {
                        color: 'white',
                      }
                    }
                  }}
                />
              )}
              <Chip
                icon={<Hotel sx={{ fontSize: 18 }} />}
                label={`${hotels.length} Properties`}
                sx={{ 
                  background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.15), rgba(118, 75, 162, 0.15))',
                  fontWeight: 600,
                  border: '1px solid #667eea30',
                }}
              />
            </Box>
          </Box>

          <Paper 
            sx={{ 
              p: 3, 
              borderRadius: 3, 
              boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
              border: '1px solid #f0f0f0',
            }}
          >
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={12} md={3}>
                <TextField
                  fullWidth
                  size="medium"
                  placeholder="Search by hotel name..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Search sx={{ color: '#999' }} />
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                      background: '#f8f9fa',
                      '& fieldset': {
                        border: '2px solid transparent',
                      },
                      '&:hover': {
                        background: '#f0f1f3',
                        '& fieldset': {
                          border: '2px solid #e0e0e0',
                        },
                      },
                      '&.Mui-focused': {
                        background: 'white',
                        '& fieldset': {
                          border: '2px solid #667eea',
                        },
                      },
                    }
                  }}
                />
              </Grid>

              <Grid item xs={6} md={2.25}>
                <FormControl fullWidth size="medium">
                  <InputLabel>Sort By</InputLabel>
                  <Select
                    value={sortBy}
                    label="Sort By"
                    onChange={(e) => setSortBy(e.target.value)}
                    sx={{
                      borderRadius: 2,
                      background: '#f8f9fa',
                      '& fieldset': {
                        border: '2px solid transparent',
                      },
                      '&:hover': {
                        background: '#f0f1f3',
                        '& fieldset': {
                          border: '2px solid #e0e0e0',
                        },
                      },
                      '&.Mui-focused': {
                        background: 'white',
                        '& fieldset': {
                          border: '2px solid #667eea',
                        },
                      },
                    }}
                  >
                    <MenuItem value="popularity">Popularity</MenuItem>
                    <MenuItem value="price-low">Price: Low to High</MenuItem>
                    <MenuItem value="price-high">Price: High to Low</MenuItem>
                    <MenuItem value="rating">User Rating</MenuItem>
                    <MenuItem value="distance">Distance</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={6} md={2.25}>
                <FormControl fullWidth size="medium">
                  <InputLabel>Price Range</InputLabel>
                  <Select
                    value={priceRange}
                    label="Price Range"
                    onChange={(e) => setPriceRange(e.target.value)}
                    sx={{
                      borderRadius: 2,
                      background: '#f8f9fa',
                      '& fieldset': {
                        border: '2px solid transparent',
                      },
                      '&:hover': {
                        background: '#f0f1f3',
                        '& fieldset': {
                          border: '2px solid #e0e0e0',
                        },
                      },
                      '&.Mui-focused': {
                        background: 'white',
                        '& fieldset': {
                          border: '2px solid #667eea',
                        },
                      },
                    }}
                  >
                    <MenuItem value="all">All Prices</MenuItem>
                    <MenuItem value="0-75">Under $75</MenuItem>
                    <MenuItem value="75-150">$75 - $150</MenuItem>
                    <MenuItem value="150-250">$150 - $250</MenuItem>
                    <MenuItem value="250-99999">$250+</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={6} md={2.25}>
                <FormControl fullWidth size="medium">
                  <InputLabel>Min Rating</InputLabel>
                  <Select
                    value={minRating}
                    label="Min Rating"
                    onChange={(e) => setMinRating(e.target.value)}
                    sx={{
                      borderRadius: 2,
                      background: '#f8f9fa',
                      '& fieldset': {
                        border: '2px solid transparent',
                      },
                      '&:hover': {
                        background: '#f0f1f3',
                        '& fieldset': {
                          border: '2px solid #e0e0e0',
                        },
                      },
                      '&.Mui-focused': {
                        background: 'white',
                        '& fieldset': {
                          border: '2px solid #667eea',
                        },
                      },
                    }}
                  >
                    <MenuItem value={0}>All Ratings</MenuItem>
                    <MenuItem value={3}>3+ Stars</MenuItem>
                    <MenuItem value={3.5}>3.5+ Stars</MenuItem>
                    <MenuItem value={4}>4+ Stars</MenuItem>
                    <MenuItem value={4.5}>4.5+ Stars</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={6} md={2.25}>
                <Button
                  fullWidth
                  variant="outlined"
                  onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
                  startIcon={<TuneRounded />}
                  endIcon={showAdvancedFilters ? <ExpandLess /> : <ExpandMore />}
                  sx={{
                    py: 1.8,
                    borderRadius: 2,
                    borderColor: '#e0e0e0',
                    color: '#666',
                    fontWeight: 600,
                    textTransform: 'none',
                    '&:hover': {
                      borderColor: '#667eea',
                      background: 'rgba(102, 126, 234, 0.05)',
                      color: '#667eea',
                    }
                  }}
                >
                  More Filters
                </Button>
              </Grid>
            </Grid>

            <Collapse in={showAdvancedFilters}>
              <Box sx={{ mt: 3, pt: 3, borderTop: '2px solid #f0f0f0' }}>
                <Typography variant="body1" fontWeight={700} sx={{ mb: 2, color: '#333' }}>
                  Additional Filters
                </Typography>
                <Grid container spacing={3}>
                  <Grid item xs={12} md={4}>
                    <Typography variant="body2" fontWeight={600} color="text.secondary" sx={{ mb: 1 }}>
                      Distance from Center (km)
                    </Typography>
                    <Slider
                      defaultValue={5}
                      min={0}
                      max={10}
                      step={0.5}
                      marks={[
                        { value: 0, label: '0' },
                        { value: 5, label: '5' },
                        { value: 10, label: '10+' },
                      ]}
                      valueLabelDisplay="auto"
                      sx={{ 
                        color: '#667eea',
                        '& .MuiSlider-markLabel': {
                          fontSize: '0.75rem',
                        }
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <FormControl fullWidth size="medium">
                      <InputLabel>Amenities</InputLabel>
                      <Select
                        multiple
                        defaultValue={[]}
                        label="Amenities"
                        sx={{
                          borderRadius: 2,
                          background: '#f8f9fa',
                        }}
                      >
                        <MenuItem value="WiFi">Free WiFi</MenuItem>
                        <MenuItem value="Parking">Free Parking</MenuItem>
                        <MenuItem value="Pool">Swimming Pool</MenuItem>
                        <MenuItem value="Restaurant">Restaurant</MenuItem>
                        <MenuItem value="Gym">Fitness Center</MenuItem>
                        <MenuItem value="Spa">Spa & Wellness</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <FormControl fullWidth size="medium">
                      <InputLabel>Property Type</InputLabel>
                      <Select
                        defaultValue="all"
                        label="Property Type"
                        sx={{
                          borderRadius: 2,
                          background: '#f8f9fa',
                        }}
                      >
                        <MenuItem value="all">All Types</MenuItem>
                        <MenuItem value="hotel">Hotel</MenuItem>
                        <MenuItem value="resort">Resort</MenuItem>
                        <MenuItem value="apartment">Apartment</MenuItem>
                        <MenuItem value="villa">Villa</MenuItem>
                        <MenuItem value="boutique">Boutique Hotel</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                </Grid>
              </Box>
            </Collapse>
          </Paper>
        </Box>

        {error && (
          <Fade in>
            <Alert 
              severity="error" 
              sx={{ 
                mb: 3, 
                borderRadius: 2,
                boxShadow: '0 4px 12px rgba(244, 67, 54, 0.15)',
              }}
            >
              <Typography variant="body1" fontWeight={600}>
                {error}
              </Typography>
              <Typography variant="body2">
                Please try again or adjust your search criteria
              </Typography>
            </Alert>
          </Fade>
        )}

        {loading ? (
          <Box 
            sx={{ 
              textAlign: 'center', 
              py: 12,
            }}
          >
            <CircularProgress 
              size={60} 
              thickness={4}
              sx={{ 
                color: '#667eea',
                mb: 3,
              }} 
            />
            <Typography variant="h6" fontWeight={600} sx={{ mb: 1 }}>
              Finding the best hotels for you...
            </Typography>
            <Typography variant="body2" color="text.secondary">
              This won't take long
            </Typography>
          </Box>
        ) : hotels.length === 0 ? (
          <Fade in>
            <Paper 
              sx={{ 
                p: 8, 
                textAlign: 'center', 
                borderRadius: 3,
                background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.05) 0%, rgba(118, 75, 162, 0.05) 100%)',
                border: '2px dashed #e0e0e0',
              }}
            >
              <Box
                sx={{
                  width: 100,
                  height: 100,
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.1), rgba(118, 75, 162, 0.1))',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 24px',
                }}
              >
                <Search sx={{ fontSize: 48, color: '#667eea' }} />
              </Box>
              <Typography variant="h5" fontWeight={700} gutterBottom>
                No Hotels Found
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ mb: 3, maxWidth: 400, mx: 'auto' }}>
                Try adjusting your filters or search for a different destination
              </Typography>
              <Button
                variant="contained"
                onClick={clearFilters}
                sx={{
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  fontWeight: 600,
                  px: 4,
                  py: 1.2,
                  borderRadius: 2,
                  textTransform: 'none',
                  boxShadow: '0 4px 12px rgba(102, 126, 234, 0.3)',
                  '&:hover': {
                    boxShadow: '0 6px 16px rgba(102, 126, 234, 0.4)',
                  }
                }}
              >
                Clear All Filters
              </Button>
            </Paper>
          </Fade>
        ) : (
          <>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
              {displayedHotels.map((hotel, index) => (
                <Fade in key={hotel?.hotelId || index} timeout={300 + (index * 50)}>
                  <div>
                    <HotelCard hotel={hotel} />
                  </div>
                </Fade>
              ))}
            </Box>

            {hasMore && (
              <Box 
                ref={loadMoreRef}
                sx={{ 
                  display: 'flex', 
                  flexDirection: 'column',
                  justifyContent: 'center', 
                  alignItems: 'center',
                  mt: 5,
                  py: 3
                }}
              >
                <CircularProgress size={40} thickness={4} sx={{ color: '#667eea', mb: 2 }} />
                <Typography variant="body2" color="text.secondary" fontWeight={500}>
                  Loading more hotels...
                </Typography>
              </Box>
            )}

            {!hasMore && displayedHotels.length > 0 && (
              <Box sx={{ textAlign: 'center', mt: 5, mb: 3 }}>
                <Divider sx={{ mb: 3 }}>
                  <Chip 
                    label="You've reached the end" 
                    sx={{ 
                      fontWeight: 600,
                      background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.1), rgba(118, 75, 162, 0.1))',
                    }}
                  />
                </Divider>
                <Typography variant="body1" color="text.secondary" sx={{ mb: 1 }}>
                  Showing all {hotels.length} hotel{hotels.length > 1 ? 's' : ''}
                </Typography>
                <Button
                  variant="outlined"
                  onClick={scrollToTop}
                  startIcon={<KeyboardArrowUp />}
                  sx={{
                    mt: 2,
                    borderColor: '#667eea',
                    color: '#667eea',
                    fontWeight: 600,
                    textTransform: 'none',
                    borderRadius: 2,
                    px: 3,
                    '&:hover': {
                      borderColor: '#5568d3',
                      background: 'rgba(102, 126, 234, 0.05)',
                    }
                  }}
                >
                  Back to Top
                </Button>
              </Box>
            )}

            <Box sx={{ textAlign: 'center', mt: 3 }}>
              <Chip
                label={`Showing ${displayedHotels.length} of ${hotels.length} hotels`}
                sx={{
                  fontWeight: 600,
                  background: 'white',
                  border: '1px solid #e0e0e0',
                }}
              />
            </Box>
          </>
        )}

        {showComparison && (
          <Box ref={comparisonRef} sx={{ mt: 6, pt: 4 }}>
            <Compare hotels={compareHotels} />
          </Box>
        )}
      </Container>

      <Fade in={showScrollTop}>
        <IconButton
          onClick={scrollToTop}
          sx={{
            position: 'fixed',
            bottom: 32,
            right: 32,
            width: 56,
            height: 56,
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
            boxShadow: '0 8px 24px rgba(102, 126, 234, 0.4)',
            zIndex: 1000,
            '&:hover': {
              background: 'linear-gradient(135deg, #5568d3 0%, #6a3f8f 100%)',
              boxShadow: '0 12px 32px rgba(102, 126, 234, 0.5)',
              transform: 'translateY(-4px)',
            },
            transition: 'all 0.3s ease',
          }}
        >
          <KeyboardArrowUp />
        </IconButton>
      </Fade>
    </Box>
  );
}