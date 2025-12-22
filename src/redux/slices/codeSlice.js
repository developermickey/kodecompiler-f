import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import apiClient from "../api/axios"; // Import the instance above

/* ===================== RUN CODE ===================== */
export const runCode = createAsyncThunk(
    "code/runCode",
    async (code, { rejectWithValue }) => {
        try {
            // apiClient handles baseURL and headers automatically
            const { data } = await apiClient.post("/execute", code);
            return data; // { job_id }
        } catch (err) {
            return rejectWithValue(
                err.response?.data || { message: "Execution failed" }
            );
        }
    }
);

/* ===================== GET RESULT ===================== */
export const getResult = createAsyncThunk(
    "code/getResult",
    async (job_id, { rejectWithValue }) => {
        try {
            const { data } = await apiClient.get(`/execute/${job_id}/status`);
            return data; // { status, output?, error? }
        } catch (err) {
            return rejectWithValue(
                err.response?.data || { message: "Failed to fetch result" }
            );
        }
    }
);

/* ===================== GET USER CODES ===================== */
export const getUserCodes = createAsyncThunk(
  "code/getUserCodes",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await apiClient.get("/codes/");
      return data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data || { message: "Failed to fetch user codes" }
      );
    }
  }
);

/* ===================== SAVE CODE ===================== */
export const saveCode = createAsyncThunk(
    "code/saveCode",
    async ({ code_id, payload }, { rejectWithValue }) => {
        try {
            const { data } = await apiClient.put(`/codes/${code_id}`, payload);
            return data;
        } catch (err) {
            return rejectWithValue(
                err.response?.data || { message: "Failed to save code" }
            );
        }
    }
);

// ================= CREATE CODE ==================
export const createCode = createAsyncThunk(
    'code/createCode', async (code, { rejectWithValue }) => {
        try {
            const res = await apiClient.post('/codes/', code)
            return res.data
        }
        catch (err) {
            return rejectWithValue(
                err.response?.data || { message: "Failed to create code" }
            )
        }
    }
)


/* ===================== SLICE ===================== */
const codeSlice = createSlice({
    name: "code",
    initialState: {
        jobId: null,
        status: null, // submitting | submitted | running | completed | failed
        output: null,
        isRunning: false,
        error: null,
        userCodes: [],
        isSaving: false,
        isCreating: false,
    },
    reducers: {
        // Best Practice: Add a reset action to clear state when leaving the page
        resetCodeState: (state) => {
            state.jobId = null;
            state.status = null;
            state.output = null;
            state.error = null;
            state.isRunning = false;
        },
    },
    extraReducers: (builder) => {
        builder
            /* ---------- RUN CODE ---------- */
            .addCase(runCode.pending, (state) => {
                state.isRunning = true;
                state.error = null;
                state.status = "submitting";
                state.output = null; // Clear previous output
            })
            .addCase(runCode.fulfilled, (state, action) => {
                state.isRunning = false;
                state.jobId = action.payload.job_id;
                state.status = "submitted";
            })
            .addCase(runCode.rejected, (state, action) => {
                state.isRunning = false;
                state.error = action.payload;
                state.status = "failed";
            })

            /* ---------- GET RESULT ---------- */
            .addCase(getResult.pending, (state) => {
                state.status = "running";
            })

            .addCase(getResult.fulfilled, (state, action) => {
                state.status = action.payload.status;

                // Only update output if it exists (prevents overwriting with null)
                if (action.payload.output !== undefined) {
                    state.output = action.payload.output;
                }

                if (action.payload.error) {
                    state.error = action.payload.error;
                }
            })
            .addCase(getResult.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.payload;
            })

            /* ---------- GET USER CODES ---------- */
            .addCase(getUserCodes.fulfilled, (state, action) => {
                state.userCodes = action.payload?.codes;
            })
            .addCase(getUserCodes.rejected, (state, action) => {
                state.error = action.payload;
            })

            /* ---------- SAVE CODE ---------- */
            .addCase(saveCode.pending, (state) => {
                state.isSaving = true;
            })
            .addCase(saveCode.fulfilled, (state, action) => {
                state.isSaving = false;

                const index = state.userCodes.findIndex(
                    (c) => c._id === action.payload._id
                );

                if (index !== -1) {
                    state.userCodes[index] = action.payload;
                } else {
                    state.userCodes.push(action.payload);
                }
            })

            .addCase(saveCode.rejected, (state, action) => {
                state.isSaving = false;
                state.error = action.payload;
            })
            .addCase(createCode.pending, (state, action) => {
                state.isCreating = true
            })
            .addCase(createCode.fulfilled, (state, action) => {
                state.isCreating = false
                state.userCodes.push(action.payload)
            })
            .addCase(createCode.rejected, (state, action) => {
                state.isCreating = false
                state.error = action.payload
            })
    },
});

export const { resetCodeState } = codeSlice.actions;
export default codeSlice.reducer;
