import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setUser } from "../redux/userSlice";
import { supabase } from "../supabaseClient";
import {
  TextField,
  Button,
  Box,
  Typography,
  Paper,
  Container,
  InputAdornment,
  IconButton,
  Alert,
  CircularProgress,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isSignup, setIsSignup] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        dispatch(
          setUser({
            user: session.user,
            token: session.access_token,
            isAuthenticated: true,
          })
        );
        navigate("/dashboard", { replace: true });
      }
    };
    checkSession();
  }, [dispatch, navigate]);

  const login = async () => {
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      if (error) throw error;
      if (data?.session && data?.user) {

        dispatch(
          setUser({
            user: data.user,
            token: data.session.access_token,
            isAuthenticated: true,
          })
        );
        setSuccess("Login successful! Redirecting...");

        setTimeout(() => {
          navigate("/dashboard", { replace: true });
        }, 500);
      } else {
        setError("Please check your email to confirm your account before logging in.");
      }
    } catch (err) {
      
      let errorMessage = "Login failed. Please try again.";
      if (err.message?.includes("Invalid login credentials")) {
        errorMessage = "Invalid email or password.";
      } else if (err.message?.includes("Email not confirmed")) {
        errorMessage = "Please confirm your email before logging in.";
      } else if (err.message) {
        errorMessage = err.message;
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const signup = async () => {
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      
      const { data, error } = await supabase.auth.signUp({
        email: email.trim(),
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/dashboard`,
        },
      });

      if (error) throw error;

      if (data?.session && data?.user) {

        dispatch(
          setUser({
            user: data.user,
            token: data.session.access_token,
            isAuthenticated: true, 
          })
        );
        
        setSuccess("Account created successfully! Redirecting...");
        
        setTimeout(() => {
          navigate("/dashboard", { replace: true });
        }, 500);
      } else if (data?.user) {
        setSuccess("Check your email to confirm your account before logging in.");
        setTimeout(() => {
          setIsSignup(false);
          setSuccess("");
        }, 4000);
      }
    } catch (err) {
      
      if (err.message?.includes("already registered") || err.message?.includes("already exists")) {
        setError("Email already registered. Please login instead.");
      } else {
        setError(err.message || "Signup failed. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!email || !password) {
      setError("Please fill in all fields");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      setError("Please enter a valid email address");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    isSignup ? signup() : login();
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Container maxWidth="sm">
        <Paper elevation={10} sx={{ p: 5, borderRadius: 3 }}>
          <Box textAlign="center" mb={3}>
            <Typography variant="h4" fontWeight={700}>
              StayFinder
            </Typography>
            <Typography variant="h6" color="text.secondary">
              {isSignup ? "Create Account" : "Welcome Back"}
            </Typography>
          </Box>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError("")}>
              {error}
            </Alert>
          )}

          {success && (
            <Alert
              severity="success"
              sx={{ mb: 2 }}
              onClose={() => setSuccess("")}
            >
              {success}
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit} noValidate>
            <TextField
              fullWidth
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              sx={{ mb: 2 }}
              disabled={loading}
              autoComplete="email"
              required
            />

            <TextField
              fullWidth
              label="Password"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              sx={{ mb: 3 }}
              disabled={loading}
              autoComplete={isSignup ? "new-password" : "current-password"}
              required
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowPassword(!showPassword)}
                      disabled={loading}
                      edge="end"
                      aria-label="toggle password visibility"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            <Button
              fullWidth
              type="submit"
              variant="contained"
              disabled={loading}
              sx={{ 
                py: 1.5,
                fontSize: '1rem',
                fontWeight: 600,
                textTransform: 'none'
              }}
            >
              {loading ? (
                <CircularProgress size={24} color="inherit" />
              ) : isSignup ? (
                "Sign Up"
              ) : (
                "Login"
              )}
            </Button>
          </Box>

          <Box textAlign="center" mt={3}>
            <Typography variant="body2" color="text.secondary">
              {isSignup ? "Already have an account?" : "Don't have an account?"}
              {" "}
              <Button
                onClick={() => {
                  setIsSignup(!isSignup);
                  setError("");
                  setSuccess("");
                }}
                disabled={loading}
                sx={{ 
                  textTransform: "none",
                  fontWeight: 600
                }}
              >
                {isSignup ? "Login" : "Sign Up"}
              </Button>
            </Typography>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
}