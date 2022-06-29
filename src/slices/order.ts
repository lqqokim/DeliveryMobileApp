import {createSlice, PayloadAction} from '@reduxjs/toolkit';

export interface Order {
  orderId: string;
  start: {
    latitude: number;
    longitude: number;
  };
  end: {
    latitude: number;
    longitude: number;
  };
  price: number;
}

interface State {
  orders: Order[];
  deliveries: Order[];
}

const initialState: State = {
  orders: [],
  deliveries: [],
};

const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {
    addOrder(state: State, action: PayloadAction<Order>) {
      state.orders.push(action.payload);
    },
    acceptOrder(state: State, action: PayloadAction<string>) {
      const index = state.orders.findIndex(v => v.orderId === action.payload);
      if (index > -1) {
        state.deliveries.push(state.orders[index]);
        state.orders.splice(index, 1);
      }
    },
    rejectOrder(state: State, action: PayloadAction<string>) {
      const index = state.orders.findIndex(v => v.orderId === action.payload);
      if (index > -1) {
        state.orders.splice(index, 1);
      }
      const delivery = state.deliveries.findIndex(
        v => v.orderId === action.payload,
      );
      if (delivery > -1) {
        state.deliveries.splice(delivery, 1);
      }
    },
  },
  extraReducers: builder => {},
});

export default orderSlice;
