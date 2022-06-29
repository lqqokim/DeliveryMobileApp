import {createSlice, PayloadAction} from '@reduxjs/toolkit';

interface State {
  name: string;
  email: string;
  accessToken: string;
  money: number;
}

const initialState: State = {
  name: '',
  email: '',
  accessToken: '',
  money: 0,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser(
      state: State,
      action: PayloadAction<{email: string; name: string; accessToken: string}>,
    ) {
      state.email = action.payload.email;
      state.name = action.payload.name;
      state.accessToken = action.payload.accessToken;
    },
    setAccessToken(state: State, action: PayloadAction<string>) {
      state.accessToken = action.payload;
    },
    setMoney(state: State, action: PayloadAction<number>) {
      state.money = action.payload;
    },
  },
  extraReducers: builder => {},
});

export default userSlice;
