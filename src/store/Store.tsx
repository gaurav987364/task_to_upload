import {configureStore} from "@reduxjs/toolkit";
import { FormSlice } from "../slices/FormSlice";

const Store = configureStore({
    reducer:{
        formRed:FormSlice.reducer,
    },
});


//types:
export type ActionState = ReturnType<typeof Store.getState>;
export type Dispatch = typeof Store.dispatch;
export default Store;