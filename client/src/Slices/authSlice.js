import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  userData: null,
  token: null, // Can be removed since token is in HTTP-only cookie
  error: null,
  isAuthorized: false,
  loading: false,
};

// Async action for signup
export const signup = createAsyncThunk("signup", async (userCredentials, { rejectWithValue }) => {
  try {
    const { data } = await axios.post(
      `${import.meta.env.VITE_BACKEND_BASEURL}/auth/register`,
      userCredentials,
      { withCredentials: true }
    );
    return data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.error || "Registration failed");
  }
});

// Async action for login
export const login = createAsyncThunk("login", async (userCredentials, { rejectWithValue }) => {
  try {
    const { data } = await axios.post(
      `${import.meta.env.VITE_BACKEND_BASEURL}/auth/login`,
      userCredentials,
      { withCredentials: true }
    );
    if (data.token) {
      localStorage.setItem('fallbackToken', data.token);
    }
    return data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.error || "Login failed");
  }
});

// Async action to check auth status
export const checkAuthStatus = createAsyncThunk(
  "checkAuthStatus",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await axios.get(`${import.meta.env.VITE_BACKEND_BASEURL}/user/get-login-details`, {
        withCredentials: true,
      });
      
      // Store token in localStorage as fallback
      if (data?.token) {
        localStorage.setItem('fallbackToken', data.token);
      }
      
      return data;
    } catch (err) {
      // Try with localStorage fallback
      const fallbackToken = localStorage.getItem('fallbackToken');
      if (fallbackToken) {
        try {
          const { data } = await axios.get(`${import.meta.env.VITE_BACKEND_BASEURL}/user/get-login-details`, {
            headers: {
              Authorization: `Bearer ${fallbackToken}`
            }
          });
          return data;
        } catch (fallbackErr) {
          localStorage.removeItem('fallbackToken');
          return rejectWithValue(fallbackErr.response?.data?.error || "Not authenticated");
        }
      }
      return rejectWithValue(err.response?.data?.error || "Not authenticated");
    }
  }
);

const authSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    logout: (state) => {
      state.userData = null;
      state.token = null;
      state.isAuthorized = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Signup cases
      .addCase(signup.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(signup.fulfilled, (state, action) => {
        state.loading = false;
        state.userData = action.payload.user;
        // state.token = action.payload.token; // Remove since token is in cookie
        state.isAuthorized = true;
      })
      .addCase(signup.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      })
      // Login cases
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.userData = action.payload.user;
        // state.token = action.payload.token; // Remove since token is in cookie
        state.isAuthorized = true;
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      })
      // Check auth status cases
      .addCase(checkAuthStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(checkAuthStatus.fulfilled, (state, action) => {
        state.loading = false;
if (action.payload?.user) {
  state.userData = action.payload.user;
  state.isAuthorized = true;
} else {
  state.userData = null;
  state.isAuthorized = false;
}
      })
      .addCase(checkAuthStatus.rejected, (state, action) => {
        state.loading = false;
        state.userData = null;
        state.token = null;
        state.isAuthorized = false;
        state.error = action.payload || action.error.message;
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;