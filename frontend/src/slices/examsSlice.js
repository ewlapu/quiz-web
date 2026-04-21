import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  exams: [],
  currentExam: null,
  pagination: null,
  loading: false,
  error: null,
};

const examsSlice = createSlice({
  name: 'exams',
  initialState,
  reducers: {
    setExams: (state, action) => {
      state.exams = action.payload.exams;
      state.pagination = action.payload.pagination;
    },
    setCurrentExam: (state, action) => {
      state.currentExam = action.payload;
    },
    addExam: (state, action) => {
      state.exams.unshift(action.payload);
    },
    updateExam: (state, action) => {
      const index = state.exams.findIndex(e => e._id === action.payload._id);
      if (index !== -1) {
        state.exams[index] = action.payload;
      }
    },
    removeExam: (state, action) => {
      state.exams = state.exams.filter(e => e._id !== action.payload);
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
  },
});

export const { setExams, setCurrentExam, addExam, updateExam, removeExam, setLoading, setError } = examsSlice.actions;
export default examsSlice.reducer;
