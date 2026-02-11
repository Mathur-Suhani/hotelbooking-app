import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { clearUser } from "../redux/userSlice";
import { supabase } from "../supabaseClient";
import { POPULAR_CITIES } from "../api/cityCodes";
import {
  Box,
  Container,
  Typography,
  Button,
  TextField,
  Paper,
  Grid,
  IconButton,
  MenuItem,
  Select,
  FormControl,
  Card,
  CardContent,
} from "@mui/material";
import {
  ExitToApp,
  Hotel,
  Home,
  BeachAccess,
  FavoriteBorder,
  Luggage,
  TrendingUp,
  Verified,
  Security,
  Support,
} from "@mui/icons-material";

const Dashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.user?.user);

  const [city, setCity] = useState("");
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [rooms, setRooms] = useState(1);
  const [adults, setAdults] = useState(2);
  const [childrens, setChildrens] = useState(0);

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      dispatch(clearUser());
      navigate("/login", { replace: true });
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const handleSearch = () => {
    if (!city.trim() || !checkIn || !checkOut) {
      alert("Please fill in all required fields");
      return;
    }

    navigate("/hotel-search", { 
      state: { city, checkIn, checkOut, rooms, adults, childrens } 
    });
  };

  const navigationTabs = [
    { icon: <Hotel />, label: "Hotels" },
    { icon: <Home />, label: "Villas & Homestays" },
    { icon: <BeachAccess />, label: "Holiday Packages" },
  ];

  const [selectedTab, setSelectedTab] = useState(0);

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      }}
    >
      <Box
        sx={{
          background: "rgba(255, 255, 255, 0.1)",
          backdropFilter: "blur(10px)",
          py: 1.5,
          px: 3,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          borderBottom: "1px solid rgba(255, 255, 255, 0.2)",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 3 }}>
          <Typography
            variant="h5"
            sx={{
              color: "white",
              fontWeight: 700,
              fontFamily: "'Poppins', sans-serif",
            }}
          >
            StayFinder
          </Typography>
        </Box>

        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Typography sx={{ color: "white", fontSize: "0.9rem" }}>
            {user?.email || "Guest"}
          </Typography>
          <IconButton 
            onClick={handleLogout} 
            sx={{ 
              color: "white",
              background: "rgba(255,255,255,0.1)",
              "&:hover": { background: "rgba(255,255,255,0.2)" }
            }}
          >
            <ExitToApp />
          </IconButton>
        </Box>
      </Box>

      <Container maxWidth="lg" sx={{ pt: 6, pb: 8 }}>
        <Paper
          elevation={10}
          sx={{
            borderRadius: 3,
            overflow: "hidden",
            background: "white",
          }}
        >

          <Box
            sx={{
              display: "flex",
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              color: "white",
            }}
          >
            {navigationTabs.map((tab, index) => (
              <Box
                key={index}
                onClick={() => setSelectedTab(index)}
                sx={{
                  flex: 1,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 0.5,
                  py: 2,
                  cursor: "pointer",
                  background: selectedTab === index 
                    ? "rgba(255,255,255,0.2)" 
                    : "transparent",
                  borderBottom: selectedTab === index 
                    ? "3px solid white" 
                    : "3px solid transparent",
                  transition: "all 0.3s",
                  "&:hover": {
                    background: "rgba(255,255,255,0.15)",
                  },
                }}
              >
                <Box sx={{ fontSize: 28 }}>
                  {tab.icon}
                </Box>
                <Typography
                  variant="body2"
                  sx={{
                    fontWeight: selectedTab === index ? 600 : 400,
                    textAlign: "center",
                  }}
                >
                  {tab.label}
                </Typography>
              </Box>
            ))}
          </Box>

          <Box sx={{ p: 4 }}>
            <Typography
              variant="body2"
              sx={{ mb: 3, color: "#666", textAlign: "center" }}
            >
              Book Domestic and International Property Online
            </Typography>

            <Grid container spacing={2} alignItems="flex-end">
              <Grid item xs={12} md={3}>
                <Typography 
                  variant="caption" 
                  sx={{ 
                    color: "#666", 
                    mb: 0.5, 
                    display: "block",
                    fontWeight: 600 
                  }}
                >
                  City or Property
                </Typography>
                <FormControl fullWidth>
                  <Select
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    displayEmpty
                    size="medium"
                    sx={{
                      background: "#f8f9fa",
                      "&:hover": {
                        background: "#f0f1f3",
                      },
                    }}
                  >
                    <MenuItem value="" disabled>
                      Select a city
                    </MenuItem>
                    {POPULAR_CITIES.map((cityOption) => (
                      <MenuItem key={cityOption.code} value={cityOption.code}>
                        {cityOption.name} ({cityOption.code})
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={6} md={2}>
                <Typography 
                  variant="caption" 
                  sx={{ 
                    color: "#666", 
                    mb: 0.5, 
                    display: "block",
                    fontWeight: 600 
                  }}
                >
                  Check-In
                </Typography>
                <TextField
                  fullWidth
                  type="date"
                  value={checkIn}
                  onChange={(e) => setCheckIn(e.target.value)}
                  variant="outlined"
                  size="medium"
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      background: "#f8f9fa",
                      "&:hover": {
                        background: "#f0f1f3",
                      },
                    },
                  }}
                />
              </Grid>

              <Grid item xs={6} md={2}>
                <Typography 
                  variant="caption" 
                  sx={{ 
                    color: "#666", 
                    mb: 0.5, 
                    display: "block",
                    fontWeight: 600 
                  }}
                >
                  Check-Out
                </Typography>
                <TextField
                  fullWidth
                  type="date"
                  value={checkOut}
                  onChange={(e) => setCheckOut(e.target.value)}
                  variant="outlined"
                  size="medium"
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      background: "#f8f9fa",
                      "&:hover": {
                        background: "#f0f1f3",
                      },
                    },
                  }}
                />
              </Grid>

              <Grid item xs={6} md={1.5}>
                <Typography 
                  variant="caption" 
                  sx={{ 
                    color: "#666", 
                    mb: 0.5, 
                    display: "block",
                    fontWeight: 600 
                  }}
                >
                  Rooms
                </Typography>
                <FormControl fullWidth>
                  <Select
                    value={rooms}
                    onChange={(e) => setRooms(e.target.value)}
                    size="medium"
                    sx={{
                      background: "#f8f9fa",
                      "&:hover": {
                        background: "#f0f1f3",
                      },
                    }}
                  >
                    {[1, 2, 3, 4].map((num) => (
                      <MenuItem key={num} value={num}>
                        {num} Room{num > 1 ? "s" : ""}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={6} md={1.5}>
                <Typography 
                  variant="caption" 
                  sx={{ 
                    color: "#666", 
                    mb: 0.5, 
                    display: "block",
                    fontWeight: 600 
                  }}
                >
                  Adults
                </Typography>
                <FormControl fullWidth>
                  <Select
                    value={adults}
                    onChange={(e) => setAdults(e.target.value)}
                    size="medium"
                    sx={{
                      background: "#f8f9fa",
                      "&:hover": {
                        background: "#f0f1f3",
                      },
                    }}
                  >
                    {[1, 2, 3, 4, 5, 6, 7, 8].map((num) => (
                      <MenuItem key={num} value={num}>
                        {num} {num > 1 ? "" : ""}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={6} md={1.5}>
                <Typography 
                  variant="caption" 
                  sx={{ 
                    color: "#666", 
                    mb: 0.5, 
                    display: "block",
                    fontWeight: 600 
                  }}
                >
                  Children
                </Typography>
                <FormControl fullWidth>
                  <Select
                    value={childrens}
                    onChange={(e) => setChildrens(e.target.value)}
                    size="medium"
                    sx={{
                      background: "#f8f9fa",
                      "&:hover": {
                        background: "#f0f1f3",
                      },
                    }}
                  >
                    {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((num) => (
                      <MenuItem key={num} value={num}>
                        {num} {num > 1 ? "" : ""}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} md={2}>
                <Button
                  fullWidth
                  variant="contained"
                  size="large"
                  onClick={handleSearch}
                  sx={{
                    py: 1.8,
                    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                    fontWeight: 600,
                    fontSize: "1rem",
                    textTransform: "none",
                    borderRadius: 1,
                    boxShadow: "0 4px 15px rgba(102, 126, 234, 0.4)",
                    "&:hover": {
                      background: "linear-gradient(135deg, #5568d3 0%, #6a3f8f 100%)",
                      boxShadow: "0 6px 20px rgba(102, 126, 234, 0.6)",
                    },
                  }}
                >
                  SEARCH
                </Button>
              </Grid>
            </Grid>
          </Box>
        </Paper>

        <Box sx={{ mt: 6, textAlign: "center" }}>
          <Typography
            variant="h4"
            sx={{
              color: "white",
              fontWeight: 700,
              mb: 2,
              textShadow: "0 2px 10px rgba(0,0,0,0.2)",
            }}
          >
            Find Your Perfect Stay
          </Typography>
          <Typography
            variant="h6"
            sx={{
              color: "rgba(255,255,255,0.9)",
              maxWidth: 600,
              mx: "auto",
              textShadow: "0 1px 5px rgba(0,0,0,0.2)",
            }}
          >
            Search thousands of hotels, villas, and homestays. Compare prices and book your dream accommodation.
          </Typography>
        </Box>

        <Grid container spacing={3} sx={{ mt: 2 }}>
          {[
            {
              icon: <TrendingUp />,
              title: "Best Price Guarantee",
              desc: "Find the lowest prices or we'll refund the difference",
              color: "#667eea",
            },
            {
              icon: <Verified />,
              title: "Verified Reviews",
              desc: "Real feedback from millions of travelers worldwide",
              color: "#19547b",
            },
            {
              icon: <Security />,
              title: "Secure Payments",
              desc: "Your data is encrypted and protected with SSL",
              color: "#764ba2",
            },
            {
              icon: <Support />,
              title: "24/7 Support",
              desc: "Round-the-clock customer service in 40+ languages",
              color: "#f5576c",
            },
          ].map((feature, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <Card
                sx={{
                  height: "100%",
                  background: "white",
                  borderRadius: 3,
                  border: "1px solid #f0f0f0",
                  transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
                  "&:hover": {
                    transform: "translateY(-8px)",
                    boxShadow: "0 20px 40px rgba(0,0,0,0.12)",
                    borderColor: feature.color,
                  },
                }}
              >
                <CardContent sx={{ p: 3 }}>
                  <Box
                    sx={{
                      width: 56,
                      height: 56,
                      borderRadius: 2,
                      background: `linear-gradient(135deg, ${feature.color}15, ${feature.color}05)`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      mb: 2,
                    }}
                  >
                    <Box sx={{ fontSize: 28, color: feature.color }}>
                      {feature.icon}
                    </Box>
                  </Box>
                  <Typography
                    variant="h6"
                    sx={{ fontWeight: 700, mb: 1, fontSize: "1.1rem" }}
                  >
                    {feature.title}
                  </Typography>
                  <Typography variant="body2" sx={{ color: "#666", lineHeight: 1.6 }}>
                    {feature.desc}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
};

export default Dashboard;