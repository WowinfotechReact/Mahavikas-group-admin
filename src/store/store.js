import { persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import storageSliceReducer from "./Persist";
import { configureStore } from "@reduxjs/toolkit";

const persistConfig = { key: "Velvet", version: 1, storage };

const persistReducerBlock = persistReducer(persistConfig, storageSliceReducer);

export const store = configureStore({
  reducer: {
    Storage: persistReducerBlock
  }
});
