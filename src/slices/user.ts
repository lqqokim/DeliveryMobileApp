import {createSlice} from '@reduxjs/toolkit';

/**
 * action: state 를 바꾸는 행위
 * dispatch: action 을 실제로 실행하는 함수
 * reducer: action 이 실제로 실행되면 state
 */

const initialState = {
  name: '',
  email: '',
  accessToken: '',
};
const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser(state, action) {
      state.email = action.payload.email;
      state.name = action.payload.name;
      state.accessToken = action.payload.accessToken;
    },
  },
  // 비동기 처리
  extraReducers: builder => {},
});

export default userSlice;
