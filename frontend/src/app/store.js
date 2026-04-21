import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../slices/authSlice';
import uiReducer from '../slices/uiSlice';
import subjectsReducer from '../slices/subjectsSlice';
import questionsReducer from '../slices/questionsSlice';
import examsReducer from '../slices/examsSlice';
import attemptsReducer from '../slices/attemptsSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    ui: uiReducer,
    subjects: subjectsReducer,
    questions: questionsReducer,
    exams: examsReducer,
    attempts: attemptsReducer,
  },
});
