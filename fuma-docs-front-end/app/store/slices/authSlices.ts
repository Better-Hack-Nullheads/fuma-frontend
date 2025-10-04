import { createSlice, createAsyncThunk, type PayloadAction } from "@reduxjs/toolkit";
import axiosInstance from "@/lib/axiosInstance";

interface RegisterPayload {
  email: string;
  password: string;
  projectName: string;
}

interface SigninPayload {
  apiKey: string;
}

interface AuthState {
  apiKey: string | null;
  loading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  apiKey: null,
  loading: false,
  error: null,
};

// 🔸 Register thunk
export const registerUser = createAsyncThunk<
  string, // return type
  RegisterPayload, // argument type
  { rejectValue: string }
>("auth/registerUser", async (data, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.post("/autodoc/register", data);
    return response.data.apiKey;
  } catch (error: any) {
    const message =
      error.response?.data?.message || "Failed to register. Please try again.";
    return rejectWithValue(message);
  }
});

// 🔸 Signin thunk
export const signinUser = createAsyncThunk<
  string, // return type
  SigninPayload, // argument type
  { rejectValue: string }
>("auth/signinUser", async (data, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.post("/autodoc/signin", data);
    return response.data.apiKey;
  } catch (error: any) {
    const message =
      error.response?.data?.message || "Invalid API key. Please try again.";
    return rejectWithValue(message);
  }
});

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      state.apiKey = null;
      state.error = null;
      state.loading = false;
    },
  },
  extraReducers: (builder) => {
    builder
      // 🔹 Register Cases
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action: PayloadAction<string>) => {
        state.loading = false;
        state.apiKey = action.payload;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Registration failed.";
      })
      // 🔹 Signin Cases
      .addCase(signinUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(signinUser.fulfilled, (state, action: PayloadAction<string>) => {
        state.loading = false;
        state.apiKey = action.payload;
      })
      .addCase(signinUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Sign in failed.";
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
