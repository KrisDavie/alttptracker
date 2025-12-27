import ItemsData from "@/data/itemData";
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

interface ItemState {
  amount: number;
  manuallyChanged?: boolean;
}

export interface ItemsState {
  items: Record<string, ItemState>;
}

const itemInitialState: ItemState = {
  amount: 0,
  manuallyChanged: false,
};

const initialState: ItemsState = {
  items: Object.keys(ItemsData).reduce((acc, itemName) => {
    acc[itemName] = { ...itemInitialState };
    return acc;
  }, {} as Record<string, ItemState>),
};

export const itemsSlice = createSlice({
  name: "items",
  initialState,
  reducers: {
    setItemCount: (state, action: PayloadAction<{ itemName: string; count: number }>) => {
      const { itemName, count } = action.payload;
      if (state.items[itemName] === undefined) {
        state.items[itemName] = { ...itemInitialState };
      }
      state.items[itemName].amount = count;
      state.items[itemName].manuallyChanged = true;
    },
    incrementItemCount: (state, action: PayloadAction<{ itemName: string, decrement: boolean, skipFirstImgOnCollect: boolean, storageKey?: string }>) => {
      const { itemName, decrement, skipFirstImgOnCollect, storageKey } = action.payload;
      const itemData = ItemsData[itemName as keyof typeof ItemsData];
      const maxCount = itemData.maxCount - (skipFirstImgOnCollect ? 1 : 0);
      
      // This accounts for multiple items from the same item (i.e. bottles)
      const storageKeyUsed = storageKey || itemName;
      if (state.items[storageKeyUsed] === undefined) {
        state.items[storageKeyUsed] = { ...itemInitialState };
      }
      const currentCount = state.items[storageKeyUsed].amount;
  
      if (decrement) {
        state.items[storageKeyUsed].amount = (currentCount - 1 + (maxCount + 1)) % (maxCount + 1);
      } else {
        state.items[storageKeyUsed].amount = (currentCount + 1) % (maxCount + 1);
      }
      state.items[storageKeyUsed].manuallyChanged = true;
    },
    updateMultipleItems: (state, action: PayloadAction<Record<string, number>>) => {
      Object.entries(action.payload).forEach(([itemName, count]) => {
        if (state.items[itemName].manuallyChanged) {
          return;
        }
        state.items[itemName].amount = count;
      });
    },
  },
});

export const { setItemCount, incrementItemCount, updateMultipleItems } = itemsSlice.actions;
export default itemsSlice.reducer;
