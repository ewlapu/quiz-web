import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  subjects: [],
  loading: false,
  error: null,
};

const subjectsSlice = createSlice({
  name: 'subjects',
  initialState,
  reducers: {
    setSubjects: (state, action) => {
      state.subjects = action.payload;
    },
    addSubject: (state, action) => {
      state.subjects.push(action.payload);
    },
    updateSubject: (state, action) => {
      const index = state.subjects.findIndex(s => s._id === action.payload._id);
      if (index !== -1) {
        state.subjects[index] = action.payload;
      }
    },
    removeSubject: (state, action) => {
      state.subjects = state.subjects.filter(s => s._id !== action.payload);
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
  },
});

export const { setSubjects, addSubject, updateSubject, removeSubject, setLoading, setError } = subjectsSlice.actions;
export default subjectsSlice.reducer;
