import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  attempts: [],
  currentAttempt: null,
  pagination: null,
  loading: false,
  error: null,
};

const attemptsSlice = createSlice({
  name: 'attempts',
  initialState,
  reducers: {
    setAttempts: (state, action) => {
      state.attempts = action.payload.attempts;
      state.pagination = action.payload.pagination;
    },
    setCurrentAttempt: (state, action) => {
      state.currentAttempt = action.payload;
    },
    addAttempt: (state, action) => {
      state.attempts.unshift(action.payload);
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
  },
});

export const { setAttempts, setCurrentAttempt, addAttempt, setLoading, setError } = attemptsSlice.actions;
export default attemptsSlice.reducer;
