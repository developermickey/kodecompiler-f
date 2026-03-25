import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import apiClient from "../api/axios"; // Import the instance above

/* ===================== RUN CODE ===================== */
export const runCode = createAsyncThunk(
    "code/runCode",
    async (code, { rejectWithValue }) => {
        try {
            // API returns the final result directly: { success, output, error, execution_time }
            const { data } = await apiClient.post("/execute", code);
            return data;
        } catch (err) {
            return rejectWithValue(
                err.response?.data || { message: "Execution failed" }
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

// ================= DELETE CODE ==================
export const deleteCode = createAsyncThunk(
    'code/deleteCode', async (codeId, { rejectWithValue }) => {
        try {
            const res = await apiClient.delete(`/codes/${codeId}`)
            return { codeId, ...res.data }
        }catch (err) {
            return rejectWithValue(
                err.response?.data || { message: "Failed to delete code" }
            )
        }
    })

/* ===================== SLICE ===================== */
const codeSlice = createSlice({
    name: "code",
    initialState: {
        status: null, // submitting | completed | failed
        output: null,
        error: null,
        execution_time: null,
        userCodes: [],
        isSaving: false,
        isCreating: false,
    },
    reducers: {
        resetCodeState: (state) => {
            state.status = null;
            state.output = null;
            state.error = null;
            state.execution_time = null;
        },
    },
    extraReducers: (builder) => {
        builder
            /* ---------- RUN CODE ---------- */
            .addCase(runCode.pending, (state) => {
                state.error = null;
                state.status = "submitting";
                state.output = null;
                state.execution_time = null;
            })
            .addCase(runCode.fulfilled, (state, action) => {
                const { success, output, error, execution_time } = action.payload;
                state.status = success ? "completed" : "failed";
                state.output = output ?? null;
                state.error = error ?? null;
                state.execution_time = execution_time ?? null;
            })
            .addCase(runCode.rejected, (state, action) => {
                state.status = "failed";
                state.error =
                    action.payload?.message ||
                    action.payload?.error ||
                    "Execution failed";
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
