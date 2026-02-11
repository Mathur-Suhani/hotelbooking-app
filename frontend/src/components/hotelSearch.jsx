import { useState, useEffect, useRef, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
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
} from "@mui/material";
import { 
  Search, 
  FilterList, 
  ExpandMore, 
  ExpandLess,
  CompareArrows,
  KeyboardArrowUp,
} from "@mui/icons-material";

export default function HotelSearch() {
  const dispatch = useDispatch();
  const location = useLocation();
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
          `http://localhost:5000/api/hotel-list-with-prices?cityCode=${city}&checkIn=${checkIn}&checkOut=${checkOut}&adults=${adults}`
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

  return (
    <Box sx={{ bgcolor: '#f8f8f8', minHeight: '100vh', pt: 2, pb: 4 }}>
      <Container maxWidth="lg">
        <Slide direction="down" in={compareHotels.length > 0} mountOnEnter unmountOnExit>
          <Paper
            elevation={4}
            sx={{
              position: 'sticky',
              top: 16,
              zIndex: 1000,
              mb: 2,
              p: 2,
              borderRadius: 2,
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <CompareArrows sx={{ fontSize: 32 }} />
              <Box>
                <Typography variant="h6" fontWeight={700}>
                  {compareHotels.length} {compareHotels.length === 1 ? 'Hotel' : 'Hotels'} Selected
                </Typography>
                <Typography variant="body2" sx={{ opacity: 0.9 }}>
                  {compareHotels.length < 2 
                    ? 'Select at least one more hotel to compare'
                    : `Ready to compare ${compareHotels.length} hotels`
                  }
                </Typography>
              </Box>
            </Box>
            <Button
              variant="contained"
              size="large"
              onClick={scrollToComparison}
              startIcon={<KeyboardArrowUp />}
              sx={{
                bgcolor: 'white',
                color: '#667eea',
                fontWeight: 700,
                px: 3,
                '&:hover': {
                  bgcolor: '#f5f5f5',
                  transform: 'translateY(-2px)',
                },
                transition: 'all 0.3s',
              }}
            >
              {compareHotels.length >= 2 ? 'VIEW COMPARISON' : 'VIEW SELECTED'}
            </Button>
          </Paper>
        </Slide>

        <Box ref={comparisonRef}>
          <Collapse in={showComparison && compareHotels.length > 0}>
            <Paper sx={{ p: 3, mb: 3, borderRadius: 2, boxShadow: 3 }}>
              <Compare hotels={compareHotels} />
            </Paper>
          </Collapse>
        </Box>

        <Box sx={{ mb: 2 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1.5 }}>
            <Box>
              <Typography variant="h5" fontWeight={700} sx={{ mb: 0.5 }}>
                {loading ? "Searching hotels..." : `${hotels.length} Hotels in ${city}`}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {checkIn} - {checkOut} • {adults} Adult{adults > 1 ? 's' : ''}
              </Typography>
            </Box>
            
            <Chip 
              label={`${hotels.length} Properties`}
              sx={{ 
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: 'white',
                fontWeight: 600,
                fontSize: '0.85rem',
                height: 32,
              }}
            />
          </Box>

          <Paper sx={{ p: 2, borderRadius: 1, boxShadow: 1 }}>
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={12} md={3}>
                <TextField
                  fullWidth
                  size="small"
                  placeholder="Search hotels..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Search fontSize="small" />
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      fontSize: '0.9rem',
                    }
                  }}
                />
              </Grid>

              <Grid item xs={6} md={2}>
                <FormControl fullWidth size="small">
                  <InputLabel sx={{ fontSize: '0.9rem' }}>Sort By</InputLabel>
                  <Select
                    value={sortBy}
                    label="Sort By"
                    onChange={(e) => setSortBy(e.target.value)}
                    sx={{ fontSize: '0.9rem' }}
                  >
                    <MenuItem value="popularity">Popularity</MenuItem>
                    <MenuItem value="price-low">Price: Low to High</MenuItem>
                    <MenuItem value="price-high">Price: High to Low</MenuItem>
                    <MenuItem value="rating">User Rating</MenuItem>
                    <MenuItem value="distance">Distance</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={6} md={2}>
                <FormControl fullWidth size="small">
                  <InputLabel sx={{ fontSize: '0.9rem' }}>Price Range</InputLabel>
                  <Select
                    value={priceRange}
                    label="Price Range"
                    onChange={(e) => setPriceRange(e.target.value)}
                    sx={{ fontSize: '0.9rem' }}
                  >
                    <MenuItem value="all">All Prices</MenuItem>
                    <MenuItem value="0-75">Under $75</MenuItem>
                    <MenuItem value="75-150">$75 - $150</MenuItem>
                    <MenuItem value="150-250">$150 - $250</MenuItem>
                    <MenuItem value="250-99999">$250+</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={6} md={2}>
                <FormControl fullWidth size="small">
                  <InputLabel sx={{ fontSize: '0.9rem' }}>Min Rating</InputLabel>
                  <Select
                    value={minRating}
                    label="Min Rating"
                    onChange={(e) => setMinRating(e.target.value)}
                    sx={{ fontSize: '0.9rem' }}
                  >
                    <MenuItem value={0}>All Ratings</MenuItem>
                    <MenuItem value={3}>3+ Stars</MenuItem>
                    <MenuItem value={3.5}>3.5+ Stars</MenuItem>
                    <MenuItem value={4}>4+ Stars</MenuItem>
                    <MenuItem value={4.5}>4.5+ Stars</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={6} md={3}>
                <Box 
                  sx={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: 1,
                    color: 'text.secondary',
                    cursor: 'pointer',
                    '&:hover': { color: '#667eea' }
                  }}
                  onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
                >
                  <FilterList fontSize="small" />
                  <Typography variant="body2" sx={{ fontSize: '0.9rem' }}>
                    Advanced Filters
                  </Typography>
                  {showAdvancedFilters ? <ExpandLess /> : <ExpandMore />}
                </Box>
              </Grid>
            </Grid>

            <Collapse in={showAdvancedFilters}>
              <Box sx={{ mt: 2, pt: 2, borderTop: '1px solid #e0e0e0' }}>
                <Typography variant="body2" fontWeight={600} sx={{ mb: 1 }}>
                  Additional Filters
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12} md={4}>
                    <Typography variant="caption" color="text.secondary">
                      Distance from Center (km)
                    </Typography>
                    <Slider
                      defaultValue={5}
                      min={0}
                      max={10}
                      step={0.5}
                      marks
                      valueLabelDisplay="auto"
                      sx={{ color: '#667eea' }}
                    />
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <FormControl fullWidth size="small">
                      <InputLabel>Amenities</InputLabel>
                      <Select
                        multiple
                        defaultValue={[]}
                        label="Amenities"
                        sx={{ fontSize: '0.9rem' }}
                      >
                        <MenuItem value="WiFi">WiFi</MenuItem>
                        <MenuItem value="Parking">Parking</MenuItem>
                        <MenuItem value="Pool">Pool</MenuItem>
                        <MenuItem value="Restaurant">Restaurant</MenuItem>
                        <MenuItem value="Gym">Gym</MenuItem>
                        <MenuItem value="Spa">Spa</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <FormControl fullWidth size="small">
                      <InputLabel>Property Type</InputLabel>
                      <Select
                        defaultValue="all"
                        label="Property Type"
                        sx={{ fontSize: '0.9rem' }}
                      >
                        <MenuItem value="all">All Types</MenuItem>
                        <MenuItem value="hotel">Hotel</MenuItem>
                        <MenuItem value="resort">Resort</MenuItem>
                        <MenuItem value="apartment">Apartment</MenuItem>
                        <MenuItem value="villa">Villa</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                </Grid>
              </Box>
            </Collapse>
          </Paper>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 2, borderRadius: 1 }}>
            {error}
          </Alert>
        )}

        {loading ? (
          <Box textAlign="center" py={10}>
            <CircularProgress size={50} sx={{ color: '#667eea' }} />
            <Typography variant="body1" color="text.secondary" mt={2}>
              Finding the best hotels for you...
            </Typography>
          </Box>
        ) : hotels.length === 0 ? (
          <Paper sx={{ p: 6, textAlign: 'center', borderRadius: 2 }}>
            <Typography variant="h6" color="text.secondary" gutterBottom>
              No hotels found
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Try adjusting your filters or search for a different city
            </Typography>
          </Paper>
        ) : (
          <>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {displayedHotels.map((hotel, index) => (
                <HotelCard key={hotel?.hotelId || index} hotel={hotel} />
              ))}
            </Box>

            {hasMore && (
              <Box 
                ref={loadMoreRef}
                sx={{ 
                  display: 'flex', 
                  justifyContent: 'center', 
                  alignItems: 'center',
                  mt: 4,
                  py: 3
                }}
              >
                <CircularProgress size={40} sx={{ color: '#667eea' }} />
              </Box>
            )}

            {!hasMore && displayedHotels.length > 0 && (
              <Box sx={{ textAlign: 'center', mt: 4, mb: 2 }}>
                <Typography variant="body2" color="text.secondary">
                  You've reached the end of the results ({hotels.length} hotels total)
                </Typography>
              </Box>
            )}

            <Box sx={{ textAlign: 'center', mt: 2 }}>
              <Typography variant="caption" color="text.secondary">
                Showing {displayedHotels.length} of {hotels.length} hotels
              </Typography>
            </Box>
          </>
        )}
      </Container>
    </Box>
  );
}