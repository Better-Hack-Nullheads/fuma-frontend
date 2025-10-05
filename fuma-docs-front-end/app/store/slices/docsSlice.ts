import { createSlice, createAsyncThunk, type PayloadAction } from "@reduxjs/toolkit";
import axiosInstance from "@/lib/axiosInstance";

export interface DocItem {
  _id: string;
  mdxContent: string;
  title: string;
  description: string;
  __v: number;
  createdAt: string;
  updatedAt: string;
}

interface DocsState {
  docs: DocItem[];
  currentDoc: {
    id: string | null;
    content: string | null;
  };
  loading: {
    docsList: boolean;
    currentDoc: boolean;
  };
  error: string | null;
}

const initialState: DocsState = {
  docs: [],
  currentDoc: {
    id: null,
    content: null,
  },
  loading: {
    docsList: false,
    currentDoc: false,
  },
  error: null,
};

// 🔸 Fetch all documents thunk
export const fetchDocsList = createAsyncThunk<
  DocItem[], // return type
  void, // argument type (no arguments needed)
  { rejectValue: string }
>("docs/fetchDocsList", async (_, { rejectWithValue }) => {
  try {
    console.log('Making API request to:', axiosInstance.defaults.baseURL + "/llm-response/");
    const response = await axiosInstance.get("/llm-response/");
    console.log('API response:', response.data);
    return Array.isArray(response.data) ? response.data : [];
  } catch (error: any) {
    console.error('API error:', error);
    const message =
      error.response?.data?.message || "Failed to fetch documents list.";
    return rejectWithValue(message);
  }
});

// 🔸 Fetch single document thunk
export const fetchDocById = createAsyncThunk<
  { id: string; content: string }, // return type
  string, // argument type (document ID)
  { rejectValue: string }
>("docs/fetchDocById", async (id, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.get(`/llm-response/${id}`);
    const doc = response.data;
    return { id, content: doc.mdxContent };
  } catch (error: any) {
    const message =
      error.response?.data?.message || "Failed to fetch document.";
    return rejectWithValue(message);
  }
});

// 🔸 Update document thunk
export const updateDoc = createAsyncThunk<
  DocItem, // return type
  { id: string; data: Partial<DocItem> }, // argument type
  { rejectValue: string }
>("docs/updateDoc", async ({ id, data }, { rejectWithValue }) => {
  try {
    console.log('Updating document:', id, data);
    const response = await axiosInstance.patch(`/llm-response/${id}`, data);
    console.log('Update response:', response.data);
    return response.data;
  } catch (error: any) {
    console.error('Update error:', error);
    const message =
      error.response?.data?.message || "Failed to update document.";
    return rejectWithValue(message);
  }
});

// 🔸 Check backend health thunk
export const checkBackendHealth = createAsyncThunk<
  boolean, // return type
  void, // argument type
  { rejectValue: string }
>("docs/checkBackendHealth", async (_, { rejectWithValue }) => {
  try {
    await axiosInstance.head("/llm-response/", {
      timeout: 5000,
    });
    return true;
  } catch (error: any) {
    return rejectWithValue("Backend is not available");
  }
});

const docsSlice = createSlice({
  name: "docs",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearCurrentDoc: (state) => {
      state.currentDoc = {
        id: null,
        content: null,
      };
    },
    resetDocsState: (state) => {
      state.docs = [];
      state.currentDoc = {
        id: null,
        content: null,
      };
      state.loading = {
        docsList: false,
        currentDoc: false,
      };
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // 🔹 Fetch Docs List Cases
      .addCase(fetchDocsList.pending, (state) => {
        state.loading.docsList = true;
        state.error = null;
      })
      .addCase(fetchDocsList.fulfilled, (state, action: PayloadAction<DocItem[]>) => {
        state.loading.docsList = false;
        state.docs = action.payload;
        state.error = null;
      })
      .addCase(fetchDocsList.rejected, (state, action) => {
        state.loading.docsList = false;
        state.error = action.payload || "Failed to fetch documents list.";
      })
      // 🔹 Fetch Doc By ID Cases
      .addCase(fetchDocById.pending, (state) => {
        state.loading.currentDoc = true;
        state.error = null;
      })
      .addCase(fetchDocById.fulfilled, (state, action: PayloadAction<{ id: string; content: string }>) => {
        state.loading.currentDoc = false;
        state.currentDoc = action.payload;
        state.error = null;
      })
      .addCase(fetchDocById.rejected, (state, action) => {
        state.loading.currentDoc = false;
        state.error = action.payload || "Failed to fetch document.";
      })
      // 🔹 Update Doc Cases
      .addCase(updateDoc.pending, (state) => {
        state.loading.currentDoc = true;
        state.error = null;
      })
      .addCase(updateDoc.fulfilled, (state, action: PayloadAction<DocItem>) => {
        state.loading.currentDoc = false;
        // Update the document in the docs list
        const index = state.docs.findIndex(doc => doc._id === action.payload._id);
        if (index !== -1) {
          state.docs[index] = action.payload;
        }
        // Update current doc if it's the same document
        if (state.currentDoc.id === action.payload._id) {
          state.currentDoc.content = action.payload.mdxContent;
        }
        state.error = null;
      })
      .addCase(updateDoc.rejected, (state, action) => {
        state.loading.currentDoc = false;
        state.error = action.payload || "Failed to update document.";
      })
      // 🔹 Check Backend Health Cases
      .addCase(checkBackendHealth.pending, (state) => {
        state.error = null;
      })
      .addCase(checkBackendHealth.fulfilled, (state) => {
        state.error = null;
      })
      .addCase(checkBackendHealth.rejected, (state, action) => {
        state.error = action.payload || "Backend is not available";
      });
  },
});

export const { clearError, clearCurrentDoc, resetDocsState } = docsSlice.actions;
export default docsSlice.reducer;
