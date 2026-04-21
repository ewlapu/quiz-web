import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  questions: [],
  pagination: null,
  loading: false,
  error: null,
};

const questionsSlice = createSlice({
  name: 'questions',
  initialState,
  reducers: {
    setQuestions: (state, action) => {
      state.questions = action.payload.questions;
      state.pagination = action.payload.pagination;
    },
    addQuestion: (state, action) => {
      state.questions.unshift(action.payload);
    },
    updateQuestion: (state, action) => {
      const index = state.questions.findIndex(q => q._id === action.payload._id);
      if (index !== -1) {
        state.questions[index] = action.payload;
      }
    },
    removeQuestion: (state, action) => {
      state.questions = state.questions.filter(q => q._id !== action.payload);
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
  },
});

export const { setQuestions, addQuestion, updateQuestion, removeQuestion, setLoading, setError } = questionsSlice.actions;
export default questionsSlice.reducer;
