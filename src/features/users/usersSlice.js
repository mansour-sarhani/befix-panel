import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { userService } from "@/services/user.service";

// Async thunks for API calls
export const fetchUsers = createAsyncThunk(
    "users/fetchUsers",
    async (params, { rejectWithValue }) => {
        try {
            const response = await userService.getUsers(params);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

export const createUser = createAsyncThunk(
    "users/createUser",
    async (userData, { rejectWithValue }) => {
        try {
            const response = await userService.createUser(userData);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

export const updateUser = createAsyncThunk(
    "users/updateUser",
    async ({ id, userData }, { rejectWithValue }) => {
        try {
            const response = await userService.updateUser(id, userData);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

export const deleteUser = createAsyncThunk("users/deleteUser", async (id, { rejectWithValue }) => {
    try {
        await userService.deleteUser(id);
        return id;
    } catch (error) {
        return rejectWithValue(error.message);
    }
});

const initialState = {
    list: [],
    currentUser: null,
    loading: false,
    error: null,
    pagination: {
        page: 1,
        limit: 10,
        total: 0,
    },
    filters: {
        search: "",
        status: "all",
        role: "all",
    },
};

const usersSlice = createSlice({
    name: "users",
    initialState,
    reducers: {
        // Synchronous actions
        setFilters: (state, action) => {
            state.filters = { ...state.filters, ...action.payload };
        },
        setPage: (state, action) => {
            state.pagination.page = action.payload;
        },
        clearCurrentUser: (state) => {
            state.currentUser = null;
        },
        clearError: (state) => {
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        // Fetch users
        builder
            .addCase(fetchUsers.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchUsers.fulfilled, (state, action) => {
                state.loading = false;
                state.list = action.payload.users || action.payload;
                if (action.payload.pagination) {
                    state.pagination = action.payload.pagination;
                } else {
                    state.pagination.total = action.payload.total || action.payload.length;
                }
            })
            .addCase(fetchUsers.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });

        // Create user
        builder
            .addCase(createUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createUser.fulfilled, (state, action) => {
                state.loading = false;
                state.list.unshift(action.payload);
                state.pagination.total += 1;
            })
            .addCase(createUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });

        // Update user
        builder
            .addCase(updateUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateUser.fulfilled, (state, action) => {
                state.loading = false;
                const index = state.list.findIndex((user) => user.id === action.payload.id || user._id === action.payload._id);
                if (index !== -1) {
                    state.list[index] = action.payload;
                }
            })
            .addCase(updateUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });

        // Delete user
        builder
            .addCase(deleteUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteUser.fulfilled, (state, action) => {
                state.loading = false;
                state.list = state.list.filter((user) => user.id !== action.payload && user._id !== action.payload);
                state.pagination.total -= 1;
            })
            .addCase(deleteUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export const { setFilters, setPage, clearCurrentUser, clearError } = usersSlice.actions;

export default usersSlice.reducer;
