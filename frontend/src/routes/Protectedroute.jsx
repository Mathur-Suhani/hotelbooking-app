import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Navigate } from "react-router-dom";
import { supabase } from "../supabaseClient";
import { setUser, clearUser } from "../redux/userSlice";
import { CircularProgress, Box } from "@mui/material";

const ProtectedRoute = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();
  
  const { isAuthenticated } = useSelector((state) => state.user?.isAuthenticated);
  const user = useSelector((state) => state.user?.user);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();

        if (session && session.user) {
          
          if (!isAuthenticated) {
            dispatch(
              setUser({
                user: session.user,
                token: session.access_token,
                isAuthenticated: true,
              })
            );
          }
        } else if (isAuthenticated) {
          dispatch(clearUser());
        }
      } catch (err) {
        dispatch(clearUser());
      } finally {
        setLoading(false);
      }
    };

    checkAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        
        if (event === 'SIGNED_IN' && session) {
          dispatch(
            setUser({
              user: session.user,
              token: session.access_token,
              isAuthenticated: true,
            })
          );
        } else if (event === 'SIGNED_OUT') {
          dispatch(clearUser());
        }
      }
    );

    return () => {
      subscription?.unsubscribe();
    };
  }, [dispatch, isAuthenticated]);

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        }}
      >
        <CircularProgress size={60} sx={{ color: "white" }} />
      </Box>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;