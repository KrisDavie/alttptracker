import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

interface ItemState {
  amount: number;
  manuallyChanged?: boolean;
}

export interface ItemsState {
  items: Record<string, ItemState>;
}

const initialState: ItemsState = {
  items: {},
};

export const itemsSlice = createSlice({
  name: "items",
  initialState,
  reducers: {
    setItemCount: (state, action: PayloadAction<{ itemName: string; count: number }>) => {
      const { itemName, count } = action.payload;
      if (!state.items[itemName]) {
        state.items[itemName] = { amount: 0 };
      }
      state.items[itemName].amount = count;
      state.items[itemName].manuallyChanged = true;
    },
    updateMultipleItems: (state, action: PayloadAction<Record<string, number>>) => {
      Object.entries(action.payload).forEach(([itemName, count]) => {
        if (!state.items[itemName]) {
          state.items[itemName] = { amount: 0 };
        }
        if (state.items[itemName].manuallyChanged) {
          return;
        }
        state.items[itemName].amount = count;
        
      });
    },
  },
});

export const { setItemCount, updateMultipleItems } = itemsSlice.actions;
export default itemsSlice.reducer;
