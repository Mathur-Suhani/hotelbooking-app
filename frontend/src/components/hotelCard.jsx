import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Button,
  Box,
  Chip,
  Rating,
  Divider,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { addToCompare, removeFromCompare } from "../redux/hotelSlice";
import { 
  LocationOn, 
  Wifi, 
  LocalParking, 
  Restaurant,
  Pool,
  CheckCircle,
  RadioButtonUnchecked,
} from "@mui/icons-material";

export default function HotelCard({ hotel }) {
  const dispatch = useDispatch();
  const compareHotels = useSelector((state) => state.hotels.compare);

  const isSelected = compareHotels.some(h => h.hotelId === hotel.hotelId);

  const hotelId = hotel?.hotelId || "N/A";
  const hotelName = hotel?.name || "Hotel";
  const cityName = hotel?.address?.cityName || hotel?.iataCode || "LONDON";
  const distance = hotel?.distance?.value 
    ? `${hotel.distance.value.toFixed(1)} km from center` 
    : "0.8 km from center";
  
  const price = hotel?.price || 120;
  const currency = hotel?.currency || 'USD';
  const rating = parseFloat(hotel?.rating) || 4.2;
  const reviewCount = hotel?.reviewCount || 250;
  const amenities = hotel?.amenities || ['WiFi', 'Parking', 'Pool'];

  const imageIndex = hotelName.length % 20;
  const fallbackImages = [
    'https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1582719508461-905c673771fd?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1584132967334-10e028bd69f7?w=800&h=600&fit=crop',
  ];
  
  const hotelImage = fallbackImages[imageIndex % fallbackImages.length];

  const amenityIcons = {
    'WiFi': <Wifi fontSize="small" />,
    'Parking': <LocalParking fontSize="small" />,
    'Pool': <Pool fontSize="small" />,
    'Restaurant': <Restaurant fontSize="small" />
  };

  const currencySymbol = currency === 'USD' ? '$' : currency === 'GBP' ? '£' : currency;

  const handleSelectToggle = () => {
    if (isSelected) {
      dispatch(removeFromCompare(hotel.hotelId));
    } else {
      dispatch(addToCompare(hotel));
    }
  };

  return (
    <Card 
      sx={{ 
        display: 'flex',
        height: 240,
        transition: 'all 0.3s',
        position: 'relative',
        '&:hover': {
          boxShadow: isSelected ? '0 8px 30px rgba(102, 126, 234, 0.3)' : '0 4px 20px rgba(0,0,0,0.12)',
          transform: 'translateY(-2px)',
        },
        borderRadius: 2,
        overflow: 'hidden',
        border: isSelected ? '3px solid #667eea' : '1px solid #e0e0e0',
        bgcolor: isSelected ? 'rgba(102, 126, 234, 0.03)' : 'white',
      }}
    >

      {isSelected && (
        <Box
          sx={{
            position: 'absolute',
            top: 12,
            left: 12,
            zIndex: 2,
            background: '#667eea',
            borderRadius: '50%',
            width: 32,
            height: 32,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 2px 8px rgba(102, 126, 234, 0.5)',
          }}
        >
          <CheckCircle sx={{ color: 'white', fontSize: 24 }} />
        </Box>
      )}

      <Box sx={{ position: 'relative', width: 260, flexShrink: 0 }}>
        <CardMedia
          component="img"
          sx={{ 
            width: '100%', 
            height: '100%', 
            objectFit: 'cover',
            filter: isSelected ? 'brightness(0.95)' : 'none',
          }}
          image={hotelImage}
          alt={hotelName}
          onError={(e) => {
            e.target.src = fallbackImages[0];
          }}
        />
      </Box>

      <Box sx={{ display: 'flex', flexDirection: 'column', flex: 1, minWidth: 0 }}>
        <CardContent sx={{ flex: '1 0 auto', p: 2, pb: 1 }}>
          <Typography 
            variant="h6" 
            fontWeight={700}
            sx={{ 
              mb: 0.5,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              fontSize: '1.1rem',
            }}
          >
            {hotelName}
          </Typography>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
            <Rating value={rating} precision={0.1} size="small" readOnly sx={{ fontSize: '1rem' }} />
            <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.85rem' }}>
              {rating} ({reviewCount} reviews)
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 1.5 }}>
            <LocationOn sx={{ fontSize: 16, color: 'text.secondary' }} />
            <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.85rem' }}>
              {cityName} • {distance}
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mb: 1 }}>
            {amenities.slice(0, 4).map((amenity, index) => (
              <Chip
                key={index}
                icon={amenityIcons[amenity]}
                label={amenity}
                size="small"
                variant="outlined"
                sx={{ 
                  height: 24,
                  borderColor: '#e0e0e0',
                  color: 'text.secondary',
                  fontSize: '0.75rem',
                  '& .MuiChip-icon': {
                    fontSize: 14,
                  }
                }}
              />
            ))}
          </Box>

          <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.7rem' }}>
            Hotel ID: {hotelId}
          </Typography>
        </CardContent>

        <Divider />

        <Box 
          sx={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            px: 2,
            py: 1.5,
            bgcolor: isSelected ? 'rgba(102, 126, 234, 0.05)' : '#fafafa',
          }}
        >
          <Box>
            <Typography variant="caption" color="text.secondary" display="block" sx={{ fontSize: '0.7rem' }}>
              Price per night
            </Typography>
            <Typography 
              variant="h5" 
              fontWeight={700}
              sx={{
                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                fontSize: '1.5rem',
                lineHeight: 1.2,
              }}
            >
              {currencySymbol}{price}
            </Typography>
            <Typography variant="caption" sx={{ color: 'success.main', fontSize: '0.7rem' }}>
              ✓ Free cancellation
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button
              variant={isSelected ? "contained" : "outlined"}
              size="small"
              onClick={handleSelectToggle}
              startIcon={isSelected ? <CheckCircle /> : <RadioButtonUnchecked />}
              sx={{
                borderColor: '#667eea',
                color: isSelected ? 'white' : '#667eea',
                background: isSelected ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' : 'transparent',
                fontSize: '0.75rem',
                px: 2,
                fontWeight: 600,
                '&:hover': {
                  borderColor: '#5568d3',
                  bgcolor: isSelected ? 'linear-gradient(135deg, #5568d3 0%, #6b3f8f 100%)' : 'rgba(102, 126, 234, 0.04)',
                },
                transition: 'all 0.3s',
              }}
            >
              {isSelected ? 'SELECTED' : 'SELECT'}
            </Button>
            <Button
              variant="contained"
              size="small"
              sx={{
                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                fontSize: '0.75rem',
                px: 2,
                '&:hover': {
                  background: "linear-gradient(135deg, #5568d3 0%, #6b3f8f 100%)",
                }
              }}
            >
              VIEW DETAILS
            </Button>
          </Box>
        </Box>
      </Box>
    </Card>
  );
}