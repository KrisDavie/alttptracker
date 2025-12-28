import ItemsData from "@/data/itemData";
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

interface ItemState {
  amount: number;
  manuallyChanged?: boolean;
}

export interface ItemsState {
  [key: string]: ItemState;
}

const itemInitialState: ItemState = {
  amount: 0,
  manuallyChanged: false,
};

const initialState: Record<string, ItemState> = Object.keys(ItemsData).reduce((acc, itemName) => {
  if (itemName.startsWith("bottle")) return acc; // bottles are added manually below
  acc[itemName] = { ...itemInitialState };
  return acc;
}, {} as Record<string, ItemState>);

// Manually add bottles (duplicated items with different storage keys)
initialState["bottle1"] = { ...itemInitialState };
initialState["bottle2"] = { ...itemInitialState };
initialState["bottle3"] = { ...itemInitialState };
initialState["bottle4"] = { ...itemInitialState };

export const itemsSlice = createSlice({
  name: "items",
  initialState,
  reducers: {
    setItemCount: (state, action: PayloadAction<{ itemName: string; count: number }>) => {
      const { itemName, count } = action.payload;
      if (state[itemName] === undefined) {
        state[itemName] = { ...itemInitialState };
      }
      state[itemName].amount = count;
      state[itemName].manuallyChanged = true;
    },
    incrementItemCount: (state, action: PayloadAction<{ itemName: string; decrement: boolean; skipFirstImgOnCollect: boolean; storageKey?: string }>) => {
      const { itemName, decrement, skipFirstImgOnCollect, storageKey } = action.payload;
      const itemData = ItemsData[itemName as keyof typeof ItemsData];
      const maxCount = itemData.maxCount - (skipFirstImgOnCollect ? 1 : 0);

      // This accounts for multiple items from the same item (i.e. bottles)
      const storageKeyUsed = storageKey || itemName;
      if (state[storageKeyUsed] === undefined) {
        state[storageKeyUsed] = { ...itemInitialState };
      }
      const currentCount = state[storageKeyUsed].amount;

      if (decrement) {
        state[storageKeyUsed].amount = (currentCount - 1 + (maxCount + 1)) % (maxCount + 1);
      } else {
        state[storageKeyUsed].amount = (currentCount + 1) % (maxCount + 1);
      }
      state[storageKeyUsed].manuallyChanged = true;
    },
    updateMultipleItems: (state, action: PayloadAction<Record<string, number>>) => {
      Object.entries(action.payload).forEach(([itemName, count]) => {
        if (state[itemName].manuallyChanged) {
          return;
        }
        state[itemName].amount = count;
      });
    },
  },
});

export const { setItemCount, incrementItemCount, updateMultipleItems } = itemsSlice.actions;
export default itemsSlice.reducer;
