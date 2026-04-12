import { createSlice } from "@reduxjs/toolkit";
const initialState = {
    allUsers: [],
    allRecruiters: [],
    loading: false,
  };
  const userSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
      setAllUsers: (state, action) => {
        state.allUsers = action.payload;
      },
      setAllRecruiters:(state, action) => {
        state.allRecruiters = action.payload;
      },
      setLoading: (state, action) => {
        state.loading = action.payload;
      }
    }
  });
  export const { setAllUsers, setLoading, setAllRecruiters } = userSlice.actions;
  export default userSlice.reducer;
  