import { createSlice, createAsyncThunk, type PayloadAction } from "@reduxjs/toolkit";
import axiosInstance from "@/lib/axiosInstance";

export interface DocItem {
  _id: string;
  content: string;
  source: string;
  provider: string;
  model: string;
  timestamp: string;
  metadata: {
    framework?: string;
    moduleName?: string;
    totalRoutes?: number;
    source?: string;
    runId?: string;
    runTimestamp?: string;
    chunkTimestamp?: string;
    projectPath?: string;
  };
  createdAt: string;
  updatedAt: string;
  // Add computed id field that uses timestamp
  id: string;
}

export interface ChangelogEntry {
  chunkTime: string;
  documentCount: number;
  documents: DocItem[];
}

export interface DocumentStats {
  totalCount: number | { count: number };
  latestDocuments: DocItem[];
  chunkTimes: string[];
}

interface DocsState {
  docs: DocItem[];
  currentDoc: DocItem | null;
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
  currentDoc: null,
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
  void, // argument type
  { rejectValue: string }
>("docs/fetchDocsList", async (_, { rejectWithValue }) => {
  try {
    // First get all available chunk times
    console.log('Fetching chunk times...');
    const chunkTimesResponse = await axiosInstance.get('/documents/chunk-times');
    const chunkTimes = Array.isArray(chunkTimesResponse.data) ? chunkTimesResponse.data : [];
    
    if (chunkTimes.length === 0) {
      console.log('No chunk times available');
      return [];
    }
    
    // Get the latest timestamp (assuming they're sorted, take the last one)
    const latestTimestamp = chunkTimes[chunkTimes.length - 1];
    console.log('Latest timestamp:', latestTimestamp);
    
    // Fetch documents from the latest timestamp
    console.log('Fetching documents from latest timestamp...');
    const response = await axiosInstance.get(`/documents/chunk/${latestTimestamp}`);
    console.log('API response:', response.data);
    const docs = Array.isArray(response.data) ? response.data : [];
    // Add computed id field using timestamp
    return docs.map(doc => ({ ...doc, id: doc.timestamp }));
  } catch (error: any) {
    console.error('API error:', error);
    const message =
      error.response?.data?.message || "Failed to fetch documents list.";
    return rejectWithValue(message);
  }
});

// 🔸 Fetch single document thunk
export const fetchDocById = createAsyncThunk<
  DocItem, // return type
  string, // argument type (MongoDB document _id)
  { rejectValue: string }
>("docs/fetchDocById", async (_id, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.get(`/documents/${_id}`);
    const doc = response.data;
    // Add computed id field using timestamp
    return { ...doc, id: doc.timestamp };
  } catch (error: any) {
    const message =
      error.response?.data?.message || "Failed to fetch document.";
    return rejectWithValue(message);
  }
});

// 🔸 Update document thunk
export const updateDoc = createAsyncThunk<
  DocItem, // return type
  { id: string; data: Partial<DocItem> }, // argument type (id is now _id)
  { rejectValue: string }
>("docs/updateDoc", async ({ id, data }, { rejectWithValue }) => {
  try {
    console.log('Updating document:', id, data);
    const response = await axiosInstance.patch(`/documents/${id}/content`, data);
    console.log('Update response:', response.data);
    const doc = response.data;
    // Add computed id field using timestamp
    return { ...doc, id: doc.timestamp };
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
    const [countResponse, chunkTimesResponse] = await Promise.all([
      axiosInstance.get("/documents/count"),
      axiosInstance.get("/documents/chunk-times")
    ]);

    const chunkTimes = Array.isArray(chunkTimesResponse.data) ? chunkTimesResponse.data : [];
    let latestDocuments: any[] = [];

    // If we have chunk times, get documents from the latest timestamp
    if (chunkTimes.length > 0) {
      const latestTimestamp = chunkTimes[chunkTimes.length - 1];
      const latestResponse = await axiosInstance.get(`/documents/chunk/${latestTimestamp}`);
      latestDocuments = Array.isArray(latestResponse.data) ? latestResponse.data : [];
    }

    return {
      totalCount: typeof countResponse.data === 'object' ? countResponse.data.count : countResponse.data,
      latestDocuments,
      chunkTimes
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
      state.currentDoc = null;
    },
    resetDocsState: (state) => {
      state.docs = [];
      state.currentDoc = null;
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
      .addCase(fetchDocById.fulfilled, (state, action: PayloadAction<DocItem>) => {
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
        if (state.currentDoc && state.currentDoc._id === action.payload._id) {
          state.currentDoc = action.payload;
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
