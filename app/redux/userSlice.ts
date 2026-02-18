import { createSlice } from "@reduxjs/toolkit";

type User={
  email:string;
  refreshToken:string;
  idToken:string;
  isLoggedIn:boolean
}

const initialState : User = {
  email: '',
  refreshToken: '',
  idToken: '',
  isLoggedIn: false,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action) => {
      const { email, refreshToken, idToken } = action.payload;
      state.email = email;
      state.refreshToken = refreshToken;
      state.idToken = idToken;
      state.isLoggedIn = true;
    },
    logoutUser: (state) => {
      state.email = '';
      state.refreshToken = '';
      state.idToken = '';
      state.isLoggedIn = false;
    },
  },
});

export const { setUser, logoutUser } = userSlice.actions;
export default userSlice.reducer;
