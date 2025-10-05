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
  runId?: string;
  chunkTime?: string;
}

export interface ChangelogEntry {
  chunkTime: string;
  documentCount: number;
  documents: DocItem[];
}

export interface DocumentStats {
  totalCount: number;
  latestDocuments: DocItem[];
  chunkTimes: string[];
}

interface DocsState {
  docs: DocItem[];
  currentDoc: {
    id: string | null;
    content: string | null;
  };
  changelog: ChangelogEntry[];
  stats: DocumentStats | null;
  loading: {
    docsList: boolean;
    currentDoc: boolean;
    changelog: boolean;
    stats: boolean;
  };
  error: string | null;
}

const initialState: DocsState = {
  docs: [],
  currentDoc: {
    id: null,
    content: null,
  },
  changelog: [],
  stats: null,
  loading: {
    docsList: false,
    currentDoc: false,
    changelog: false,
    stats: false,
  },
  error: null,
};

// 🔸 Fetch latest documents thunk
export const fetchDocsList = createAsyncThunk<
  DocItem[], // return type
  { limit?: number } | void, // argument type (optional limit)
  { rejectValue: string }
>("docs/fetchDocsList", async (params, { rejectWithValue }) => {
  try {
    const limit = params?.limit || 10;
    console.log('Making API request to:', axiosInstance.defaults.baseURL + `/documents/latest?limit=${limit}`);
    const response = await axiosInstance.get(`/documents/latest?limit=${limit}`);
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
    const response = await axiosInstance.get(`/documents/${id}`);
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
    const response = await axiosInstance.patch(`/documents/${id}`, data);
    console.log('Update response:', response.data);
    return response.data;
  } catch (error: any) {
    console.error('Update error:', error);
    const message =
      error.response?.data?.message || "Failed to update document.";
    return rejectWithValue(message);
  }
});

// 🔸 Fetch document stats thunk
export const fetchDocumentStats = createAsyncThunk<
  DocumentStats, // return type
  void, // argument type
  { rejectValue: string }
>("docs/fetchDocumentStats", async (_, { rejectWithValue }) => {
  try {
    const [countResponse, latestResponse, chunkTimesResponse] = await Promise.all([
      axiosInstance.get("/documents/count"),
      axiosInstance.get("/documents/latest?limit=10"),
      axiosInstance.get("/documents/chunk-times")
    ]);

    return {
      totalCount: countResponse.data,
      latestDocuments: Array.isArray(latestResponse.data) ? latestResponse.data : [],
      chunkTimes: Array.isArray(chunkTimesResponse.data) ? chunkTimesResponse.data : []
    };
  } catch (error: any) {
    const message = error.response?.data?.message || "Failed to fetch document stats.";
    return rejectWithValue(message);
  }
});

// 🔸 Fetch documents by chunk time thunk
export const fetchDocumentsByChunkTime = createAsyncThunk<
  ChangelogEntry, // return type
  string, // argument type (chunk time)
  { rejectValue: string }
>("docs/fetchDocumentsByChunkTime", async (chunkTime, { rejectWithValue }) => {
  try {
    console.log('Fetching documents for chunk time:', chunkTime);
    const response = await axiosInstance.get(`/documents/chunk/${chunkTime}`);
    const documents = Array.isArray(response.data) ? response.data : [];
    
    return {
      chunkTime,
      documentCount: documents.length,
      documents
    };
  } catch (error: any) {
    const message = error.response?.data?.message || "Failed to fetch documents by chunk time.";
    return rejectWithValue(message);
  }
});

// 🔸 Fetch documents by run ID thunk
export const fetchDocumentsByRunId = createAsyncThunk<
  DocItem[], // return type
  string, // argument type (run ID)
  { rejectValue: string }
>("docs/fetchDocumentsByRunId", async (runId, { rejectWithValue }) => {
  try {
    console.log('Fetching documents for run ID:', runId);
    const response = await axiosInstance.get(`/documents/run/${runId}`);
    return Array.isArray(response.data) ? response.data : [];
  } catch (error: any) {
    const message = error.response?.data?.message || "Failed to fetch documents by run ID.";
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
    await axiosInstance.head("/documents/count", {
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
      state.changelog = [];
      state.stats = null;
      state.loading = {
        docsList: false,
        currentDoc: false,
        changelog: false,
        stats: false,
      };
      state.error = null;
    },
    clearChangelog: (state) => {
      state.changelog = [];
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
      // 🔹 Fetch Document Stats Cases
      .addCase(fetchDocumentStats.pending, (state) => {
        state.loading.stats = true;
        state.error = null;
      })
      .addCase(fetchDocumentStats.fulfilled, (state, action: PayloadAction<DocumentStats>) => {
        state.loading.stats = false;
        state.stats = action.payload;
        state.error = null;
      })
      .addCase(fetchDocumentStats.rejected, (state, action) => {
        state.loading.stats = false;
        state.error = action.payload || "Failed to fetch document stats.";
      })
      // 🔹 Fetch Documents by Chunk Time Cases
      .addCase(fetchDocumentsByChunkTime.pending, (state) => {
        state.loading.changelog = true;
        state.error = null;
      })
      .addCase(fetchDocumentsByChunkTime.fulfilled, (state, action: PayloadAction<ChangelogEntry>) => {
        state.loading.changelog = false;
        // Add or update the changelog entry
        const existingIndex = state.changelog.findIndex(entry => entry.chunkTime === action.payload.chunkTime);
        if (existingIndex !== -1) {
          state.changelog[existingIndex] = action.payload;
        } else {
          state.changelog.push(action.payload);
        }
        // Sort by chunk time (newest first)
        state.changelog.sort((a, b) => new Date(b.chunkTime).getTime() - new Date(a.chunkTime).getTime());
        state.error = null;
      })
      .addCase(fetchDocumentsByChunkTime.rejected, (state, action) => {
        state.loading.changelog = false;
        state.error = action.payload || "Failed to fetch documents by chunk time.";
      })
      // 🔹 Fetch Documents by Run ID Cases
      .addCase(fetchDocumentsByRunId.pending, (state) => {
        state.loading.docsList = true;
        state.error = null;
      })
      .addCase(fetchDocumentsByRunId.fulfilled, (state, action: PayloadAction<DocItem[]>) => {
        state.loading.docsList = false;
        state.docs = action.payload;
        state.error = null;
      })
      .addCase(fetchDocumentsByRunId.rejected, (state, action) => {
        state.loading.docsList = false;
        state.error = action.payload || "Failed to fetch documents by run ID.";
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

export const { clearError, clearCurrentDoc, resetDocsState, clearChangelog } = docsSlice.actions;
export default docsSlice.reducer;
