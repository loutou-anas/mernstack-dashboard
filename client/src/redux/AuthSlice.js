import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { get } from '../services/ApiEndPoint';

export const User = createAsyncThunk('get-user', async () => {
    const request = await get('/api/auth/checkUser');
    const response = request.data;
    if (request.status === 200) {
        return response;
    }
});

const initialState = {
    loading: null,
    error: null,
    user: JSON.parse(localStorage.getItem('user')) || { role: '' },
    language: localStorage.getItem('language') || 'fr', // Initialize language from local storage or default to French
};

const UserSlice = createSlice({
    name: "user",
    initialState: initialState,
    reducers: {
       setUser: (state, action) => {
            state.user = action.payload;
            // Persist user data in local storage
            localStorage.setItem('user', JSON.stringify(action.payload));
            localStorage.setItem('token', action.payload.token); // Assuming the token is part of the user payload
       },
       logOut: (state) => {
            state.user = null;
            state.loading = null;
            state.error = null;
            // Clear local storage
            localStorage.removeItem('user');
            localStorage.removeItem('token');
       },
       setLanguage: (state, action) => {
            state.language = action.payload;
            // Persist language preference in local storage
            localStorage.setItem('language', action.payload);
       }
    },
    extraReducers: (builder) => {
        builder
            .addCase(User.pending, (state) => {
                state.loading = true;
            })
            .addCase(User.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload;
                state.error = null;
                // Persist user data in local storage
                localStorage.setItem('user', JSON.stringify(action.payload));
                localStorage.setItem('token', action.payload.token); // Assuming the token is part of the user payload
            })
            .addCase(User.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || null;
            });
    }
});

export const { setUser, logOut, setLanguage } = UserSlice.actions;
export default UserSlice.reducer;
